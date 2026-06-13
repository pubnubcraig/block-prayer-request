import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { sharedPrayers } from '@/lib/db/schema';
import { moderateInput } from '@/prayer_request/lib/moderation';
import { detectPII } from '@/lib/prayer-wall/moderation';
import { generateSlug } from '@/lib/prayer-wall/slug';
import { logPrayerWallEvent } from '@/lib/prayer-wall/analytics';
import { checkRateLimit } from '@/lib/rate-limit';

function truncateAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

async function generateTitleAndSummary(
  requestText: string,
): Promise<{ title: string; summary: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      title: 'Prayer Request',
      summary: truncateAtWord(requestText, 150),
    };
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.4,
    max_tokens: 200,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You generate a short title and summary for a prayer request to display on a public prayer wall. The title should be max 12 words. The summary should be 1-2 sentences, warm and inviting. Do NOT include any personal identifying information (names, locations, phone numbers, emails). Respond in JSON: { "title": "...", "summary": "..." }',
      },
      {
        role: 'user',
        content: requestText,
      },
    ],
  });

  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      title: parsed.title || 'Prayer Request',
      summary: parsed.summary || truncateAtWord(requestText, 150),
    };
  } catch {
    return {
      title: 'Prayer Request',
      summary: truncateAtWord(requestText, 150),
    };
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // Rate limit: reuse existing limiter with a prefixed key
  const rateLimitResult = checkRateLimit(`share:${ip}`);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before sharing again.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const requestText =
    typeof body.requestText === 'string' ? body.requestText.trim() : '';
  const bibleVerse =
    typeof body.bibleVerse === 'string' ? body.bibleVerse.trim() : '';
  const verseContent =
    typeof body.verseContent === 'string' ? body.verseContent.trim() : '';
  const prayer =
    typeof body.prayer === 'string' ? body.prayer.trim() : '';
  const verseInterpretation =
    typeof body.verseInterpretation === 'string'
      ? body.verseInterpretation.trim()
      : '';
  const advice =
    typeof body.advice === 'string' ? body.advice.trim() : '';
  const displayNameType =
    body.displayNameType === 'first_name' ? 'first_name' : 'anonymous';
  const firstName =
    displayNameType === 'first_name' && typeof body.firstName === 'string'
      ? body.firstName.trim().slice(0, 50)
      : null;

  if (!requestText || !bibleVerse || !verseContent || !prayer) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 },
    );
  }

  if (displayNameType === 'first_name' && !firstName) {
    return NextResponse.json(
      { error: 'First name is required when sharing with your name.' },
      { status: 400 },
    );
  }

  // Validate first name format
  if (firstName && !/^[A-Za-z\s'-]+$/.test(firstName)) {
    return NextResponse.json(
      { error: 'First name may only contain letters, spaces, hyphens, and apostrophes.' },
      { status: 400 },
    );
  }

  // PII detection
  const pii = detectPII(requestText);
  if (pii.found) {
    return NextResponse.json(
      {
        error: `Your prayer request appears to contain personal information (${pii.types.join(', ')}). Please remove it before sharing.`,
      },
      { status: 400 },
    );
  }

  // Content moderation
  const modResult = await moderateInput(requestText);
  if (modResult.blocked) {
    return NextResponse.json(
      { error: 'This content cannot be shared on the prayer wall.' },
      { status: 400 },
    );
  }
  if (modResult.crisis) {
    return NextResponse.json(
      {
        error:
          'If you or someone you know is in crisis, please call 988 or text HOME to 741741. This prayer request cannot be shared publicly.',
      },
      { status: 400 },
    );
  }

  // Generate public title and summary
  const { title, summary } = await generateTitleAndSummary(requestText);

  // Generate slug
  const slug = generateSlug(title);

  // Generate prayer excerpt
  const prayerExcerpt = truncateAtWord(prayer, 200);

  // Check auth for optional user linkage
  let userId: string | null = null;
  try {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
    }
  } catch {
    // Not authenticated — fine
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service unavailable.' },
      { status: 503 },
    );
  }

  try {
    await db.insert(sharedPrayers).values({
      userId,
      displayNameType,
      firstName,
      publicTitle: title,
      publicSummary: summary,
      requestText,
      verseReference: bibleVerse,
      verseText: verseContent,
      prayerExcerpt,
      fullPrayer: prayer,
      interpretation: verseInterpretation || null,
      practicalGuidance: advice || null,
      slug,
      consentPublicUse: true,
      moderationPassed: !modResult.flagged,
      moderationCategories: modResult.flagged
        ? JSON.stringify(modResult.categories)
        : null,
    });

    logPrayerWallEvent({
      event: 'prayer_wall_share',
      slug,
      displayNameType,
    });

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    console.error(
      '[prayer-wall] Failed to insert shared prayer:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to share prayer. Please try again.' },
      { status: 500 },
    );
  }
}

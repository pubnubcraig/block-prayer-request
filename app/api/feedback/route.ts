import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const GITHUB_REPO = 'pubnubcraig/block-prayer-request';

const CATEGORY_LABELS: Record<string, string> = {
  bug: 'bug',
  feature: 'enhancement',
  general: 'feedback',
};

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true; // allow if Redis unavailable

  const key = `feedback_rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  return count <= 5;
}

export async function POST(request: NextRequest) {
  const token = process.env.GITHUB_FEEDBACK_TOKEN;
  if (!token) {
    console.error('[feedback] GITHUB_FEEDBACK_TOKEN is not set');
    return NextResponse.json(
      { error: 'Feedback is temporarily unavailable.' },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { category, subject, description, name, email, website } = body as {
    category?: string;
    subject?: string;
    description?: string;
    name?: string;
    email?: string;
    website?: string;
  };

  // Honeypot check
  if (website) {
    return NextResponse.json({ success: true, issueNumber: 0 });
  }

  if (
    !category ||
    !subject ||
    !description ||
    !CATEGORY_LABELS[category]
  ) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.' },
      { status: 400 },
    );
  }

  if (subject.length > 100) {
    return NextResponse.json(
      { error: 'Subject must be 100 characters or fewer.' },
      { status: 400 },
    );
  }

  if (description.length > 5000) {
    return NextResponse.json(
      { error: 'Description must be 5,000 characters or fewer.' },
      { status: 400 },
    );
  }

  const categoryLabel =
    category === 'bug'
      ? 'Bug Report'
      : category === 'feature'
        ? 'Feature Request'
        : 'General Feedback';

  const contactLines: string[] = [];
  if (name?.trim()) contactLines.push(`**Name:** ${name.trim()}`);
  if (email?.trim()) contactLines.push(`**Email:** ${email.trim()}`);

  const issueBody = [
    `### ${categoryLabel}`,
    '',
    description.trim(),
    '',
    ...(contactLines.length > 0
      ? ['---', '### Contact Info', ...contactLines, '']
      : []),
    '---',
    `*Submitted via GoFish feedback form on ${new Date().toISOString().split('T')[0]}*`,
  ].join('\n');

  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `[${categoryLabel}] ${subject.trim()}`,
          body: issueBody,
          labels: [CATEGORY_LABELS[category]],
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[feedback] GitHub API error:', res.status, errText);
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: 502 },
      );
    }

    const issue = (await res.json()) as { number: number };
    return NextResponse.json({ success: true, issueNumber: issue.number });
  } catch (err) {
    console.error(
      '[feedback] Error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to submit feedback. Please try again.' },
      { status: 500 },
    );
  }
}

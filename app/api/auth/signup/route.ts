import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { users, userProfiles, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true;

  const key = `signup_rate:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 3600); // 1 hour window
  }
  return count <= 5;
}

function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number.';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // TODO: re-enable rate limiting after initial testing
  // const allowed = await checkRateLimit(ip);
  // if (!allowed) {
  //   return NextResponse.json(
  //     { error: 'Too many signup attempts. Please try again later.' },
  //     { status: 429 },
  //   );
  // }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { email, password, name } = body as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Please provide a valid email address.' },
      { status: 400 },
    );
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  try {
    // Check email uniqueness
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        name: name?.trim() || null,
        hashedPassword,
      })
      .returning({ id: users.id });

    // Create empty profile
    await db.insert(userProfiles).values({
      userId: newUser.id,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(verificationTokens).values({
      identifier: email.toLowerCase(),
      token,
      expires,
    });

    // Send verification email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const baseUrl =
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : 'http://localhost:3000');
      const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'GoFish <noreply@gofish.app>',
        to: email.toLowerCase(),
        subject: 'Verify your GoFish account',
        html: `
          <h2>Welcome to GoFish!</h2>
          <p>Please verify your email address by clicking the link below:</p>
          <p><a href="${verifyUrl}">Verify my email</a></p>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        `,
      });
    } else {
      console.warn(
        '[signup] RESEND_API_KEY not set — skipping verification email',
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created. Please check your email to verify.',
    });
  } catch (err: unknown) {
    const e = err instanceof Error ? err : new Error(String(err));
    const cause = (e as Error & { cause?: Error }).cause;
    console.error('[signup] Error:', e.message);
    if (cause) console.error('[signup] Cause:', cause.message, JSON.stringify({ code: (cause as unknown as Record<string, unknown>).code, detail: (cause as unknown as Record<string, unknown>).detail }));
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 },
    );
  }
}

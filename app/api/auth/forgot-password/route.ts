import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { getDb } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { email } = body as { email?: string };
  if (!email) {
    return NextResponse.json(
      { error: 'Email is required.' },
      { status: 400 },
    );
  }

  // Always return success to prevent email enumeration
  const successResponse = NextResponse.json({
    success: true,
    message: 'If an account exists with that email, a reset link has been sent.',
  });

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) return successResponse;

    // Only allow reset for users with a password (not OAuth-only)
    if (!user.hashedPassword) return successResponse;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.insert(verificationTokens).values({
      identifier: `reset:${email.toLowerCase()}`,
      token,
      expires,
    });

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      const baseUrl =
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'GoFish <noreply@gofish.app>',
        to: email.toLowerCase(),
        subject: 'Reset your GoFish password',
        html: `
          <h2>Password Reset</h2>
          <p>You requested a password reset for your GoFish account.</p>
          <p><a href="${resetUrl}">Reset my password</a></p>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } else {
      console.warn(
        '[forgot-password] RESEND_API_KEY not set — skipping reset email',
      );
    }

    return successResponse;
  } catch (err) {
    console.error(
      '[forgot-password] Error:',
      err instanceof Error ? err.message : err,
    );
    // Return success anyway to prevent enumeration
    return successResponse;
  }
}

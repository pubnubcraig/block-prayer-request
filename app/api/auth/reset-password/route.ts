import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

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

  const { email, token, password } = body as {
    email?: string;
    token?: string;
    password?: string;
  };

  if (!email || !token || !password) {
    return NextResponse.json(
      { error: 'Email, token, and new password are required.' },
      { status: 400 },
    );
  }

  // Validate new password
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }
  if (!/[A-Z]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain at least one uppercase letter.' },
      { status: 400 },
    );
  }
  if (!/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: 'Password must contain at least one number.' },
      { status: 400 },
    );
  }

  try {
    // Look up reset token (prefixed with "reset:")
    const record = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, `reset:${email.toLowerCase()}`),
        eq(verificationTokens.token, token),
      ),
    });

    if (!record) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link.' },
        { status: 400 },
      );
    }

    if (new Date() > record.expires) {
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(
              verificationTokens.identifier,
              `reset:${email.toLowerCase()}`,
            ),
            eq(verificationTokens.token, token),
          ),
        );
      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await db
      .update(users)
      .set({ hashedPassword, updatedAt: new Date() })
      .where(eq(users.email, email.toLowerCase()));

    // Delete used token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, `reset:${email.toLowerCase()}`),
          eq(verificationTokens.token, token),
        ),
      );

    return NextResponse.json({
      success: true,
      message: 'Password has been reset. You can now sign in.',
    });
  } catch (err) {
    console.error(
      '[reset-password] Error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 },
    );
  }
}

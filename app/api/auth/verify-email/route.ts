import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users, verificationTokens } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return NextResponse.redirect(
      new URL('/login?error=invalid-token', request.url),
    );
  }

  try {
    // Look up the verification token
    const record = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.identifier, email.toLowerCase()),
        eq(verificationTokens.token, token),
      ),
    });

    if (!record) {
      return NextResponse.redirect(
        new URL('/login?error=invalid-token', request.url),
      );
    }

    // Check expiration
    if (new Date() > record.expires) {
      // Clean up expired token
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, email.toLowerCase()),
            eq(verificationTokens.token, token),
          ),
        );
      return NextResponse.redirect(
        new URL('/login?error=token-expired', request.url),
      );
    }

    // Mark email as verified
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.email, email.toLowerCase()));

    // Delete used token
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, email.toLowerCase()),
          eq(verificationTokens.token, token),
        ),
      );

    return NextResponse.redirect(
      new URL('/login?verified=true', request.url),
    );
  } catch (err) {
    console.error(
      '[verify-email] Error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.redirect(
      new URL('/login?error=verification-failed', request.url),
    );
  }
}

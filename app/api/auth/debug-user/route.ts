import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// TEMPORARY debug endpoint — remove after testing
export async function POST(request: NextRequest) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'No DB' }, { status: 503 });
  }

  const { email, password, action } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });

  if (!user) {
    return NextResponse.json({ found: false, email: email.toLowerCase() });
  }

  // Reset password action
  if (action === 'reset-password' && password) {
    const hashed = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ hashedPassword: hashed, updatedAt: new Date() })
      .where(eq(users.email, email.toLowerCase()));
    return NextResponse.json({ success: true, message: 'Password reset' });
  }

  const result: Record<string, unknown> = {
    found: true,
    email: user.email,
    hasHashedPassword: !!user.hashedPassword,
    emailVerified: user.emailVerified,
    emailVerifiedType: typeof user.emailVerified,
    createdAt: user.createdAt,
  };

  if (password && user.hashedPassword) {
    result.passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  }

  return NextResponse.json(result);
}

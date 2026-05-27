import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 },
    );
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current password and new password are required.' },
      { status: 400 },
    );
  }

  // Password policy
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }
  if (!/[A-Z]/.test(newPassword)) {
    return NextResponse.json(
      { error: 'Password must contain at least one uppercase letter.' },
      { status: 400 },
    );
  }
  if (!/[0-9]/.test(newPassword)) {
    return NextResponse.json(
      { error: 'Password must contain at least one number.' },
      { status: 400 },
    );
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user?.hashedPassword) {
      return NextResponse.json(
        { error: 'Password change is not available for this account.' },
        { status: 400 },
      );
    }

    const valid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!valid) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({ hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      '[change-password] Error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to change password.' },
      { status: 500 },
    );
  }
}

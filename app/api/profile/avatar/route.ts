import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only JPG, PNG, and WebP images are allowed.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Image must be under 2 MB.' },
      { status: 400 },
    );
  }

  try {
    // Delete old avatar if exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { image: true },
    });

    if (user?.image) {
      try {
        await del(user.image);
      } catch {
        // Old blob may not exist, ignore
      }
    }

    // Upload new avatar
    const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1];
    const blob = await put(`avatars/${session.user.id}.${ext}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update user record
    await db
      .update(users)
      .set({ image: blob.url, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(
      '[avatar] Upload error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to upload image.' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
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

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { image: true },
    });

    if (user?.image) {
      try {
        await del(user.image);
      } catch {
        // Blob may not exist, ignore
      }
    }

    await db
      .update(users)
      .set({ image: null, updatedAt: new Date() })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      '[avatar] Delete error:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to remove image.' },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { listSharedPrayers } from '@/lib/prayer-wall/queries';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const limit = Math.min(
    24,
    Math.max(1, parseInt(searchParams.get('limit') || '12', 10) || 12),
  );

  try {
    const { items, total } = await listSharedPrayers(page, limit);
    return NextResponse.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(
      '[prayer-wall] Failed to list shared prayers:',
      err instanceof Error ? err.message : err,
    );
    return NextResponse.json(
      { error: 'Failed to load prayer wall.' },
      { status: 500 },
    );
  }
}

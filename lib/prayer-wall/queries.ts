import { eq, and, desc, sql, count } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { sharedPrayers } from '@/lib/db/schema';
import type { ShareDisplayNameType } from '@/lib/types';

export async function getSharedPrayerBySlug(slug: string) {
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .select()
    .from(sharedPrayers)
    .where(
      and(
        eq(sharedPrayers.slug, slug),
        eq(sharedPrayers.isPublic, true),
        eq(sharedPrayers.isApproved, true),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function listSharedPrayers(page: number, limit: number) {
  const db = getDb();
  if (!db) return { items: [], total: 0 };

  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: sharedPrayers.id,
        publicTitle: sharedPrayers.publicTitle,
        publicSummary: sharedPrayers.publicSummary,
        verseReference: sharedPrayers.verseReference,
        prayerExcerpt: sharedPrayers.prayerExcerpt,
        displayNameType: sharedPrayers.displayNameType,
        firstName: sharedPrayers.firstName,
        slug: sharedPrayers.slug,
        prayedCount: sharedPrayers.prayedCount,
        createdAt: sharedPrayers.createdAt,
      })
      .from(sharedPrayers)
      .where(
        and(
          eq(sharedPrayers.isPublic, true),
          eq(sharedPrayers.isApproved, true),
        ),
      )
      .orderBy(desc(sharedPrayers.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(sharedPrayers)
      .where(
        and(
          eq(sharedPrayers.isPublic, true),
          eq(sharedPrayers.isApproved, true),
        ),
      ),
  ]);

  return {
    items: items.map((row) => ({
      ...row,
      displayNameType: row.displayNameType as ShareDisplayNameType,
      createdAt: row.createdAt.toISOString(),
    })),
    total: totalResult[0]?.count ?? 0,
  };
}

export async function incrementPrayedCount(slug: string) {
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .update(sharedPrayers)
    .set({
      prayedCount: sql`${sharedPrayers.prayedCount} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(sharedPrayers.slug, slug),
        eq(sharedPrayers.isPublic, true),
        eq(sharedPrayers.isApproved, true),
      ),
    )
    .returning({ prayedCount: sharedPrayers.prayedCount });

  return rows[0]?.prayedCount ?? null;
}

export async function incrementShareCount(slug: string) {
  const db = getDb();
  if (!db) return null;

  const rows = await db
    .update(sharedPrayers)
    .set({
      shareCount: sql`${sharedPrayers.shareCount} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(sharedPrayers.slug, slug),
        eq(sharedPrayers.isPublic, true),
        eq(sharedPrayers.isApproved, true),
      ),
    )
    .returning({ shareCount: sharedPrayers.shareCount });

  return rows[0]?.shareCount ?? null;
}

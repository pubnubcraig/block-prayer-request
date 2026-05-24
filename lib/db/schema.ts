import {
  pgTable,
  serial,
  varchar,
  integer,
  bigint,
  timestamp,
} from 'drizzle-orm/pg-core';

export const prayerUsageMetrics = pgTable('prayer_usage_metrics', {
  id: serial('id').primaryKey(),
  bibleVersion: varchar('bible_version', { length: 50 }).notNull(),
  tokensUsed: integer('tokens_used').notNull(),
  responseTimeMs: integer('response_time_ms').notNull(),
  costCents: integer('cost_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const moderationLogs = pgTable('moderation_logs', {
  id: serial('id').primaryKey(),
  category: varchar('category', { length: 100 }).notNull(),
  severity: varchar('severity', { length: 50 }).notNull(),
  actionTaken: varchar('action_taken', { length: 50 }).notNull(),
  ipHash: varchar('ip_hash', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const appStats = pgTable('app_stats', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: bigint('value', { mode: 'number' }).notNull().default(0),
});

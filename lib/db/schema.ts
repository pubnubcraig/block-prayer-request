import {
  pgTable,
  serial,
  varchar,
  integer,
  bigint,
  timestamp,
  text,
  uuid,
  date,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';

// ── Existing tables ─────────────────────────────────────────────────

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

// ── Auth.js required tables ─────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  hashedPassword: text('hashed_password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
});

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: varchar('identifier', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

// ── User profile ────────────────────────────────────────────────────

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Bible & faith
  favoriteVerse: text('favorite_verse'),
  bibleVersion: varchar('bible_version', { length: 10 }).default('NIV'),
  denomination: varchar('denomination', { length: 100 }),
  faithStage: varchar('faith_stage', { length: 50 }),
  prayerTopics: text('prayer_topics'), // JSON array, e.g. '["anxiety","family"]'

  // Personal (dateOfBirth and sex are encrypted at app level)
  dateOfBirth: text('date_of_birth'),
  sex: text('sex'),
  maritalStatus: varchar('marital_status', { length: 30 }),
  occupation: varchar('occupation', { length: 100 }),

  // Community
  churchName: varchar('church_name', { length: 200 }),
  timezone: varchar('timezone', { length: 60 }),

  // Preferences
  prayerHistoryMode: varchar('prayer_history_mode', { length: 20 }).default(
    'save-per-request',
  ),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ── Prayer history ──────────────────────────────────────────────────

export const prayerHistory = pgTable('prayer_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  requestText: text('request_text'), // encrypted at app level
  bibleVerse: varchar('bible_verse', { length: 255 }),
  verseContent: text('verse_content'),
  interpretation: text('interpretation'),
  advice: text('advice'),
  prayer: text('prayer'),
  bibleVersionUsed: varchar('bible_version_used', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
});

// ── Facebook prayer posts ──────────────────────────────────────────

export const prayerTopics = pgTable('prayer_topics', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic: varchar('topic', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  verseReference: varchar('verse_reference', { length: 100 }).notNull(),
  verseText: text('verse_text').notNull(),
  active: boolean('active').notNull().default(true),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const facebookPostLog = pgTable('facebook_post_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  topicId: uuid('topic_id').references(() => prayerTopics.id),
  postContent: text('post_content'),
  facebookPostId: varchar('facebook_post_id', { length: 255 }),
  postedAt: timestamp('posted_at'),
  status: varchar('status', { length: 20 }).notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

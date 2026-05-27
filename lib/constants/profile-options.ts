export const DENOMINATIONS = [
  'Non-denominational',
  'Baptist',
  'Catholic',
  'Methodist',
  'Presbyterian',
  'Lutheran',
  'Pentecostal',
  'Anglican/Episcopal',
  'Church of Christ',
  'Assemblies of God',
  'Seventh-day Adventist',
  'Orthodox',
  'Other',
  'Prefer not to say',
] as const;

export const FAITH_STAGES = [
  'Exploring',
  'Seeker',
  'New Believer',
  'Growing',
  'Mature',
  'Leader',
] as const;

export const SEX_OPTIONS = [
  'Male',
  'Female',
  'Prefer not to say',
] as const;

export const MARITAL_STATUSES = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Separated',
  'Prefer not to say',
] as const;

export const OCCUPATIONS = [
  'Student',
  'Employed (Full-time)',
  'Employed (Part-time)',
  'Self-employed',
  'Homemaker',
  'Retired',
  'Unemployed',
  'Ministry (Full-time)',
  'Military',
  'Other',
  'Prefer not to say',
] as const;

export const PRAYER_TOPICS = [
  'Anxiety',
  'Relationships',
  'Health',
  'Finances',
  'Career',
  'Family',
  'Grief',
  'Addiction',
  'Spiritual Growth',
  'Gratitude',
  'Purpose',
  'Forgiveness',
] as const;

export const PRAYER_HISTORY_MODES = [
  'save-all',
  'save-per-request',
  'do-not-save',
] as const;

export const BIBLE_VERSIONS = ['ASV', 'NIV', 'EASY', 'NASB'] as const;

// Derive types from the const arrays
export type Denomination = (typeof DENOMINATIONS)[number];
export type FaithStage = (typeof FAITH_STAGES)[number];
export type SexOption = (typeof SEX_OPTIONS)[number];
export type MaritalStatus = (typeof MARITAL_STATUSES)[number];
export type Occupation = (typeof OCCUPATIONS)[number];
export type PrayerTopic = (typeof PRAYER_TOPICS)[number];
export type PrayerHistoryMode = (typeof PRAYER_HISTORY_MODES)[number];
export type BibleVersion = (typeof BIBLE_VERSIONS)[number];

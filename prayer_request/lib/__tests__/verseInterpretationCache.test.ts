import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedInterpretation, cacheInterpretation } from '../verseInterpretationCache';

// Mock the database module
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();
const mockThen = vi.fn();
const mockValues = vi.fn();
const mockOnConflictDoUpdate = vi.fn();
const mockSet = vi.fn();

const mockDb = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
};

vi.mock('@/lib/db', () => ({
  getDb: vi.fn(() => mockDb),
}));

vi.mock('@/lib/db/schema', () => ({
  bibleVerseInterpretations: {
    verseReference: 'verse_reference',
    translation: 'translation',
    promptVersion: 'prompt_version',
    id: 'id',
    usageCount: 'usage_count',
    lastUsedAt: 'last_used_at',
  },
}));

vi.mock('../promptVersion.js', () => ({
  INTERPRETATION_PROMPT_VERSION: '1.0.0',
}));

vi.mock('../normalizeVerseReference.js', () => ({
  normalizeVerseReference: (ref: string) => ref.trim().toLowerCase(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  // Default chain for select
  mockSelect.mockReturnValue({ from: mockFrom });
  mockFrom.mockReturnValue({ where: mockWhere });
  mockWhere.mockReturnValue({ limit: mockLimit });
  mockLimit.mockReturnValue({ then: mockThen });

  // Default chain for insert
  mockInsert.mockReturnValue({ values: mockValues });
  mockValues.mockReturnValue({ onConflictDoUpdate: mockOnConflictDoUpdate });
  mockOnConflictDoUpdate.mockResolvedValue(undefined);

  // Default chain for update
  mockUpdate.mockReturnValue({ set: mockSet });
  mockSet.mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) });
});

describe('getCachedInterpretation', () => {
  it('returns null on cache miss (no matching row)', async () => {
    mockLimit.mockReturnValue({ then: (fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([])) });

    const result = await getCachedInterpretation('John 3:16', 'ASV');
    expect(result).toBeNull();
  });

  it('returns cached interpretation on cache hit', async () => {
    const row = { id: 'abc-123', interpretation: 'God loves the world.' };
    mockLimit.mockReturnValue({ then: (fn: (rows: unknown[]) => unknown) => Promise.resolve(fn([row])) });

    const result = await getCachedInterpretation('John 3:16', 'ASV');
    expect(result).toEqual({
      interpretation: 'God loves the world.',
      fromCache: true,
    });
  });

  it('returns null when getDb() returns null', async () => {
    const { getDb } = await import('@/lib/db');
    (getDb as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

    const result = await getCachedInterpretation('John 3:16', 'ASV');
    expect(result).toBeNull();
  });

  it('returns null on database error without throwing', async () => {
    mockSelect.mockImplementation(() => {
      throw new Error('DB connection failed');
    });

    const result = await getCachedInterpretation('John 3:16', 'ASV');
    expect(result).toBeNull();
  });
});

describe('cacheInterpretation', () => {
  it('inserts a new interpretation', async () => {
    await cacheInterpretation('John 3:16', 'ASV', 'For God so loved...', 'God loves the world.', 'gpt-4o-mini');

    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        verseReference: 'john 3:16',
        translation: 'ASV',
        interpretation: 'God loves the world.',
        modelUsed: 'gpt-4o-mini',
      }),
    );
    expect(mockOnConflictDoUpdate).toHaveBeenCalled();
  });

  it('does not throw when getDb() returns null', async () => {
    const { getDb } = await import('@/lib/db');
    (getDb as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

    await expect(
      cacheInterpretation('John 3:16', 'ASV', 'text', 'interp', 'gpt-4o-mini'),
    ).resolves.toBeUndefined();
  });

  it('does not throw on database error (upsert handles duplicates)', async () => {
    mockOnConflictDoUpdate.mockRejectedValueOnce(new Error('constraint violation'));

    await expect(
      cacheInterpretation('John 3:16', 'ASV', 'text', 'interp', 'gpt-4o-mini'),
    ).resolves.toBeUndefined();
  });
});

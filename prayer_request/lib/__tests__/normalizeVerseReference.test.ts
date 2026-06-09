import { describe, it, expect } from 'vitest';
import { normalizeVerseReference } from '../normalizeVerseReference';

describe('normalizeVerseReference', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalizeVerseReference('  John 3:16  ')).toBe('john 3:16');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeVerseReference('John   3:16')).toBe('john 3:16');
  });

  it('normalizes Roman numeral I prefix', () => {
    expect(normalizeVerseReference('I John 4:7')).toBe('1 john 4:7');
  });

  it('normalizes Roman numeral II prefix', () => {
    expect(normalizeVerseReference('II Corinthians 5:17')).toBe('2 corinthians 5:17');
  });

  it('normalizes Roman numeral III prefix', () => {
    expect(normalizeVerseReference('III John 1:4')).toBe('3 john 1:4');
  });

  it('normalizes ordinal "First" prefix', () => {
    expect(normalizeVerseReference('First John 4:7')).toBe('1 john 4:7');
  });

  it('normalizes ordinal "Second" prefix', () => {
    expect(normalizeVerseReference('Second Corinthians 5:17')).toBe('2 corinthians 5:17');
  });

  it('normalizes ordinal "Third" prefix', () => {
    expect(normalizeVerseReference('Third John 1:4')).toBe('3 john 1:4');
  });

  it('removes spaces around dashes in verse ranges', () => {
    expect(normalizeVerseReference('Psalm 23:1 - 3')).toBe('psalm 23:1-3');
  });

  it('handles already-normalized input', () => {
    expect(normalizeVerseReference('john 3:16')).toBe('john 3:16');
  });

  it('handles chapter-only references', () => {
    expect(normalizeVerseReference('Psalm 23')).toBe('psalm 23');
  });

  it('handles numeric book prefixes without change', () => {
    expect(normalizeVerseReference('1 John 4:7-8')).toBe('1 john 4:7-8');
  });

  it('handles verse range with no spaces around dash', () => {
    expect(normalizeVerseReference('Philippians 4:6-7')).toBe('philippians 4:6-7');
  });
});

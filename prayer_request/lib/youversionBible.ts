import { ApiClient, BibleClient } from '@youversion/platform-core';
import {
  ALLOWED_BIBLE_VERSIONS,
  DEFAULT_BIBLE_VERSION,
  type BibleVersionAbbrev,
  normalizeBibleVersion,
} from './bibleVersions.js';

export type ResolvedVersion = {
  abbrev: BibleVersionAbbrev;
  requestedAbbrev: BibleVersionAbbrev;
  id: number;
  abbreviation: string;
  youversionDeepLink: string;
  copyright: string;
  usedFallback: boolean;
};

/** Known YouVersion version IDs to probe (app license may allow subset). */
const VERSION_CANDIDATE_IDS: Record<BibleVersionAbbrev, number[]> = {
  ASV: [12],
  NIV: [111],
  EASY: [2079],
  NASB: [2692, 100],
};

/** Prefer another allowlisted translation when direct license is missing. */
const VERSION_FALLBACK: Partial<Record<BibleVersionAbbrev, BibleVersionAbbrev>> = {
  EASY: 'NIV',
  NASB: 'NIV',
  ASV: 'NIV',
};

const UNIVERSAL_FALLBACK_IDS = [111, 12, 2079, 2692, 100];

let bibleClient: BibleClient | null = null;
const versionByIdCache = new Map<number, ResolvedVersion>();
let catalogCache: Map<BibleVersionAbbrev, ResolvedVersion> | null = null;

function getBibleClient(): BibleClient {
  if (!bibleClient) {
    const appKey = process.env.YOUVERSION_APP_KEY;
    if (!appKey) {
      throw new Error('YOUVERSION_APP_KEY is not set');
    }
    bibleClient = new BibleClient(
      new ApiClient({ appKey, timeout: Number(process.env.YOUVERSION_TIMEOUT_MS ?? '15000') }),
    );
  }
  return bibleClient;
}

function versionFromApi(
  requested: BibleVersionAbbrev,
  v: {
    id: number;
    abbreviation: string;
    youversion_deep_link: string | URL;
    copyright?: string | null;
  },
  usedFallback: boolean,
): ResolvedVersion {
  return {
    abbrev: requested,
    requestedAbbrev: requested,
    id: v.id,
    abbreviation: v.abbreviation,
    youversionDeepLink: String(v.youversion_deep_link),
    copyright: v.copyright ?? '',
    usedFallback,
  };
}

async function fetchVersionById(id: number): Promise<ResolvedVersion | null> {
  const cached = versionByIdCache.get(id);
  if (cached) return cached;

  try {
    const client = getBibleClient();
    const v = await client.getVersion(id);
    const resolved = versionFromApi(
      normalizeAbbrevFromApi(v.abbreviation, v.title) ?? DEFAULT_BIBLE_VERSION,
      v,
      false,
    );
    versionByIdCache.set(id, resolved);
    return resolved;
  } catch {
    return null;
  }
}

function normalizeAbbrevFromApi(
  abbreviation: string,
  title: string,
): BibleVersionAbbrev | null {
  const ab = abbreviation.toUpperCase();
  const ti = title.toUpperCase();
  for (const allowed of ALLOWED_BIBLE_VERSIONS) {
    if (
      ab === allowed ||
      ab.startsWith(allowed) ||
      ti.includes(allowed) ||
      (allowed === 'ASV' && ti.includes('AMERICAN STANDARD')) ||
      (allowed === 'NIV' && ti.includes('NEW INTERNATIONAL') && !ti.includes('UK')) ||
      (allowed === 'NASB' && ti.includes('NEW AMERICAN STANDARD')) ||
      (allowed === 'EASY' && ti.includes('EASYENGLISH'))
    ) {
      return allowed;
    }
  }
  return null;
}

function matchesTarget(
  v: { abbreviation: string; localized_abbreviation: string; title: string },
  target: BibleVersionAbbrev,
): boolean {
  const ab = v.abbreviation.toUpperCase();
  const loc = v.localized_abbreviation.toUpperCase();
  const ti = v.title.toUpperCase();
  const t = target.toUpperCase();
  return (
    ab === t ||
    ab.startsWith(t) ||
    loc === t ||
    loc.startsWith(t) ||
    ti.includes(t) ||
    (target === 'ASV' && ti.includes('AMERICAN STANDARD')) ||
    (target === 'NASB' && ti.includes('NEW AMERICAN STANDARD')) ||
    (target === 'NIV' && ti.includes('NEW INTERNATIONAL')) ||
    (target === 'EASY' && ti.includes('EASYENGLISH'))
  );
}

async function resolveOne(target: BibleVersionAbbrev): Promise<ResolvedVersion | null> {
  const client = getBibleClient();

  try {
    const { data } = await client.getVersions('en*', undefined, { page_size: 50 });
    const fromList = data.find((v) => matchesTarget(v, target));
    if (fromList) {
      const matched = matchesTarget(fromList, target);
      return versionFromApi(target, fromList, !matched);
    }
  } catch (err) {
    console.warn(
      `[Bible] getVersions call failed for ${target}:`,
      err instanceof Error ? err.message : err,
    );
  }

  for (const id of VERSION_CANDIDATE_IDS[target] ?? []) {
    const v = await fetchVersionById(id);
    if (v) {
      const matched = normalizeAbbrevFromApi(v.abbreviation, v.abbreviation) === target;
      return {
        ...v,
        abbrev: target,
        requestedAbbrev: target,
        usedFallback: !matched,
      };
    }
  }

  return null;
}

async function buildCatalog(): Promise<Map<BibleVersionAbbrev, ResolvedVersion>> {
  if (catalogCache) return catalogCache;

  const map = new Map<BibleVersionAbbrev, ResolvedVersion>();

  for (const target of ALLOWED_BIBLE_VERSIONS) {
    const resolved = await resolveOne(target);
    if (resolved) {
      map.set(target, resolved);
      continue;
    }

    const fallbackAbbrev = VERSION_FALLBACK[target];
    if (fallbackAbbrev && fallbackAbbrev !== target) {
      const fb = map.get(fallbackAbbrev) ?? (await resolveOne(fallbackAbbrev));
      if (fb) {
        map.set(fallbackAbbrev, { ...fb, abbrev: fallbackAbbrev, requestedAbbrev: fallbackAbbrev, usedFallback: false });
        map.set(target, {
          ...fb,
          abbrev: target,
          requestedAbbrev: target,
          usedFallback: true,
        });
        continue;
      }
    }

    for (const id of UNIVERSAL_FALLBACK_IDS) {
      const v = await fetchVersionById(id);
      if (v) {
        map.set(target, {
          ...v,
          abbrev: target,
          requestedAbbrev: target,
          usedFallback: true,
        });
        break;
      }
    }
  }

  if (!map.has(DEFAULT_BIBLE_VERSION)) {
    for (const id of UNIVERSAL_FALLBACK_IDS) {
      const v = await fetchVersionById(id);
      if (v) {
        map.set(DEFAULT_BIBLE_VERSION, {
          ...v,
          abbrev: DEFAULT_BIBLE_VERSION,
          requestedAbbrev: DEFAULT_BIBLE_VERSION,
          usedFallback: true,
        });
        break;
      }
    }
  }

  catalogCache = map;
  return map;
}

export async function resolveVersions(): Promise<Map<BibleVersionAbbrev, ResolvedVersion>> {
  return buildCatalog();
}

export async function getResolvedVersion(
  bibleVersionInput: unknown,
): Promise<ResolvedVersion> {
  const requested = normalizeBibleVersion(bibleVersionInput);
  const map = await buildCatalog();
  const resolved = map.get(requested) ?? map.get(DEFAULT_BIBLE_VERSION);
  if (!resolved) {
    throw new Error(`No Bible version resolved for ${requested}`);
  }
  console.log(
    `[Bible] Requested: ${requested} → Resolved: ${resolved.abbreviation} (id=${resolved.id}, fallback=${resolved.usedFallback})`,
  );
  return resolved;
}

export type PassageResult = {
  content: string;
  reference: string;
  usfmId: string;
};

export async function fetchPassage(
  versionId: number,
  usfm: string,
): Promise<PassageResult> {
  const client = getBibleClient();
  const passage = await client.getPassage(versionId, usfm, 'text', false, false);
  return {
    content: passage.content.replace(/\s+/g, ' ').trim(),
    reference: passage.reference,
    usfmId: passage.id,
  };
}

export async function fetchPassageWithFallback(
  abbrev: BibleVersionAbbrev,
  usfm: string,
): Promise<{ passage: PassageResult; version: ResolvedVersion }> {
  const version = await getResolvedVersion(abbrev);
  try {
    const passage = await fetchPassage(version.id, usfm);
    return { passage, version };
  } catch (err) {
    console.warn(
      `[Bible] fetchPassage failed for ${version.abbreviation} (id=${version.id}, usfm=${usfm}):`,
      err instanceof Error ? err.message : err,
    );
    // Try the default version if different from what we already tried
    if (abbrev !== DEFAULT_BIBLE_VERSION || version.usedFallback) {
      try {
        const defaultVer = await getResolvedVersion(DEFAULT_BIBLE_VERSION);
        if (defaultVer.id !== version.id) {
          const passage = await fetchPassage(defaultVer.id, usfm);
          return { passage, version: { ...defaultVer, requestedAbbrev: abbrev, usedFallback: true } };
        }
      } catch {
        // Default version also failed, continue to universal fallbacks
      }
    }
    // Try universal fallback IDs as last resort
    for (const id of UNIVERSAL_FALLBACK_IDS) {
      if (id === version.id) continue;
      try {
        const passage = await fetchPassage(id, usfm);
        const fallbackVer = await fetchVersionById(id);
        const resolvedVersion: ResolvedVersion = fallbackVer
          ? { ...fallbackVer, requestedAbbrev: abbrev, usedFallback: true }
          : { ...version, id, requestedAbbrev: abbrev, usedFallback: true };
        return { passage, version: resolvedVersion };
      } catch {
        continue;
      }
    }
    throw err;
  }
}

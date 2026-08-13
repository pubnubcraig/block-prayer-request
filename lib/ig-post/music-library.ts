// Curated library of royalty-free worship instrumental clips for Instagram Reels.
// Each clip is 15-30 seconds, instrumental only (piano, acoustic guitar, strings, soft pads).
// Clips are stored in Vercel Blob and referenced by URL.
//
// To populate: upload 40 clips to Vercel Blob under the ig-music/ prefix,
// then update the MUSIC_CLIPS array with the actual Blob URLs.

export type MusicClip = {
  id: string;
  name: string;
  url: string;
  mood: 'hopeful' | 'peaceful' | 'reflective' | 'worshipful' | 'gentle';
  instrument: 'piano' | 'guitar' | 'strings' | 'orchestral' | 'mixed';
  durationSeconds: number;
};

export const MUSIC_CLIPS: MusicClip[] = [
  // ── Piano — Hopeful ────────────────────────────────────────────────
  { id: 'piano-hopeful-01', name: 'Morning Light Piano', url: '', mood: 'hopeful', instrument: 'piano', durationSeconds: 20 },
  { id: 'piano-hopeful-02', name: 'Dawn Awakening', url: '', mood: 'hopeful', instrument: 'piano', durationSeconds: 25 },
  { id: 'piano-hopeful-03', name: 'Rising Hope', url: '', mood: 'hopeful', instrument: 'piano', durationSeconds: 18 },
  { id: 'piano-hopeful-04', name: 'New Day Grace', url: '', mood: 'hopeful', instrument: 'piano', durationSeconds: 22 },
  { id: 'piano-hopeful-05', name: 'Faithful Morning', url: '', mood: 'hopeful', instrument: 'piano', durationSeconds: 20 },

  // ── Piano — Peaceful ──────────────────────────────────────────────
  { id: 'piano-peaceful-01', name: 'Still Waters Piano', url: '', mood: 'peaceful', instrument: 'piano', durationSeconds: 25 },
  { id: 'piano-peaceful-02', name: 'Quiet Refuge', url: '', mood: 'peaceful', instrument: 'piano', durationSeconds: 20 },
  { id: 'piano-peaceful-03', name: 'Gentle Rest', url: '', mood: 'peaceful', instrument: 'piano', durationSeconds: 22 },
  { id: 'piano-peaceful-04', name: 'Calm Assurance', url: '', mood: 'peaceful', instrument: 'piano', durationSeconds: 18 },
  { id: 'piano-peaceful-05', name: 'Evening Serenity', url: '', mood: 'peaceful', instrument: 'piano', durationSeconds: 25 },

  // ── Piano — Reflective ────────────────────────────────────────────
  { id: 'piano-reflective-01', name: 'Contemplation', url: '', mood: 'reflective', instrument: 'piano', durationSeconds: 25 },
  { id: 'piano-reflective-02', name: 'Deep Thoughts', url: '', mood: 'reflective', instrument: 'piano', durationSeconds: 20 },

  // ── Guitar — Hopeful ──────────────────────────────────────────────
  { id: 'guitar-hopeful-01', name: 'Sunrise Strum', url: '', mood: 'hopeful', instrument: 'guitar', durationSeconds: 20 },
  { id: 'guitar-hopeful-02', name: 'Joyful Morning', url: '', mood: 'hopeful', instrument: 'guitar', durationSeconds: 22 },
  { id: 'guitar-hopeful-03', name: 'Grateful Heart', url: '', mood: 'hopeful', instrument: 'guitar', durationSeconds: 18 },
  { id: 'guitar-hopeful-04', name: 'Walking in Light', url: '', mood: 'hopeful', instrument: 'guitar', durationSeconds: 25 },

  // ── Guitar — Peaceful ─────────────────────────────────────────────
  { id: 'guitar-peaceful-01', name: 'Meadow Breeze', url: '', mood: 'peaceful', instrument: 'guitar', durationSeconds: 20 },
  { id: 'guitar-peaceful-02', name: 'Quiet Stream', url: '', mood: 'peaceful', instrument: 'guitar', durationSeconds: 22 },
  { id: 'guitar-peaceful-03', name: 'Gentle Fingerpick', url: '', mood: 'peaceful', instrument: 'guitar', durationSeconds: 25 },
  { id: 'guitar-peaceful-04', name: 'Resting Place', url: '', mood: 'peaceful', instrument: 'guitar', durationSeconds: 18 },

  // ── Guitar — Reflective ───────────────────────────────────────────
  { id: 'guitar-reflective-01', name: 'Evening Reflection', url: '', mood: 'reflective', instrument: 'guitar', durationSeconds: 25 },
  { id: 'guitar-reflective-02', name: 'Sunset Meditation', url: '', mood: 'reflective', instrument: 'guitar', durationSeconds: 22 },

  // ── Strings — Worshipful ──────────────────────────────────────────
  { id: 'strings-worshipful-01', name: 'Majesty Strings', url: '', mood: 'worshipful', instrument: 'strings', durationSeconds: 25 },
  { id: 'strings-worshipful-02', name: 'Holy Ground', url: '', mood: 'worshipful', instrument: 'strings', durationSeconds: 20 },
  { id: 'strings-worshipful-03', name: 'Throne Room', url: '', mood: 'worshipful', instrument: 'strings', durationSeconds: 22 },
  { id: 'strings-worshipful-04', name: 'Praise Rising', url: '', mood: 'worshipful', instrument: 'strings', durationSeconds: 25 },

  // ── Strings — Gentle ──────────────────────────────────────────────
  { id: 'strings-gentle-01', name: 'Tender Mercy', url: '', mood: 'gentle', instrument: 'strings', durationSeconds: 20 },
  { id: 'strings-gentle-02', name: 'Compassion', url: '', mood: 'gentle', instrument: 'strings', durationSeconds: 25 },
  { id: 'strings-gentle-03', name: 'Healing Touch', url: '', mood: 'gentle', instrument: 'strings', durationSeconds: 22 },

  // ── Orchestral — Hopeful ──────────────────────────────────────────
  { id: 'orchestral-hopeful-01', name: 'Dawn Symphony', url: '', mood: 'hopeful', instrument: 'orchestral', durationSeconds: 25 },
  { id: 'orchestral-hopeful-02', name: 'Victory March', url: '', mood: 'hopeful', instrument: 'orchestral', durationSeconds: 20 },

  // ── Orchestral — Peaceful ─────────────────────────────────────────
  { id: 'orchestral-peaceful-01', name: 'Eternal Peace', url: '', mood: 'peaceful', instrument: 'orchestral', durationSeconds: 25 },
  { id: 'orchestral-peaceful-02', name: 'Garden of Eden', url: '', mood: 'peaceful', instrument: 'orchestral', durationSeconds: 22 },

  // ── Mixed — Worshipful ────────────────────────────────────────────
  { id: 'mixed-worshipful-01', name: 'Piano and Strings Worship', url: '', mood: 'worshipful', instrument: 'mixed', durationSeconds: 25 },
  { id: 'mixed-worshipful-02', name: 'Guitar and Pads', url: '', mood: 'worshipful', instrument: 'mixed', durationSeconds: 22 },

  // ── Mixed — Reflective ────────────────────────────────────────────
  { id: 'mixed-reflective-01', name: 'Evening Prayer', url: '', mood: 'reflective', instrument: 'mixed', durationSeconds: 25 },
  { id: 'mixed-reflective-02', name: 'Sunset Devotion', url: '', mood: 'reflective', instrument: 'mixed', durationSeconds: 20 },

  // ── Mixed — Gentle ────────────────────────────────────────────────
  { id: 'mixed-gentle-01', name: 'Comfort and Peace', url: '', mood: 'gentle', instrument: 'mixed', durationSeconds: 25 },
  { id: 'mixed-gentle-02', name: 'Safe Harbor', url: '', mood: 'gentle', instrument: 'mixed', durationSeconds: 22 },
  { id: 'mixed-gentle-03', name: 'Abiding Love', url: '', mood: 'gentle', instrument: 'mixed', durationSeconds: 20 },
];

type InstagramTheme =
  | 'hope_encouragement'
  | 'engagement_interactive'
  | 'prayer_reflection';

const THEME_MOOD_PREFERENCES: Record<InstagramTheme, MusicClip['mood'][]> = {
  hope_encouragement: ['hopeful', 'worshipful', 'gentle'],
  engagement_interactive: ['hopeful', 'peaceful', 'worshipful'],
  prayer_reflection: ['reflective', 'peaceful', 'gentle'],
};

export function selectMusicClip(
  theme: InstagramTheme,
  recentClipIds: string[] = [],
): MusicClip | null {
  const availableClips = MUSIC_CLIPS.filter(
    (clip) => clip.url && !recentClipIds.includes(clip.id),
  );

  if (availableClips.length === 0) return null;

  const preferredMoods = THEME_MOOD_PREFERENCES[theme] ?? ['peaceful'];

  // Prefer clips matching the theme mood
  const preferred = availableClips.filter((clip) =>
    preferredMoods.includes(clip.mood),
  );
  const pool = preferred.length > 0 ? preferred : availableClips;

  // Random selection from the pool
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

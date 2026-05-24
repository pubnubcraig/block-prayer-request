const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;

type Entry = {
  timestamps: number[];
};

const store = new Map<string, Entry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, 5 * 60_000);

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  return { allowed: true, remaining: MAX_REQUESTS - entry.timestamps.length };
}

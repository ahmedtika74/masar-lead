const USAGE_KEY = "leadfinder.usage";
const CACHE_KEY = "leadfinder.searchCache";
const MONTHLY_FREE_LIMIT = 1000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function readJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getUsage() {
  const stored = readJson(USAGE_KEY, { month: monthKey(), count: 0 });
  const current = monthKey();
  if (stored.month !== current) {
    const reset = { month: current, count: 0 };
    writeJson(USAGE_KEY, reset);
    return { ...reset, limit: MONTHLY_FREE_LIMIT };
  }
  return { ...stored, limit: MONTHLY_FREE_LIMIT };
}

export function incrementUsage() {
  const usage = getUsage();
  const next = { month: usage.month, count: usage.count + 1 };
  writeJson(USAGE_KEY, next);
  return { ...next, limit: MONTHLY_FREE_LIMIT };
}

export function cacheKey({ query, minRating, minReviews, pageToken }) {
  return JSON.stringify({
    query,
    minRating,
    minReviews,
    pageToken: pageToken || "",
  });
}

export function getCachedSearch(key) {
  const cache = readJson(CACHE_KEY, {});
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() - entry.savedAt > CACHE_TTL_MS) {
    delete cache[key];
    writeJson(CACHE_KEY, cache);
    return null;
  }
  return entry.data;
}

export function setCachedSearch(key, data) {
  const cache = readJson(CACHE_KEY, {});
  const now = Date.now();
  const next = {};

  for (const [existingKey, entry] of Object.entries(cache)) {
    if (now - entry.savedAt <= CACHE_TTL_MS) {
      next[existingKey] = entry;
    }
  }

  next[key] = { savedAt: now, data };
  writeJson(CACHE_KEY, next);
}

export { MONTHLY_FREE_LIMIT };

const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "fb.me",
  "instagram.com",
  "linktr.ee",
  "wa.me",
  "whatsapp.com",
  "api.whatsapp.com",
  "tiktok.com",
];

export function classifyWebsite(uri) {
  if (!uri || typeof uri !== "string" || !uri.trim()) {
    return "NO_WEBSITE";
  }

  const raw = uri.trim();
  let hostname = "";

  try {
    hostname = new URL(raw.includes("://") ? raw : `https://${raw}`).hostname.toLowerCase();
  } catch {
    const lower = raw.toLowerCase();
    if (SOCIAL_HOSTS.some((host) => lower.includes(host))) {
      return "SOCIAL_ONLY";
    }
    return "HAS_WEBSITE";
  }

  const isSocial = SOCIAL_HOSTS.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );

  return isSocial ? "SOCIAL_ONLY" : "HAS_WEBSITE";
}

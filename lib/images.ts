// Single source of truth for hosts we load images from. `next.config.ts`
// derives `images.remotePatterns` from this, and `getHeadshotUrl` mirrors that
// exact check at render time so a crawled URL outside the allowlist (or a
// malformed one) falls back gracefully instead of crashing the page render.
export const ALLOWED_IMAGE_HOSTNAMES = [
  'media.formula1.com',
  'www.formula1.com',
];

// The app logo, served by `app/icon.tsx` — same-origin, so always safe to load.
const FALLBACK_HEADSHOT = '/icon';

export function getHeadshotUrl(url: string): string {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol === 'https:' && ALLOWED_IMAGE_HOSTNAMES.includes(hostname)) {
      return url;
    }
  } catch {
    // malformed URL — fall through to the fallback
  }
  return FALLBACK_HEADSHOT;
}

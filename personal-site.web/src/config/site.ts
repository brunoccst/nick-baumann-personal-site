/**
 * Origin the site is served from, without a trailing slash.
 *
 * Canonical and Open Graph URLs have to be absolute, so both this and
 * `plugins/seo.ts` need to know where the site lives. Setting `VITE_SITE_URL`
 * in the Netlify project — or in a `.env` file — is the one change a custom
 * domain needs; the fallback is the Netlify subdomain the site launched on.
 */
export const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL ?? 'https://nick-baumann.netlify.app')
  .trim()
  .replace(/\/$/, '');

// Turns a router path into the absolute URL a crawler should index.
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path}`;
}

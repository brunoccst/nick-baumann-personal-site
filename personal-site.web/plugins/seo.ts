import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

import sections from '../src/config/sections.json' with { type: 'json' };
import de from '../src/i18n/locales/de.json' with { type: 'json' };
import en from '../src/i18n/locales/en.json' with { type: 'json' };

/** Shape of one locale file, as far as this plugin reads it. */
type Locale = typeof en;

const LOCALES: Record<string, Locale> = { en, de: de as Locale };

/**
 * Language the static HTML is written in.
 *
 * The app picks its language in the browser from `localStorage` and
 * `navigator.languages`, which a crawler has neither of, so one language has
 * to be baked into the files on disk. It is the same default the app falls
 * back to. Serving the German copy at its own URLs is the next step — see
 * `docs/NEXT-STEPS.md`.
 */
const STATIC_LANGUAGE = 'en';

/** Falls back to the deployed Netlify URL when nothing overrides it. */
const DEFAULT_ORIGIN = 'https://nick-baumann.netlify.app';

/** Path of the social preview card, relative to the site root. */
const SOCIAL_IMAGE = '/og-image.png';

/** BCP 47 tags, as Open Graph wants them. */
const OG_LOCALE: Record<string, string> = { en: 'en_GB', de: 'de_DE' };

/**
 * The one route that does not render a section: `/` client-redirects to the
 * default section, so its HTML carries the default section's copy and points
 * its canonical at the URL the redirect lands on.
 */
const ROOT_PATH = '/';

const SEO_MARKERS = ['<!-- seo:start -->', '<!-- seo:end -->'] as const;
const NOSCRIPT_MARKERS = ['<!-- noscript:start -->', '<!-- noscript:end -->'] as const;

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escapes a locale string for use in HTML text or in an attribute. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ESCAPES[character] as string);
}

/** Drops the `*emphasis*` markers the locale files use for German terms. */
function plain(value: string): string {
  return value.replace(/\*([^*]+)\*/g, '$1');
}

/** Joins the origin and a root-relative path into one absolute URL. */
function absolute(origin: string, path: string): string {
  return path === ROOT_PATH ? `${origin}/` : `${origin}${path}`;
}

/**
 * Describes Nick as a `Person` for search engines.
 *
 * This is the part that answers "which Nick Baumann is this?" — the role, the
 * employer, the town and the LinkedIn profile are what let Google tie the
 * three together into one entity rather than three unrelated pages. The
 * employer, the schools and the skills are read out of the locale file so the
 * markup cannot drift from the page it describes.
 */
function personSchema(origin: string, locale: Locale): unknown {
  const [currentRole] = locale.sections.experience.items;
  const schools = [
    ...new Set(locale.sections.education.items.map((item) => item.organisation)),
  ];
  const skills = [
    ...new Set(locale.sections.education.items.flatMap((item) => item.stack)),
  ];

  const address = {
    '@type': 'PostalAddress',
    addressLocality: 'Landsberg am Lech',
    addressRegion: 'Bayern',
    addressCountry: 'DE',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${origin}/#nick-baumann`,
    name: locale.identity.name,
    url: absolute(origin, ROOT_PATH),
    image: `${origin}${SOCIAL_IMAGE}`,
    description: locale.sections.about.seo.description,
    jobTitle: [
      locale.identity.role,
      'Staatlich geprüfter Mechatroniktechniker',
      'Monteur',
    ],
    worksFor: currentRole && {
      '@type': 'Organization',
      name: currentRole.organisation,
      address,
    },
    workLocation: { '@type': 'Place', address },
    alumniOf: schools.map((name) => ({ '@type': 'EducationalOrganization', name })),
    knowsAbout: ['Mechatronics', 'Automation', 'Control engineering', ...skills],
    knowsLanguage: ['de', 'en'],
    sameAs: locale.sections.links.items.map((item) => item.href),
  };
}

/** The head block for one route: title, description, canonical and previews. */
function headFor(origin: string, locale: Locale, path: string, sectionId: string): string {
  const section = locale.sections[sectionId as keyof Locale['sections']];
  const { title, description } = section.seo;
  const url = absolute(origin, path);

  // `/` redirects to the default section in the browser, so both URLs hold the
  // same page. Pointing the root's canonical at the section it lands on tells
  // Google to count them once, under the URL a visitor ends up on.
  const canonical = path === ROOT_PATH ? absolute(origin, `/${sectionId}`) : url;

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="profile" />`,
    `<meta property="og:site_name" content="${escapeHtml(locale.seo.siteName)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[STATIC_LANGUAGE]}" />`,
    ...Object.entries(OG_LOCALE)
      .filter(([language]) => language !== STATIC_LANGUAGE)
      .map(([, tag]) => `<meta property="og:locale:alternate" content="${tag}" />`),
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${origin}${SOCIAL_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(locale.seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(personSchema(origin, locale))}</script>`,
  ];

  return tags.map((tag) => `    ${tag}`).join('\n');
}

/** Renders one section's text as plain HTML, for readers without JavaScript. */
function noscriptFor(locale: Locale, sectionId: string): string {
  const section = locale.sections[sectionId as keyof Locale['sections']];
  const body: string[] = [];

  if ('paragraphs' in section) {
    body.push(...section.paragraphs.map((text) => `<p>${escapeHtml(plain(text))}</p>`));
  }

  if ('items' in section && sectionId !== 'links') {
    const items = section.items as Locale['sections']['experience']['items'];
    body.push(
      '<ol>',
      ...items.map(
        (item) =>
          `<li><h3>${escapeHtml(plain(item.role))}</h3>` +
          `<p>${escapeHtml(item.organisation)}, ${escapeHtml(item.location)} — ` +
          `${escapeHtml(item.period)}</p>` +
          `<p>${escapeHtml(plain(item.summary))}</p></li>`,
      ),
      '</ol>',
    );
  }

  if (sectionId === 'links') {
    body.push(
      '<ul>',
      ...locale.sections.links.items.map(
        (item) =>
          `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a> — ` +
          `${escapeHtml(item.description)}</li>`,
      ),
      '</ul>',
    );
  }

  const nav = sections
    .map((entry) => {
      const label = locale.sections[entry.id as keyof Locale['sections']].title;
      return `<li><a href="${entry.path}">${escapeHtml(label)}</a></li>`;
    })
    .join('');

  const lines = [
    '<noscript>',
    `<h1>${escapeHtml(locale.identity.name)}</h1>`,
    `<p>${escapeHtml(locale.identity.role)} — ${escapeHtml(locale.sections.about.kicker)}</p>`,
    `<h2>${escapeHtml(locale.sections[sectionId as keyof Locale['sections']].title)}</h2>`,
    ...body,
    `<nav><ul>${nav}</ul></nav>`,
    '</noscript>',
  ];

  return lines.map((line) => `    ${line}`).join('\n');
}

/** Replaces the content between a pair of marker comments, keeping the markers. */
function replaceBetween(html: string, markers: readonly [string, string], content: string): string {
  const [open, close] = markers;
  const start = html.indexOf(open);
  const end = html.indexOf(close);

  if (start === -1 || end === -1) {
    throw new Error(`index.html is missing the ${open} … ${close} markers`);
  }

  return `${html.slice(0, start + open.length)}\n${content}\n    ${html.slice(end)}`;
}

/**
 * Lists every URL worth crawling.
 *
 * `/` is left out: it redirects to the default section and its canonical says
 * so, and a sitemap is a list of canonical URLs. `<lastmod>` is left out too,
 * because nothing here knows when a section's text last changed — the build
 * date would only be the deploy date, which Google ignores once it notices it
 * moving on every deploy.
 */
function sitemap(origin: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sections.map((section) =>
      ['  <url>', `    <loc>${absolute(origin, section.path)}</loc>`, '  </url>'].join('\n'),
    ),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Gives every route its own static HTML file, and writes a sitemap.
 *
 * The app is client-rendered, so without this every URL would serve the same
 * empty shell: one title, one description, and nothing in the preview card
 * that Google, LinkedIn or WhatsApp read before any JavaScript runs. This
 * rewrites the marked blocks of the built `index.html` once per section and
 * writes the result to `dist/<section>/index.html`, which Netlify serves in
 * preference to the SPA fallback because the file exists.
 */
export function seo(): Plugin {
  let outDir = 'dist';
  let origin = DEFAULT_ORIGIN;

  return {
    name: 'nick-baumann-seo',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir;
      origin = (config.env['VITE_SITE_URL'] as string | undefined)?.replace(/\/$/, '') || DEFAULT_ORIGIN;
    },

    async closeBundle() {
      const locale = LOCALES[STATIC_LANGUAGE] as Locale;
      const shell = await readFile(join(outDir, 'index.html'), 'utf8');

      const routes = [
        { path: ROOT_PATH, sectionId: sections[0]?.id as string, file: 'index.html' },
        ...sections.map((section) => ({
          path: section.path,
          sectionId: section.id,
          file: join(section.path.slice(1), 'index.html'),
        })),
      ];

      for (const route of routes) {
        let html = replaceBetween(shell, SEO_MARKERS, headFor(origin, locale, route.path, route.sectionId));
        html = replaceBetween(html, NOSCRIPT_MARKERS, noscriptFor(locale, route.sectionId));

        const target = join(outDir, route.file);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, html, 'utf8');
      }

      await writeFile(join(outDir, 'sitemap.xml'), sitemap(origin), 'utf8');

      // A `Sitemap:` line has to carry an absolute URL, so it cannot live in
      // the static `public/robots.txt` alongside the crawl rules.
      const robotsPath = join(outDir, 'robots.txt');
      const robots = await readFile(robotsPath, 'utf8');
      await writeFile(robotsPath, `${robots.trimEnd()}\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
      this.info(`wrote ${routes.length} pre-rendered pages and a sitemap for ${origin}`);
    },
  };
}

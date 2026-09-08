# Nick Baumann — personal site

[![Netlify Status](https://api.netlify.com/api/v1/badges/ef3706c3-dd77-431a-8f8a-23021d199349/deploy-status)](https://app.netlify.com/sites/nick-baumann/deploys)

Live at [nick-baumann.netlify.app](https://nick-baumann.netlify.app).

The personal site of Nick Baumann, a mechatronics technician in Bavaria. Four
sections — about, experience, education and links — in English and German,
with a light and a dark theme.

It is styled as a technical drawing: an exploded mechatronic assembly, drawn
as inline SVG, sits fixed behind the page. The light theme is blueprint blue,
the dark theme is black, and both carry the same line art.

**Do not publish personal data here.** Home address, phone number, personal
email address, date and place of birth, nationality and school grades are all
absent by design. A public page is a wider audience than a job application,
and contact details on one invite scraping.

## Requirements

- Node.js 22 or later
- npm 11 or later (see the known issue below — npm 10.9.3 crashes on this
  dependency set)

npm 10.9.3 (the version bundled with recent Node 22 installers) fails to
install this project's dependencies: `@npmcli/arborist` hits a bug
(`Cannot read properties of null (reading 'edgesOut')`) resolving the peer
dependency graph. If `npm install` crashes with that error, install with a
newer npm instead:

```bash
npx --yes npm@11 install
```

See `docs/KNOWN-ISSUES.md` for more detail.

## Getting started

```bash
cd personal-site.web
npm install
npm run dev
```

The dev server listens on Vite's default port, 5173. If you're also running
`brunoccst/personal-site` (the reference project this site's architecture
comes from) on its default port, the two dev servers share the origin
`http://localhost:5173` and therefore the same `localStorage`. Run this one on
a different port to avoid the two sites overwriting each other's saved theme
and language:

```bash
npm run dev -- --port 5274
```

## Scripts

Run from `personal-site.web`:

| Script | Does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Type-checks with `tsc -b` and builds a production bundle to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run typecheck` | Type-checks without emitting (`tsc -b --noEmit`) |
| `npm test` | Runs the test suite once (`vitest run`) |

The test suite has 19 tests: 7 in `src/config/sections.test.ts` (section
ordering, path uniqueness, route fallback), 5 in `src/i18n/locales.test.ts`
(English and German have identical key shapes, and carry the metadata and
hrefs the app expects), and 7 in `src/i18n/emphasis.test.ts` (splitting
`*marked*` German terms out of a locale string).

## Repository layout

```
nick-baumann-personal-site/
├── .gitignore
├── LICENSE                     MIT, copyright Nick Baumann
├── README.md
├── netlify.toml                Netlify build and header settings
├── docs/
│   ├── DECISIONS.md            Why the project is built this way
│   ├── KNOWN-ISSUES.md         What is wrong or incomplete
│   ├── NEXT-STEPS.md           Planned work
│   └── superpowers/            Design spec and implementation plan — the
│                               spec is worth reading before restyling;
│                               the plan is a build record
└── personal-site.web/          The React application
```

## Application layout

```
personal-site.web/
├── index.html
├── public/{favicon.svg,robots.txt}
├── vite.config.ts
├── tsconfig.json, tsconfig.app.json, tsconfig.node.json
├── package.json
└── src/
    ├── main.tsx                React root, wrapped in the providers
    ├── App.tsx                 Route table
    ├── components/
    │   ├── Layout/             Header, main, footer
    │   ├── Blueprint/          The technical-drawing backdrop
    │   ├── Brand/              The <h1>
    │   ├── Nav/                Section links
    │   └── SystemControls/     Theme and language buttons
    ├── sections/
    │   ├── AboutSection.tsx
    │   ├── TimelineSection.tsx  Shared renderer for dated entry lists
    │   ├── ExperienceSection.tsx
    │   ├── EducationSection.tsx
    │   ├── LinksSection.tsx
    │   └── Section.module.scss
    ├── config/sections.ts      The ordered section list
    ├── hooks/useDocumentTitle.ts
    ├── i18n/
    │   ├── index.ts
    │   ├── useTranslatedList.ts
    │   ├── emphasis.ts         Splits *marked* German terms out of a string
    │   ├── EmphasisedText.tsx  Renders those terms as <em lang="de">
    │   └── locales/{en,de}.json
    ├── styles/
    │   ├── _tokens.scss        CSS custom properties
    │   ├── _variables.scss     Sass build-time values
    │   ├── _mixins.scss        Reusable blocks
    │   └── global.scss         Reset, body defaults, focus ring, skip link
    └── theme/
        ├── AppThemeProvider.tsx
        ├── createAppTheme.ts
        └── themeContext.ts
```

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | React 19.2.8 |
| Language | TypeScript 7.0.2 |
| Build tool | Vite 8.2.2 |
| Routing | React Router 7.18.3 |
| Translations | i18next 26.4.2 + react-i18next 17.0.13 |
| Component library | MUI 9.4.0 (+ @emotion/react, @emotion/styled) |
| Styling | Sass 1.104, compiled to CSS Modules |
| Tests | Vitest 4 |

## Routing

Every route is generated from a single array, `src/config/sections.ts`:

```ts
export const SECTIONS: readonly SectionDefinition[] = [
  { id: 'about',      path: '/about',      labelKey: 'nav.about' },
  { id: 'experience', path: '/experience', labelKey: 'nav.experience' },
  { id: 'education',  path: '/education',  labelKey: 'nav.education' },
  { id: 'links',      path: '/links',      labelKey: 'nav.links' },
] as const;
```

`App.tsx` builds its route table from that array, and `Nav` builds its links
from the same array, so navigation and routing cannot disagree with each
other.

| URL | Result |
| --- | --- |
| `/` | Redirect to `/about` |
| `/about`, `/experience`, `/education`, `/links` | The matching section |
| anything else | Redirect to `/about` |

## Styling

Styles are written as SCSS and compiled by Vite into CSS Modules — one
`*.module.scss` file beside each component, plus shared files under
`src/styles/` imported with `@use`.

`src/styles/_tokens.scss` defines CSS custom properties: colour, spacing,
type and one motion timing. The light values live on `:root`;
`[data-theme='dark']` overrides only the values that differ. Component
stylesheets carry layout — flow, spacing, alignment — with no shadows, border
radii, fluid type, or motion beyond the single `--transition` token.

### The backdrop

`components/Blueprint` draws the exploded assembly as inline SVG and fixes it
behind the page, so content scrolls over a drawing that stays put. Nothing is
filled; every stroke reads `--color-blueprint-line`, so one drawing serves
both themes. It is `aria-hidden`, and it fades out below 1024px and again
below 480px, where the text column would otherwise sit over the busiest part.

Gear teeth, rotor windings and encoder slots are dashed strokes on circles
rather than individually placed segments — one attribute instead of dozens of
lines, with spacing that stays even at any scale.

### Contrast

Measured against the lightest stop of each background gradient, which is the
worst case for text over it. Every pair clears WCAG AA.

| | Light (blue) on `#145b8a` | Dark on `#0a1016` |
| --- | --- | --- |
| Body text | `#f2f8fc` — 6.78:1 | `#ededed` — 16.33:1 |
| Muted text | `#cfe3f2` — 5.50:1 | `#a3a3a3` — 7.58:1 |
| Accent | `#a5dbfa` — 4.88:1 | `#7aa2d6` — 7.25:1 |

Changing a background means recomputing these. The accent doubles as link
hover text, so it needs 4.5:1, not the 3:1 a non-text control would.

## Theme

`AppThemeProvider` writes `data-theme="light"` or `data-theme="dark"` onto
`<html>`, mirrors the mode into a MUI theme for the two icon buttons in
`SystemControls`, and persists the choice to `localStorage` under the key
`nick-baumann-site.theme`. With no saved value, it follows the operating
system's `prefers-color-scheme`.

## Translations

The starting language is read from `localStorage` under
`nick-baumann-site.language`, then from the browser's languages, then
defaults to English. `en.json` is the fallback locale; a key missing from
`de.json` falls back to the English value.

**No component holds user-facing text.** Components call `t('some.key')`, or
`useTranslatedList<T>('some.key')` for arrays and arrays of objects. All
strings live in `src/i18n/locales/en.json` and `src/i18n/locales/de.json`.

To add a translation key:

1. Add the key to `en.json`.
2. Add the same key, translated, to `de.json`.
3. Call `t('the.new.key')` (or `useTranslatedList` for a list) from the
   component.

### German terms in the English locale

German job titles and qualifications have no clean English equivalent, so the
English locale keeps the German and glosses it. A term wrapped in asterisks is
rendered in italics inside `<em lang="de">`, which also tells a screen reader
to pronounce it in German; the translation follows as ordinary text:

```json
"role": "*Ausbildung zum Mechatroniker* (apprenticeship as a mechatronics technician)"
```

`i18n/emphasis.ts` does the splitting and `i18n/EmphasisedText.tsx` renders it.
An unpaired asterisk stays literal, so arithmetic in a sentence survives.

Institution, company and place names are **not** marked or translated —
"Technikerschule Augsburg" and "Landsberg am Lech" are proper nouns. The German
locale carries no markers at all.

### What is not published

Home address, phone number, personal email address, date and place of birth,
nationality, and school grades. Do not add them without asking Nick first. If
a contact route is wanted, prefer a form over an address on the page.

## Adding a section

1. Add an entry to `SECTIONS` in `src/config/sections.ts`, with a new `id`,
   `path`, and `labelKey`.
2. Add a matching `nav.<id>` key and a `sections.<id>` block to both locale
   files.
3. Write the section component under `src/sections/` and register it in
   `SECTION_COMPONENTS` in `src/App.tsx`.

`Nav` and the route table both read `SECTIONS`, so nothing else needs to
change for the new section to appear in navigation and be reachable by URL.

## Accessibility

- A skip link is first in the tab order and targets `#content`.
- `NavLink` sets `aria-current="page"` on the active section.
- `<main>` is a labelled region.
- A visually hidden `aria-live` region announces the section after a
  navigation, and the document title updates to match.
- `prefers-reduced-motion` is respected: the `motion-reduce` mixin in
  `global.scss` turns off every animation and transition.
- Focus is drawn with a two-pixel outline in the accent colour.
- The neutral palette meets WCAG AA contrast for body text in both themes;
  the measured ratios are recorded in `docs/DECISIONS.md`.

## Deployment

Netlify builds from `netlify.toml` at the repository root, so the build is
reproducible from the repository alone:

- Base directory `personal-site.web`, build command `npm run build`,
  publish directory `dist`, Node 22.
- A catch-all redirect to `/index.html` with status 200, so a hard refresh
  on a route like `/experience` works instead of 404ing.
- `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` headers,
  and a one-year immutable cache on `/assets/*`.

The Netlify project is named `nick-baumann` and serves the site at
[nick-baumann.netlify.app](https://nick-baumann.netlify.app). It builds from
`main`; pushing to `main` triggers a deploy, and every pull request gets its
own preview build.

## Licence

MIT. See `LICENSE`.

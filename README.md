# Nick Baumann — personal site

A personal site built as a gift for Nick Baumann. The structure, routing,
theming, translations and accessibility are finished. The visual style is
deliberately unfinished: it had not been chosen when the site was built, so
the CSS you'll find here is a plain, neutral baseline, not a design. Whoever
picks the style later starts from a clean slate rather than fighting existing
decisions.

The body copy throughout the site — the About paragraphs, the Experience
entries, the link descriptions — is Lorem Ipsum. It is there to hold the
layout at a realistic size until the recipient replaces it with their own
words. See "Translations" below for exactly what is safe to edit.

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

The test suite has 12 tests: 7 in `src/config/sections.test.ts` (section
ordering, path uniqueness, and route fallback) and 5 in
`src/i18n/locales.test.ts` (English and German have identical key shapes, and
carry the metadata and hrefs the app expects).

## Repository layout

```
nick-baumann-personal-site/
├── .gitignore
├── LICENSE                     MIT, copyright Nick Baumann — the site is a gift,
│                               so the recipient is the copyright holder
├── README.md
├── netlify.toml                Netlify build and header settings
├── docs/
│   ├── DECISIONS.md            Why the project is built this way
│   ├── KNOWN-ISSUES.md         What is wrong or incomplete
│   ├── NEXT-STEPS.md           Planned work
│   └── superpowers/            The design spec and implementation plan the
│                               site was built from — the spec is worth
│                               reading before restyling; the plan is a
│                               build record
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
    │   ├── Brand/              The <h1>
    │   ├── Nav/                Section links
    │   └── SystemControls/     Theme and language buttons
    ├── sections/
    │   ├── AboutSection.tsx
    │   ├── ExperienceSection.tsx
    │   ├── LinksSection.tsx
    │   └── Section.module.scss
    ├── config/sections.ts      The ordered section list
    ├── hooks/useDocumentTitle.ts
    ├── i18n/
    │   ├── index.ts
    │   ├── useTranslatedList.ts
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
  { id: 'links',      path: '/links',      labelKey: 'nav.links' },
] as const;
```

`App.tsx` builds its route table from that array, and `Nav` builds its links
from the same array, so navigation and routing cannot disagree with each
other.

| URL | Result |
| --- | --- |
| `/` | Redirect to `/about` |
| `/about`, `/experience`, `/links` | The matching section |
| anything else | Redirect to `/about` |

## Styling

Styles are written as SCSS and compiled by Vite into CSS Modules — one
`*.module.scss` file beside each component, plus shared files under
`src/styles/` imported with `@use`.

`src/styles/_tokens.scss` defines CSS custom properties: colour, spacing,
type and one motion timing. The light values live on `:root`; `[data-theme='dark']`
overrides only the colours that differ. Component stylesheets carry layout
only — flow, spacing, alignment — with no shadows, gradients, border radii,
fluid type, or motion beyond the single `--transition` token.

**This baseline is a placeholder, not a design.** The site should currently
read as a clean, unstyled document. The contract for whoever restyles it:
class names and DOM structure are stable, and every value in `_tokens.scss`
and every rule in a `*.module.scss` file is theirs to replace.

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

### What to edit if you're replacing the placeholder copy

Body copy is Lorem Ipsum and is meant to be replaced: the About paragraphs,
the Experience summaries and stack tags, the link descriptions, the section
kickers, `identity.role`, and `footer.note`.

Interface text is already real, because Lorem Ipsum would break it rather
than stand in for it — a navigation item labelled "Lorem" cannot be
navigated. This includes the navigation labels, the control labels and
accessibility strings, the section titles, the link labels (`GitHub`,
`LinkedIn`, and so on), `identity.name`, the link `href` values, and each
locale's `meta.htmlLang` / `meta.nativeName`. None of that needs to change
to remove the placeholder feel — only the Lorem Ipsum body copy does.

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

The site is not deployed yet. Once the Netlify project is created, its name
and live URL will be recorded here.

## Licence

MIT. See `LICENSE`.

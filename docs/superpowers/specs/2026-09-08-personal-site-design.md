# Personal site — design

Date: 2026-09-08.

A personal site for a friend, given as a gift. It reuses the architecture of
[brunoccst/personal-site](https://github.com/brunoccst/personal-site) and replaces its
visual layer with nothing, so the eventual style can be chosen later without
fighting anything already there.

---

## Goal

Ship a deployable single-page site whose structure, routing, theming, i18n and
accessibility are finished, and whose appearance is deliberately unfinished.

Two audiences read this repository:

- The person who picks the visual style later. They need the styling layer to be
  small, obvious and safe to rewrite.
- The friend who receives the site. They need to replace Lorem Ipsum with their
  own words without touching a component.

## Non-goals

- Choosing colours, typography, layout ornament or motion. That is a later,
  separate piece of work.
- Server rendering, a backend, a CMS, or analytics.
- Porting the frame, intro animation or scroll navigation from `brunoccst/personal-site`.

---

## Decisions taken before writing this

| Question | Decision |
| --- | --- |
| Repository owner | `brunoccst/nick-baumann-personal-site`. The GitHub account `nick-baumann` does not exist, so the repo is created under the author's account and transferred once it does. |
| Style scope | Both design tokens and visual structure are left undecided. Build a neutral shell. |
| Styling mechanism | SCSS + CSS Modules, as in `brunoccst/personal-site`. Neutrality comes from writing less CSS, not from a different mechanism. |
| Material UI | Kept, for parity with `brunoccst/personal-site`. |
| Languages | English and German. |
| Hosting | Netlify, configured by `netlify.toml`, project created under the `brunoccst` Netlify team. |
| CI | None, mirroring `brunoccst/personal-site`. Netlify's deploy previews build every pull request. |
| Tests | Vitest, with a small suite over section lookup and locale-file shape. |

---

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
│   └── superpowers/specs/      Design documents, including this one
└── personal-site.web/          The React application
```

The application folder is named `personal-site.web`, following the `<project>.web`
convention that `brunoccst/personal-site` uses. It matches the end state: after
the transfer this repository is `nick-baumann/personal-site`, so the folder name
lines up with the repository name. `netlify.toml` sets it as the build base, so
the name is load-bearing — changing it means changing that file.

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

`Nav` replaces `brunoccst/personal-site`'s `SideNav`; the name no longer promises a side.
`ContentPanel` and `Intro` have no counterpart.

---

## Components

Each component owns one job and one stylesheet.

**`Layout`** renders `<header>`, `<main id="content">` and `<footer>`, in normal
document flow. The window scrolls. The header holds `Brand`, `Nav` and
`SystemControls`; `<main>` renders the routed section.

**`Brand`** renders the `<h1>` from `identity.name`.

**`Nav`** maps `SECTIONS` to React Router `NavLink`s. It reads the section list
and nothing else, so it cannot disagree with the router.

**`SystemControls`** renders two MUI `IconButton`s inside `Tooltip`s: one toggles
theme, one toggles language. Both carry an `aria-label` from the locale files.

**Sections** keep the data shapes from `brunoccst/personal-site` exactly:

| Section | Shape |
| --- | --- |
| About | `kicker: string`, `title: string`, `paragraphs: string[]` |
| Experience | `items: { period, role, organisation, location, summary, stack: string[] }[]` |
| Links | `items: { label, description, href }[]` |

`LinksSection` keeps the `isExternal` branch: a `mailto:` href opens the mail
client, everything else opens in a new tab with `rel="noopener noreferrer"` and a
visually hidden "(opens in a new tab)".

## Data flow

`config/sections.ts` is the single source of truth:

```ts
export const SECTIONS: readonly SectionDefinition[] = [
  { id: 'about',      path: '/about',      labelKey: 'nav.about' },
  { id: 'experience', path: '/experience', labelKey: 'nav.experience' },
  { id: 'links',      path: '/links',      labelKey: 'nav.links' },
] as const;
```

`App.tsx` builds its route table from that array, and `Nav` builds its links from
it. Adding a section is one array entry, one locale block, one component and one
entry in `SECTION_COMPONENTS`.

| URL | Result |
| --- | --- |
| `/` | Redirect to `/about` |
| `/about`, `/experience`, `/links` | The matching section |
| anything else | Redirect to `/about` |

No component holds user-facing text. Components call `t('key')`, and
`useTranslatedList<T>(key)` returns arrays and object arrays from the locale
files.

---

## Styling

Written as SCSS, compiled by Vite into CSS Modules, one `*.module.scss` beside
each component. Shared files are imported with `@use`.

`_tokens.scss` defines the light values on `:root` and overrides only the colour
tokens under `[data-theme='dark']`. The starting set is deliberately small:

```
--color-bg, --color-surface, --color-text, --color-text-muted,
--color-accent, --color-accent-contrast, --color-border, --color-focus
--space-1 … --space-6
--font-sans, --text-sm, --text-base, --text-lg, --text-xl
--leading-normal, --transition
```

`--color-accent-contrast` and `--color-focus` are not ornament: the skip link,
the text selection colour and the focus ring need them, and the MUI theme reads
them for the two icon buttons. Every token in the list is referenced by something.

No shadows, no gradients, no border radii, no `clamp()` typography, and no motion
timings beyond a single `--transition`. Component modules carry layout only — flow, spacing,
alignment. The site should read as a clean unstyled document.

This is the contract with whoever restyles the site: **the class names and the
DOM structure are stable; every value in `_tokens.scss` and every rule in a
`*.module.scss` is theirs to replace.**

### Theme switching

`AppThemeProvider` writes `data-theme="light"` or `data-theme="dark"` onto
`<html>`, mirrors the mode into a MUI theme for the two icon buttons, and
persists the choice to `localStorage` under `nick-baumann-site.theme`. With no
saved value it follows `prefers-color-scheme`.

The keys are `nick-baumann-site.theme` and `nick-baumann-site.language`, not
`personal-site.*`. `brunoccst/personal-site` already uses the `personal-site.*`
keys, and both projects' dev servers default to `http://localhost:5173` — the
same origin, and therefore the same `localStorage`. Identical keys would make the
two sites overwrite each other's saved theme and language during development.

---

## Text and translations

`en.json` is the default and the fallback. `de.json` mirrors its shape; a missing
key falls back to English. The starting language is chosen from
`localStorage['nick-baumann-site.language']`, then the browser's languages, then
English.

Body copy is Lorem Ipsum, in realistic quantities: four About paragraphs, three
Experience entries with eight stack tags each, four Links. That covers the About
paragraphs, the Experience summaries and stack tags, the link descriptions, the
kickers, the role, and the footer note — the words the recipient will replace.

Interface text stays real, because Lorem Ipsum would break it rather than stand
in for it. A navigation labelled "Lorem" cannot be navigated, and a screen reader
announcing "Ipsum section" tells its listener nothing:

- Navigation labels, control labels, and the accessibility strings.
- Section titles, and the link labels (`GitHub`, `LinkedIn`, and so on).
- `identity.name` — "Nick Baumann".
- `href` values in the Links section — real placeholder URLs and a `mailto:`.
- `meta.htmlLang` and `meta.nativeName` — the locale's own identifiers.

These are also the strings that differ between `en.json` and `de.json`. The Lorem
Ipsum body copy is identical in both files, because Lorem Ipsum has no language —
with one exception: `sections.experience.items[0].period` is `"Lorem 2022 — Present"`
in English and `"Lorem 2022 — heute"` in German, because its trailing word is the
real, open-ended "present", not filler, and leaving "Present" in the German view
would be worse than translating it.

---

## Accessibility

Carried over from `brunoccst/personal-site` in full:

- A skip link is first in the tab order and targets `#content`.
- `NavLink` sets `aria-current="page"` on the active section.
- `<main>` is a labelled region.
- A visually hidden `aria-live` region announces the section after a change, and
  the document title is updated to match.
- `prefers-reduced-motion` is respected through the `motion-reduce` block in
  `global.scss`, which switches off every animation and transition. The reference
  project's `usePrefersReducedMotion` hook is not carried over: nothing in the
  neutral baseline animates from JavaScript, so it would have no caller.
- Focus is drawn with a two-pixel outline in the accent colour.
- The neutral palette meets WCAG AA contrast in both themes. Ratios are recorded
  in `docs/DECISIONS.md`.

## Error handling

The site has no network calls and no user input, so the failure modes are few and
all are handled by falling back rather than throwing:

| Failure | Behaviour |
| --- | --- |
| Unknown URL | Redirect to `/about` |
| Missing translation key | i18next falls back to English |
| Missing or malformed list key | `useTranslatedList` returns `[]`; the section renders its heading with an empty list |
| `localStorage` unavailable or throwing | Reads and writes are wrapped; the app falls back to system theme and browser language |

## Testing

Vitest, run with `npm test`. The suite is small on purpose and covers the logic
that can actually be wrong:

- `findSectionByPath` returns the matching section, and the default section for
  an unknown path.
- `SECTIONS` paths are unique, every path starts with a slash, and every
  `labelKey` resolves in both locale files.
- `en.json` and `de.json` have identical key shapes — the most likely real bug in
  a two-locale app.

Beyond the suite, a change is verified with `npm run typecheck`, `npm run build`,
and driving the dev server: all three routes, both themes, both languages, a hard
refresh on a non-root route, and a clean console.

---

## Deployment

Netlify builds `main`. `netlify.toml` at the repository root holds the settings,
so the build is reproducible from the repository alone and does not depend on
dashboard state:

- `base = "personal-site.web"`
- `command = "npm run build"`
- `publish = "dist"`
- `NODE_VERSION = "22"`
- A catch-all redirect returning `/index.html` with status 200, which is what
  makes a hard refresh on `/experience` work instead of returning a 404.
- `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` headers, and
  a one-year immutable cache on `/assets/*`.

The Netlify project is created under the `brunoccst` team, named
`nick-baumann-personal-site`. Netlify project names are globally unique, so if
that name is taken the fallback is `nick-baumann-site`; whichever name is used is
recorded in the README alongside the resulting URL.

Linking the project to the GitHub repository requires a GitHub authorization that
only the account owner can grant, so that step is done in the Netlify dashboard by
hand. The README deploy badge is written only once a real site ID exists and a
deploy has succeeded.

## Handover

The repository is created under `brunoccst` and transferred to the friend's
GitHub account once it exists. Transfer preserves history, issues and stars. The
Netlify project is transferred separately, or the friend links their own.

`docs/NEXT-STEPS.md` records what is left: choose the visual style, replace the
Lorem Ipsum, transfer the repository, transfer or re-create the Netlify project.

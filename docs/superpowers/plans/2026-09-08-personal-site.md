# Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a deployable personal site for a friend that reuses the architecture of `brunoccst/personal-site` but ships a deliberately empty visual layer, so the style can be chosen later.

**Architecture:** A Vite + React 19 single-page app. `src/config/sections.ts` is the single source of truth for the router table and the navigation. No user-facing string lives in a component — everything comes from `src/i18n/locales/{en,de}.json`. Styling is SCSS compiled to CSS Modules, one stylesheet per component, over a small set of CSS custom properties in `src/styles/_tokens.scss`. Netlify builds `main` using `netlify.toml`.

**Tech Stack:** React 19, TypeScript 7, Vite 8, React Router 7, i18next + react-i18next, Material UI 9 (icon buttons and tooltips only), Sass, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-08-personal-site-design.md`

## Global Constraints

- Repository root is `D:\Users\bruno\Repositories\nick-baumann-personal-site`. Git is already initialised on branch `main` with two commits (the spec). **Do not run `git init`.**
- All application code lives in `personal-site.web/`. All npm commands run from that folder.
- npm package name is `personal-site-web`, version `1.0.0`, `"private": true`, `"type": "module"`.
- Node 22 or newer, npm 10 or newer. `NODE_VERSION = "22"` in `netlify.toml`.
- `localStorage` keys are **`nick-baumann-site.theme`** and **`nick-baumann-site.language`**. Never `personal-site.*` — the reference project already owns those keys on `http://localhost:5173`.
- Locales are **`en`** and **`de`**. `en` is the default and the fallback.
- All user-facing copy is Lorem Ipsum. The only real values are `identity.name` = `"Nick Baumann"`, the `href` values in the links section, and each locale's `meta.htmlLang` / `meta.nativeName`.
- `LICENSE` is MIT, `Copyright (c) 2026 Nick Baumann`.
- Do **not** create `.github/workflows`. There is no CI by design.
- Do **not** port `Intro`, `ContentPanel`, `SideNav`, or `useSectionNavigation`. The page scrolls normally.
- The neutral baseline has no shadows, no gradients, no border radii, no `clamp()` typography, and one motion token.
- Every task ends with a commit. Commit messages are written in plain prose, describing the change and why, and end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Work happens on branch `feature/initial-scaffold`, created in Task 1.

---

### Task 1: Repository root and application scaffold

Gets `npm run build` passing on an empty app, so every later task has a working build to lean on.

**Files:**
- Create: `.gitignore`
- Create: `LICENSE`
- Create: `netlify.toml`
- Create: `personal-site.web/package.json`
- Create: `personal-site.web/tsconfig.json`
- Create: `personal-site.web/tsconfig.app.json`
- Create: `personal-site.web/tsconfig.node.json`
- Create: `personal-site.web/vite.config.ts`
- Create: `personal-site.web/index.html`
- Create: `personal-site.web/public/robots.txt`
- Create: `personal-site.web/public/favicon.svg`
- Create: `personal-site.web/src/vite-env.d.ts`
- Create: `personal-site.web/src/main.tsx` (temporary placeholder, replaced in Task 7)

**Interfaces:**
- Consumes: nothing.
- Produces: a buildable app. Later tasks rely on the npm scripts `dev`, `build`, `preview`, `typecheck`, `test`.

- [ ] **Step 1: Create the branch**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git checkout -b feature/initial-scaffold
```

- [ ] **Step 2: Write `.gitignore`**

```gitignore
# Dependencies
node_modules/

# Build output
dist/
.vite/

# Netlify
.netlify/

# Logs
*.log
npm-debug.log*

# Editor and OS files
.vscode/
.idea/
.DS_Store
Thumbs.db

# Environment files
.env
.env.*
!.env.example

# Claude Code local settings
.claude/

# TypeScript incremental build info
*.tsbuildinfo
```

- [ ] **Step 3: Write `LICENSE`**

```
MIT License

Copyright (c) 2026 Nick Baumann

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Write `netlify.toml`**

```toml
# Build settings for the Netlify project hosting this site.

[build]
  base = "personal-site.web"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

# React Router handles the routes, so every request serves index.html.
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

- [ ] **Step 5: Write `personal-site.web/package.json`**

```json
{
  "name": "personal-site-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/icons-material": "^9.4.0",
    "@mui/material": "^9.4.0",
    "i18next": "^26.4.2",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-i18next": "^17.0.13",
    "react-router-dom": "^7.18.3"
  },
  "devDependencies": {
    "@types/node": "^26.5.0",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "sass": "^1.104.0",
    "typescript": "^7.0.2",
    "vite": "^8.2.2",
    "vitest": "^4.0.0"
  }
}
```

- [ ] **Step 6: Write the three tsconfig files**

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

`tsconfig.node.json` — note `include` covers both config files, because the Vitest config lives in `vite.config.ts`:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Write `personal-site.web/vite.config.ts`**

The `test` block configures Vitest. `environment: 'node'` is correct because every test in this plan is pure logic over TypeScript and JSON — no test renders a component, so no DOM is needed.

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Third-party code that gets its own chunk, so app updates do not invalidate it.
const VENDOR_CHUNKS: Record<string, string[]> = {
  react: ['node_modules/react/', 'node_modules/react-dom/', 'node_modules/react-router'],
  mui: ['node_modules/@mui/', 'node_modules/@emotion/'],
  i18n: ['node_modules/i18next/', 'node_modules/react-i18next/'],
};

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Vite reports module ids with forward slashes on every platform.
        manualChunks(id) {
          if (!id.includes('node_modules/')) return undefined;

          for (const [chunk, patterns] of Object.entries(VENDOR_CHUNKS)) {
            if (patterns.some((pattern) => id.includes(pattern))) return chunk;
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 8: Write `personal-site.web/index.html`**

`data-theme="dark"` and the matching `color-scheme` / `theme-color` are the pre-hydration default; `AppThemeProvider` overwrites `data-theme` on mount.

```html
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="dark" />
    <meta name="theme-color" content="#121212" />
    <meta name="description" content="Personal site of Nick Baumann." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Nick Baumann</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Write the two public files**

`public/robots.txt`:

```
User-agent: *
Allow: /
```

`public/favicon.svg` — a deliberately plain monogram, `currentColor`-free so it works on any tab background:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="0" fill="#121212" />
  <text
    x="16"
    y="22"
    font-family="ui-sans-serif, system-ui, sans-serif"
    font-size="16"
    font-weight="600"
    fill="#ededed"
    text-anchor="middle"
  >NB</text>
</svg>
```

- [ ] **Step 10: Write `src/vite-env.d.ts` and a placeholder `src/main.tsx`**

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

`src/main.tsx` — replaced entirely in Task 7; it exists now only so the build has an entry point:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(<StrictMode>Scaffold</StrictMode>);
```

- [ ] **Step 11: Install and verify the build**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm install && npm run build
```

Expected: `npm install` completes, `npm run build` prints `built in ...` and creates `personal-site.web/dist/index.html`. If `tsc -b` errors, fix the tsconfig before continuing — every later task depends on this passing.

- [ ] **Step 12: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Scaffold the repository and the application build

Sets up the Vite, TypeScript and Netlify configuration so there is a
working build to develop against. The application itself is still a
placeholder.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Section configuration

The single source of truth for the router table and the navigation. Written test-first, because this is the one piece of pure logic in the app.

**Files:**
- Create: `personal-site.web/src/config/sections.ts`
- Test: `personal-site.web/src/config/sections.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type SectionId = 'about' | 'experience' | 'links'`
  - `interface SectionDefinition { id: SectionId; path: string; labelKey: string }`
  - `const SECTIONS: readonly SectionDefinition[]`
  - `const DEFAULT_SECTION: SectionDefinition`
  - `function findSectionByPath(pathname: string): SectionDefinition`

- [ ] **Step 1: Write the failing test**

Create `personal-site.web/src/config/sections.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { DEFAULT_SECTION, SECTIONS, findSectionByPath } from './sections';

describe('SECTIONS', () => {
  it('lists about, experience and links in that order', () => {
    expect(SECTIONS.map((section) => section.id)).toEqual([
      'about',
      'experience',
      'links',
    ]);
  });

  it('gives every section a unique path', () => {
    const paths = SECTIONS.map((section) => section.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('starts every path with a slash', () => {
    for (const section of SECTIONS) {
      expect(section.path.startsWith('/')).toBe(true);
    }
  });

  it('defaults to the first section', () => {
    expect(DEFAULT_SECTION).toBe(SECTIONS[0]);
  });
});

describe('findSectionByPath', () => {
  it('returns the section matching the pathname', () => {
    expect(findSectionByPath('/experience').id).toBe('experience');
  });

  it('falls back to the default section for an unknown pathname', () => {
    expect(findSectionByPath('/nowhere')).toBe(DEFAULT_SECTION);
  });

  it('falls back to the default section for the root pathname', () => {
    expect(findSectionByPath('/')).toBe(DEFAULT_SECTION);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm test
```

Expected: FAIL — `Failed to resolve import "./sections"`.

- [ ] **Step 3: Write the implementation**

Create `personal-site.web/src/config/sections.ts`:

```ts
export type SectionId = 'about' | 'experience' | 'links';

export interface SectionDefinition {
  id: SectionId;
  /** Route path used by React Router. */
  path: string;
  /** Key of the label inside the `nav` namespace of the locale files. */
  labelKey: string;
}

// Order of this array drives both the navigation and the route table.
export const SECTIONS: readonly SectionDefinition[] = [
  { id: 'about', path: '/about', labelKey: 'nav.about' },
  { id: 'experience', path: '/experience', labelKey: 'nav.experience' },
  { id: 'links', path: '/links', labelKey: 'nav.links' },
] as const;

export const DEFAULT_SECTION = SECTIONS[0];

// Finds the section matching a pathname, or the default section.
export function findSectionByPath(pathname: string): SectionDefinition {
  return SECTIONS.find((section) => section.path === pathname) ?? DEFAULT_SECTION;
}
```

The reference project also exports an `indexOfSection` helper. It is not carried
over: it existed to drive the scroll navigation, which this app does not have, so
here it would be an exported function with no caller.

`DEFAULT_SECTION` is typed `SectionDefinition` rather than `SectionDefinition | undefined` because `SECTIONS` is a non-empty literal array. If `tsc` complains under `noUncheckedIndexedAccess` (not enabled in this project, but in case the config changes), assert with `SECTIONS[0] as SectionDefinition`.

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm test
```

Expected: PASS — 7 tests.

- [ ] **Step 5: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add the section list that drives routing and navigation

One ordered array is the single source of truth, so the router and the
navigation cannot disagree about which sections exist or what order they
are in.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Translations

Two locales, all copy Lorem Ipsum, plus the test that catches the most likely real bug in a two-locale app: the files drifting out of shape.

**Files:**
- Create: `personal-site.web/src/i18n/locales/en.json`
- Create: `personal-site.web/src/i18n/locales/de.json`
- Create: `personal-site.web/src/i18n/index.ts`
- Create: `personal-site.web/src/i18n/useTranslatedList.ts`
- Test: `personal-site.web/src/i18n/locales.test.ts`

**Interfaces:**
- Consumes: `SECTIONS` from `../config/sections`.
- Produces:
  - `const SUPPORTED_LANGUAGES = ['en', 'de'] as const`
  - `type Language = 'en' | 'de'`
  - `const DEFAULT_LANGUAGE: Language`
  - `function isSupported(value: string | null | undefined): value is Language`
  - `function persistLanguage(language: Language): void`
  - default export: the configured `i18next` instance
  - `function useTranslatedList<T>(key: string): T[]`

- [ ] **Step 1: Write the failing test**

Create `personal-site.web/src/i18n/locales.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { SECTIONS } from '../config/sections';
import de from './locales/de.json';
import en from './locales/en.json';

// Flattens an object into dotted key paths, so two locales can be compared by
// shape rather than by value. Array entries are indexed, which catches a
// locale that translated three experience items where the other has four.
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => keyPaths(entry, `${prefix}[${index}]`));
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) =>
      keyPaths(entry, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
}

// Reads a dotted path out of a locale object.
function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value !== null && typeof value === 'object') {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

describe('locale files', () => {
  it('have identical key shapes', () => {
    expect(keyPaths(de)).toEqual(keyPaths(en));
  });

  it('declare their own language metadata', () => {
    expect(en.meta.htmlLang).toBe('en');
    expect(de.meta.htmlLang).toBe('de');
    expect(en.meta.nativeName.length).toBeGreaterThan(0);
    expect(de.meta.nativeName.length).toBeGreaterThan(0);
  });

  it('resolve the label key of every section', () => {
    for (const section of SECTIONS) {
      expect(readPath(en, section.labelKey), `${section.labelKey} in en`).toBeTypeOf('string');
      expect(readPath(de, section.labelKey), `${section.labelKey} in de`).toBeTypeOf('string');
    }
  });

  it('give every link a usable href', () => {
    for (const item of en.sections.links.items) {
      expect(item.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });

  it('name the site owner rather than a Lorem Ipsum placeholder', () => {
    expect(en.identity.name).toBe('Nick Baumann');
    expect(de.identity.name).toBe('Nick Baumann');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm test
```

Expected: FAIL — `Failed to resolve import "./locales/en.json"`.

- [ ] **Step 3: Write `src/i18n/locales/en.json`**

```json
{
  "meta": {
    "nativeName": "English",
    "htmlLang": "en"
  },
  "identity": {
    "name": "Nick Baumann",
    "role": "Lorem Ipsum Dolor Sit Amet"
  },
  "nav": {
    "label": "Site sections",
    "about": "About",
    "experience": "Experience",
    "links": "Links"
  },
  "controls": {
    "label": "Site options",
    "language": "Switch language to German",
    "theme": {
      "toDark": "Switch to the dark theme",
      "toLight": "Switch to the light theme"
    }
  },
  "a11y": {
    "skipToContent": "Skip to content",
    "opensInNewTab": "(opens in a new tab)",
    "sectionAnnouncement": "{{section}} section",
    "pageTitle": "{{section}} — Nick Baumann"
  },
  "footer": {
    "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  "sections": {
    "about": {
      "title": "About",
      "kicker": "Lorem ipsum",
      "paragraphs": [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
      ]
    },
    "experience": {
      "title": "Experience",
      "kicker": "Lorem — ipsum",
      "items": [
        {
          "period": "Lorem 2022 — Present",
          "role": "Lorem Ipsum Engineer",
          "organisation": "Dolor Sit GmbH",
          "location": "Lorem",
          "summary": "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam.",
          "stack": [
            "Lorem",
            "Ipsum",
            "Dolor",
            "Sit Amet",
            "Consectetur",
            "Adipiscing",
            "Elit",
            "Tempor"
          ]
        },
        {
          "period": "Lorem 2019 — Lorem 2022",
          "role": "Dolor Sit Developer",
          "organisation": "Amet Consectetur AG",
          "location": "Ipsum",
          "summary": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
          "stack": [
            "Incididunt",
            "Labore",
            "Dolore",
            "Magna",
            "Aliqua",
            "Veniam",
            "Nostrud",
            "Ullamco"
          ]
        },
        {
          "period": "Lorem 2017 — Lorem 2019",
          "role": "Adipiscing Associate",
          "organisation": "Elit Sed Do",
          "location": "Dolor",
          "summary": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          "stack": [
            "Laboris",
            "Aliquip",
            "Commodo",
            "Consequat",
            "Reprehenderit",
            "Voluptate",
            "Cillum",
            "Pariatur"
          ]
        }
      ]
    },
    "links": {
      "title": "Links",
      "kicker": "Lorem ipsum dolor",
      "items": [
        {
          "label": "GitHub",
          "description": "Lorem ipsum dolor sit amet consectetur.",
          "href": "https://github.com/"
        },
        {
          "label": "LinkedIn",
          "description": "Adipiscing elit sed do eiusmod tempor.",
          "href": "https://www.linkedin.com/"
        },
        {
          "label": "Mastodon",
          "description": "Incididunt ut labore et dolore magna.",
          "href": "https://mastodon.social/"
        },
        {
          "label": "Email",
          "description": "Aliqua ut enim ad minim veniam quis.",
          "href": "mailto:hello@example.com"
        }
      ]
    }
  }
}
```

- [ ] **Step 4: Write `src/i18n/locales/de.json`**

Same shape, same array lengths. The `meta` block and `identity.name` differ; everything else stays Lorem Ipsum, which is language-neutral by nature.

```json
{
  "meta": {
    "nativeName": "Deutsch",
    "htmlLang": "de"
  },
  "identity": {
    "name": "Nick Baumann",
    "role": "Lorem Ipsum Dolor Sit Amet"
  },
  "nav": {
    "label": "Seitenbereiche",
    "about": "Über mich",
    "experience": "Erfahrung",
    "links": "Links"
  },
  "controls": {
    "label": "Seitenoptionen",
    "language": "Sprache auf Englisch umstellen",
    "theme": {
      "toDark": "Zum dunklen Design wechseln",
      "toLight": "Zum hellen Design wechseln"
    }
  },
  "a11y": {
    "skipToContent": "Zum Inhalt springen",
    "opensInNewTab": "(wird in einem neuen Tab geöffnet)",
    "sectionAnnouncement": "Bereich {{section}}",
    "pageTitle": "{{section}} — Nick Baumann"
  },
  "footer": {
    "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  "sections": {
    "about": {
      "title": "Über mich",
      "kicker": "Lorem ipsum",
      "paragraphs": [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
      ]
    },
    "experience": {
      "title": "Erfahrung",
      "kicker": "Lorem — ipsum",
      "items": [
        {
          "period": "Lorem 2022 — heute",
          "role": "Lorem Ipsum Engineer",
          "organisation": "Dolor Sit GmbH",
          "location": "Lorem",
          "summary": "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam.",
          "stack": [
            "Lorem",
            "Ipsum",
            "Dolor",
            "Sit Amet",
            "Consectetur",
            "Adipiscing",
            "Elit",
            "Tempor"
          ]
        },
        {
          "period": "Lorem 2019 — Lorem 2022",
          "role": "Dolor Sit Developer",
          "organisation": "Amet Consectetur AG",
          "location": "Ipsum",
          "summary": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
          "stack": [
            "Incididunt",
            "Labore",
            "Dolore",
            "Magna",
            "Aliqua",
            "Veniam",
            "Nostrud",
            "Ullamco"
          ]
        },
        {
          "period": "Lorem 2017 — Lorem 2019",
          "role": "Adipiscing Associate",
          "organisation": "Elit Sed Do",
          "location": "Dolor",
          "summary": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          "stack": [
            "Laboris",
            "Aliquip",
            "Commodo",
            "Consequat",
            "Reprehenderit",
            "Voluptate",
            "Cillum",
            "Pariatur"
          ]
        }
      ]
    },
    "links": {
      "title": "Links",
      "kicker": "Lorem ipsum dolor",
      "items": [
        {
          "label": "GitHub",
          "description": "Lorem ipsum dolor sit amet consectetur.",
          "href": "https://github.com/"
        },
        {
          "label": "LinkedIn",
          "description": "Adipiscing elit sed do eiusmod tempor.",
          "href": "https://www.linkedin.com/"
        },
        {
          "label": "Mastodon",
          "description": "Incididunt ut labore et dolore magna.",
          "href": "https://mastodon.social/"
        },
        {
          "label": "E-Mail",
          "description": "Aliqua ut enim ad minim veniam quis.",
          "href": "mailto:hello@example.com"
        }
      ]
    }
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm test
```

Expected: PASS — 12 tests across both files. If the shape test fails, it prints the differing key paths; fix `de.json` to match `en.json`.

- [ ] **Step 6: Write `src/i18n/index.ts`**

```ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

const STORAGE_KEY = 'nick-baumann-site.language';

// Narrows an unknown string to a supported language code.
export function isSupported(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

// Returns the stored language, then the browser language, then the default.
function detectLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    // localStorage is unavailable in private modes; fall through to detection.
  }

  for (const candidate of navigator.languages ?? [navigator.language]) {
    const base = candidate.split('-')[0]?.toLowerCase();
    if (isSupported(base)) return base;
  }

  return DEFAULT_LANGUAGE;
}

// Writes the language to storage and syncs the `lang` attribute on <html>.
export function persistLanguage(language: Language): void {
  document.documentElement.lang = language;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage failures; the language still applies for this session.
  }
}

const initialLanguage = detectLanguage();

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: { escapeValue: false },
  returnObjects: true,
});

document.documentElement.lang = initialLanguage;

export default i18next;
```

- [ ] **Step 7: Write `src/i18n/useTranslatedList.ts`**

```ts
import { useTranslation } from 'react-i18next';

// Reads an array value out of the locale files and types its entries. Returns
// an empty array when the key is missing or is not an array, so a bad key
// renders an empty list rather than throwing.
export function useTranslatedList<T>(key: string): T[] {
  const { t } = useTranslation();
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? (value as T[]) : [];
}
```

- [ ] **Step 8: Typecheck**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm run typecheck
```

Expected: no output, exit code 0.

- [ ] **Step 9: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add the English and German translations

Every user-facing string lives in a locale file, so the site can be
retranslated and rewritten without opening a component. The copy is Lorem
Ipsum in realistic quantities, waiting for the real words.

A test compares the two files by key shape, which is the failure this kind
of app actually hits: one locale gaining or losing an entry.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Design tokens and global styles

The neutral visual baseline. This is the file whoever restyles the site will open first.

**Files:**
- Create: `personal-site.web/src/styles/_tokens.scss`
- Create: `personal-site.web/src/styles/_variables.scss`
- Create: `personal-site.web/src/styles/_mixins.scss`
- Create: `personal-site.web/src/styles/global.scss`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties consumed by every component and by `createAppTheme` in Task 5; the Sass mixins `below($width)`, `above($width)`, `motion-safe`, `motion-reduce`, `visually-hidden`, `focus-ring($offset)`; the global classes `.skip-link` and `.visually-hidden`.

- [ ] **Step 1: Write `src/styles/_tokens.scss`**

The contrast ratios in the comments were computed against the WCAG 2.1 formula and all clear AA (4.5:1 for body text).

```scss
// CSS custom properties. `:root` holds the light theme; `[data-theme='dark']`
// overrides the colours that differ.
//
// This is the neutral baseline. It is deliberately plain: no shadows, no
// gradients, no border radii, no fluid type. Every value here is meant to be
// replaced once the visual style is chosen.

:root {
  color-scheme: light;

  // --- Colour ---
  --color-bg: #ffffff;
  --color-surface: #f7f7f7;
  --color-text: #1a1a1a;        // 17.4:1 on --color-bg
  --color-text-muted: #595959;  //  7.0:1 on --color-bg
  --color-accent: #2c5aa0;      //  6.9:1 on --color-bg
  --color-accent-contrast: #ffffff;
  --color-border: #d4d4d4;
  --color-focus: #2c5aa0;

  // --- Spacing ---
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;

  // --- Type ---
  --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;

  --leading-normal: 1.6;

  // --- Motion ---
  // One token, on purpose. The style that replaces this can add more.
  --transition: 150ms ease;
}

[data-theme='dark'] {
  color-scheme: dark;

  --color-bg: #121212;
  --color-surface: #1e1e1e;
  --color-text: #ededed;        // 16.0:1 on --color-bg
  --color-text-muted: #a3a3a3;  //  7.4:1 on --color-bg
  --color-accent: #7aa2d6;      //  7.1:1 on --color-bg
  --color-accent-contrast: #121212;
  --color-border: #333333;
  --color-focus: #7aa2d6;
}
```

- [ ] **Step 2: Write `src/styles/_variables.scss`**

```scss
// Sass-level constants, resolved at build time. Values that change at runtime
// (colours, spacing) are CSS custom properties in `_tokens.scss` instead.

// Breakpoint widths in pixels.
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;

// Stacking order.
$z-header: 10;
$z-skip-link: 1000;
```

- [ ] **Step 3: Write `src/styles/_mixins.scss`**

`themed-scrollbar` and `short` from the reference project are not carried over — nothing here scrolls in a custom container, and there is no compact layout variant.

```scss
@use 'variables' as v;

// Applies styles at or below a max width.
@mixin below($width) {
  @media (max-width: #{$width - 1px}) {
    @content;
  }
}

// Applies styles at or above a min width.
@mixin above($width) {
  @media (min-width: $width) {
    @content;
  }
}

// Applies styles only when the user has not asked for reduced motion.
@mixin motion-safe {
  @media (prefers-reduced-motion: no-preference) {
    @content;
  }
}

// Applies styles only when the user has asked for reduced motion.
@mixin motion-reduce {
  @media (prefers-reduced-motion: reduce) {
    @content;
  }
}

// Hides an element visually but keeps it readable by screen readers.
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

// Draws the shared focus ring.
@mixin focus-ring($offset: 2px) {
  outline: 2px solid var(--color-focus);
  outline-offset: $offset;
}
```

- [ ] **Step 4: Write `src/styles/global.scss`**

Note the difference from the reference project: `body` has **no** `overflow: hidden`. The window scrolls normally.

```scss
@use 'tokens';
@use 'mixins' as m;
@use 'variables' as v;

*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html {
  // Prevents the browser from inflating font sizes on rotated phones.
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  transition: background-color var(--transition), color var(--transition);
}

img,
svg {
  display: block;
  max-width: 100%;
}

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus {
  outline: none;
}

:focus-visible {
  @include m.focus-ring;
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-accent-contrast);
}

// Turns off every animation and transition for users who ask for reduced motion.
@include m.motion-reduce {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// Jump link revealed only when focused with the keyboard.
.skip-link {
  @include m.visually-hidden;

  &:focus-visible {
    position: fixed;
    top: var(--space-2);
    left: var(--space-2);
    z-index: v.$z-skip-link;
    width: auto;
    height: auto;
    margin: 0;
    padding: var(--space-2) var(--space-4);
    clip-path: none;
    background-color: var(--color-accent);
    color: var(--color-accent-contrast);
    font-size: var(--text-sm);
    font-weight: 600;
  }
}

// Announces the current section to screen readers without showing anything.
.visually-hidden {
  @include m.visually-hidden;
}
```

- [ ] **Step 5: Verify the stylesheets compile**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm run build
```

The placeholder `main.tsx` does not import `global.scss` yet, so add the import temporarily to prove the Sass compiles, then remove it — or simply accept that Task 7 is the first real check. To prove it now, run:

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npx sass --load-path=src/styles src/styles/global.scss /dev/null --no-source-map
```

Expected: no output, exit code 0. A Sass error names the file and line.

- [ ] **Step 6: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add the neutral design tokens and global styles

The visual style has not been chosen yet, so the baseline is deliberately
plain: eight colours, one spacing scale, four font sizes, one motion token,
and no ornament at all. Both themes meet WCAG AA for body text, and the
measured ratios are recorded beside the values.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Theme layer

Light and dark switching, and the MUI theme that the two icon buttons read.

**Files:**
- Create: `personal-site.web/src/theme/themeContext.ts`
- Create: `personal-site.web/src/theme/createAppTheme.ts`
- Create: `personal-site.web/src/theme/AppThemeProvider.tsx`

**Interfaces:**
- Consumes: the CSS custom properties from Task 4.
- Produces:
  - `type ThemeMode = 'light' | 'dark'`
  - `interface ThemeModeContextValue { mode: ThemeMode; toggleMode: () => void }`
  - `const ThemeModeContext`
  - `function useThemeMode(): ThemeModeContextValue`
  - `function createAppTheme(mode: ThemeMode): Theme`
  - `function AppThemeProvider({ children }: { children: ReactNode })`

- [ ] **Step 1: Write `src/theme/themeContext.ts`**

```ts
import { createContext, use } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

// Reads the current theme mode. Throws when used outside AppThemeProvider.
export function useThemeMode(): ThemeModeContextValue {
  const context = use(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used inside AppThemeProvider');
  }
  return context;
}
```

- [ ] **Step 2: Write `src/theme/createAppTheme.ts`**

Every custom property referenced here is defined in `_tokens.scss` from Task 4. Do not add references to tokens that do not exist — MUI will render `var(--missing)` as an invalid value and the button silently loses its colour.

```ts
import { createTheme, type Theme } from '@mui/material/styles';

import type { ThemeMode } from './themeContext';

// Builds the Material UI theme for the two icon buttons and their tooltips.
// Colours are read from the CSS custom properties in `styles/_tokens.scss`,
// which change with the `data-theme` attribute, so only `palette.mode` depends
// on the argument.
export function createAppTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      background: {
        default: 'var(--color-bg)',
        paper: 'var(--color-surface)',
      },
      text: {
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-muted)',
      },
    },
    // The neutral baseline has no border radii.
    shape: { borderRadius: 0 },
    typography: { fontFamily: 'var(--font-sans)' },
    components: {
      MuiIconButton: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: {
            color: 'var(--color-text-muted)',
            borderRadius: 0,
            transition: 'color var(--transition), background-color var(--transition)',
            '&:hover': {
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
            },
            '&:focus-visible': {
              outline: '2px solid var(--color-focus)',
              outlineOffset: '2px',
            },
          },
          // Set here rather than in a stylesheet because MUI's own sizeSmall
          // rule would otherwise win on specificity.
          sizeSmall: { padding: 'var(--space-2)' },
        },
      },
      MuiTooltip: {
        defaultProps: { arrow: false, enterDelay: 400 },
        styleOverrides: {
          tooltip: {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 0,
            fontSize: 'var(--text-sm)',
            padding: '6px 10px',
          },
        },
      },
    },
  });
}
```

- [ ] **Step 3: Write `src/theme/AppThemeProvider.tsx`**

```tsx
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { createAppTheme } from './createAppTheme';
import { ThemeModeContext, type ThemeMode } from './themeContext';

const STORAGE_KEY = 'nick-baumann-site.theme';

// Returns the stored mode, then the operating system preference, then 'dark'.
function detectMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage is unavailable in private modes; fall through to detection.
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(detectMode);

  // Exposes the mode to CSS through a `data-theme` attribute on <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage failures; the mode still applies for this session.
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={false} />
        {children}
      </ThemeProvider>
    </ThemeModeContext>
  );
}
```

The reference project's `usePrefersReducedMotion` hook is not carried over. Nothing in the neutral baseline animates from JavaScript, and reduced motion is already honoured by the `motion-reduce` block in `global.scss`, so the hook would have no caller. A restyle that adds JS-driven motion can lift it back from `brunoccst/personal-site`.

- [ ] **Step 4: Typecheck**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm run typecheck
```

Expected: no output, exit code 0.

- [ ] **Step 5: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add light and dark theme switching

The provider writes the mode onto the html element, so components read
colours through custom properties and never need to know which theme is
active. The Material UI theme reads the same properties, which keeps the
two icon buttons in step with everything else.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Header components

Brand, navigation and the two system controls, with their stylesheets.

**Files:**
- Create: `personal-site.web/src/components/Brand/Brand.tsx`
- Create: `personal-site.web/src/components/Brand/Brand.module.scss`
- Create: `personal-site.web/src/components/Nav/Nav.tsx`
- Create: `personal-site.web/src/components/Nav/Nav.module.scss`
- Create: `personal-site.web/src/components/SystemControls/SystemControls.tsx`
- Create: `personal-site.web/src/components/SystemControls/SystemControls.module.scss`

**Interfaces:**
- Consumes: `SECTIONS` from `../../config/sections`; `persistLanguage` and `type Language` from `../../i18n`; `useThemeMode` from `../../theme/themeContext`.
- Produces: `function Brand()`, `function Nav()`, `function SystemControls()` — all named exports, all taking no props.

- [ ] **Step 1: Write `Brand.tsx`**

The reference project's `identity.separator` and `.role` split is dropped: the neutral header is a name and a role on one line, with no decorative separator character to position.

```tsx
import { useTranslation } from 'react-i18next';

import styles from './Brand.module.scss';

// The page heading.
export function Brand() {
  const { t } = useTranslation();

  return (
    <h1 className={styles.brand}>
      <span className={styles.name}>{t('identity.name')}</span>
      <span className={styles.role}>{t('identity.role')}</span>
    </h1>
  );
}
```

- [ ] **Step 2: Write `Brand.module.scss`**

```scss
.brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.3;
}

.name {
  color: var(--color-text);
}

.role {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 400;
}
```

- [ ] **Step 3: Write `Nav.tsx`**

```tsx
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { SECTIONS } from '../../config/sections';
import styles from './Nav.module.scss';

// Section links. Reads the section list and nothing else, so it cannot
// disagree with the route table.
export function Nav() {
  const { t } = useTranslation();

  return (
    <nav aria-label={t('nav.label')}>
      <ul className={styles.list}>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <NavLink
              to={section.path}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {t(section.labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

`NavLink` sets `aria-current="page"` on the active link by itself — do not add it by hand.

- [ ] **Step 4: Write `Nav.module.scss`**

```scss
.list {
  display: flex;
  gap: var(--space-4);
  list-style: none;
}

.link {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  transition: color var(--transition);

  &:hover {
    color: var(--color-text);
  }
}

.active {
  color: var(--color-text);
  font-weight: 600;
}
```

- [ ] **Step 5: Write `SystemControls.tsx`**

```tsx
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import TranslateRounded from '@mui/icons-material/TranslateRounded';

import { persistLanguage, type Language } from '../../i18n';
import { useThemeMode } from '../../theme/themeContext';
import styles from './SystemControls.module.scss';

// Maps each language to the one the toggle switches to.
const NEXT_LANGUAGE: Record<Language, Language> = { en: 'de', de: 'en' };

// Theme and language toggles.
export function SystemControls() {
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useThemeMode();

  const currentLanguage = (i18n.resolvedLanguage ?? 'en') as Language;
  const nextLanguage = NEXT_LANGUAGE[currentLanguage] ?? 'de';

  const toggleLanguage = useCallback(() => {
    void i18n.changeLanguage(nextLanguage);
    persistLanguage(nextLanguage);
  }, [i18n, nextLanguage]);

  const themeLabel = mode === 'dark' ? t('controls.theme.toLight') : t('controls.theme.toDark');

  return (
    <div className={styles.controls} role="group" aria-label={t('controls.label')}>
      <Tooltip title={t('controls.language')}>
        <IconButton
          onClick={toggleLanguage}
          aria-label={t('controls.language')}
          size="small"
        >
          <TranslateRounded fontSize="small" />
          <span className={styles.code} aria-hidden="true">
            {currentLanguage.toUpperCase()}
          </span>
        </IconButton>
      </Tooltip>

      <Tooltip title={themeLabel}>
        <IconButton
          onClick={toggleMode}
          aria-label={themeLabel}
          aria-pressed={mode === 'dark'}
          size="small"
        >
          {mode === 'dark' ? (
            <LightModeRounded fontSize="small" />
          ) : (
            <DarkModeRounded fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
}
```

- [ ] **Step 6: Write `SystemControls.module.scss`**

```scss
.controls {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.code {
  margin-left: var(--space-1);
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
}
```

- [ ] **Step 7: Typecheck**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm run typecheck
```

Expected: no output, exit code 0.

- [ ] **Step 8: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add the header, navigation and system controls

The navigation builds itself from the section list, so adding a section
never means editing a menu. The two controls switch theme and language and
carry their labels from the locale files.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Layout, routing and the application entry point

Wires everything together. At the end of this task the site runs.

**Files:**
- Create: `personal-site.web/src/hooks/useDocumentTitle.ts`
- Create: `personal-site.web/src/components/Layout/Layout.tsx`
- Create: `personal-site.web/src/components/Layout/Layout.module.scss`
- Create: `personal-site.web/src/App.tsx`
- Modify: `personal-site.web/src/main.tsx` (replace the Task 1 placeholder entirely)

**Interfaces:**
- Consumes: `Brand`, `Nav`, `SystemControls` from Task 6; `SECTIONS`, `DEFAULT_SECTION`, `findSectionByPath`, `type SectionId` from Task 2; `AppThemeProvider` from Task 5.
- Produces: `function useDocumentTitle(title: string): void`; `function Layout()`; default-exported `App`. Task 8 fills `SECTION_COMPONENTS` with real section components — until then it points at placeholders that Task 8 replaces.

- [ ] **Step 1: Write `src/hooks/useDocumentTitle.ts`**

```ts
import { useEffect } from 'react';

// Keeps `document.title` in step with the current section.
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

- [ ] **Step 2: Write `src/components/Layout/Layout.tsx`**

`<Outlet />` renders the matched section. The live region sits after `<main>` and announces the section name on every change.

```tsx
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';

import { findSectionByPath } from '../../config/sections';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Brand } from '../Brand/Brand';
import { Nav } from '../Nav/Nav';
import { SystemControls } from '../SystemControls/SystemControls';
import styles from './Layout.module.scss';

// The page frame: header, the routed section, and a footer.
export function Layout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const currentSection = findSectionByPath(pathname);
  const sectionLabel = t(currentSection.labelKey);

  useDocumentTitle(t('a11y.pageTitle', { section: sectionLabel }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Brand />

        <div className={styles.headerEnd}>
          <Nav />
          <SystemControls />
        </div>
      </header>

      <main id="content" className={styles.main} aria-label={sectionLabel}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>{t('footer.note')}</p>
      </footer>

      <p className="visually-hidden" role="status" aria-live="polite">
        {t('a11y.sectionAnnouncement', { section: sectionLabel })}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/Layout/Layout.module.scss`**

```scss
@use '../../styles/mixins' as m;
@use '../../styles/variables' as v;

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 48rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  gap: var(--space-6);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);

  @include m.below(v.$bp-sm) {
    flex-direction: column;
  }
}

.headerEnd {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.main {
  flex: 1;
}

.footer {
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
```

- [ ] **Step 4: Write `src/App.tsx`**

The three imports below are created in Task 8. If Task 8 has not run yet, create the three files as one-line placeholders (`export default function AboutSection() { return null; }` and so on) so this task's build passes; Task 8 overwrites them.

```tsx
import { type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { DEFAULT_SECTION, SECTIONS, type SectionId } from './config/sections';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import LinksSection from './sections/LinksSection';

// Component rendered for each section.
const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  about: AboutSection,
  experience: ExperienceSection,
  links: LinksSection,
};

export default function App() {
  const { t } = useTranslation();

  return (
    <>
      {/* First stop in the tab order, so keyboard users can jump the header. */}
      <a className="skip-link" href="#content">
        {t('a11y.skipToContent')}
      </a>

      <Routes>
        <Route path="/" element={<Navigate to={DEFAULT_SECTION.path} replace />} />

        <Route element={<Layout />}>
          {SECTIONS.map((section) => {
            const Section = SECTION_COMPONENTS[section.id];
            return <Route key={section.id} path={section.path} element={<Section />} />;
          })}
        </Route>

        <Route path="*" element={<Navigate to={DEFAULT_SECTION.path} replace />} />
      </Routes>
    </>
  );
}
```

- [ ] **Step 5: Replace `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './i18n';
import { AppThemeProvider } from './theme/AppThemeProvider';
import './styles/global.scss';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html');

createRoot(container).render(
  <StrictMode>
    <AppThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
```

- [ ] **Step 6: Build and verify**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm run build
```

Expected: `built in ...`, with `dist/index.html` and chunked assets (`react`, `mui`, `i18n`) written.

- [ ] **Step 7: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Wire the layout, the routes and the application entry point

The route table is generated from the section list, and the layout keeps
the document title and a screen reader live region in step with whichever
section is showing.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Sections

The three content sections and their shared stylesheet.

**Files:**
- Create (or replace the Task 7 placeholders): `personal-site.web/src/sections/AboutSection.tsx`
- Create: `personal-site.web/src/sections/ExperienceSection.tsx`
- Create: `personal-site.web/src/sections/LinksSection.tsx`
- Create: `personal-site.web/src/sections/Section.module.scss`

**Interfaces:**
- Consumes: `useTranslatedList` from `../i18n/useTranslatedList`.
- Produces: three default-exported components, `AboutSection`, `ExperienceSection`, `LinksSection`, each taking no props — the names `App.tsx` already imports.

- [ ] **Step 1: Write `AboutSection.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

import { useTranslatedList } from '../i18n/useTranslatedList';
import styles from './Section.module.scss';

export default function AboutSection() {
  const { t } = useTranslation();
  const paragraphs = useTranslatedList<string>('sections.about.paragraphs');

  return (
    <article className={styles.section}>
      <span className={styles.kicker}>{t('sections.about.kicker')}</span>
      <h2 className={styles.title}>{t('sections.about.title')}</h2>

      <div className={styles.prose}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Write `ExperienceSection.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

import { useTranslatedList } from '../i18n/useTranslatedList';
import styles from './Section.module.scss';

interface ExperienceItem {
  period: string;
  role: string;
  organisation: string;
  location: string;
  summary: string;
  /** Technologies used in the role, shown as tags. */
  stack: string[];
}

export default function ExperienceSection() {
  const { t } = useTranslation();
  const items = useTranslatedList<ExperienceItem>('sections.experience.items');

  return (
    <article className={styles.section}>
      <span className={styles.kicker}>{t('sections.experience.kicker')}</span>
      <h2 className={styles.title}>{t('sections.experience.title')}</h2>

      <ol className={styles.list}>
        {items.map((item) => (
          <li key={`${item.period}-${item.role}`} className={styles.entry}>
            <span className={styles.period}>
              {item.period}
              <span className={styles.separator} aria-hidden="true">
                ·
              </span>
              {item.location}
            </span>

            <h3 className={styles.role}>{item.role}</h3>
            <span className={styles.organisation}>{item.organisation}</span>
            <p className={styles.summary}>{item.summary}</p>

            <ul className={styles.stack}>
              {item.stack.map((tech) => (
                <li key={tech} className={styles.tag}>
                  {tech}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </article>
  );
}
```

- [ ] **Step 3: Write `LinksSection.tsx`**

```tsx
import { useTranslation } from 'react-i18next';

import { useTranslatedList } from '../i18n/useTranslatedList';
import styles from './Section.module.scss';

interface LinkItem {
  label: string;
  description: string;
  href: string;
}

// Mail links open the visitor's mail client rather than a new tab.
function isExternal(href: string): boolean {
  return !href.startsWith('mailto:');
}

export default function LinksSection() {
  const { t } = useTranslation();
  const items = useTranslatedList<LinkItem>('sections.links.items');

  return (
    <article className={styles.section}>
      <span className={styles.kicker}>{t('sections.links.kicker')}</span>
      <h2 className={styles.title}>{t('sections.links.title')}</h2>

      <ul className={styles.list}>
        {items.map((item) => {
          const external = isExternal(item.href);

          return (
            <li key={item.href + item.label}>
              <a
                className={styles.link}
                href={item.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <span className={styles.linkLabel}>
                  {item.label}
                  {external && (
                    <span className="visually-hidden"> {t('a11y.opensInNewTab')}</span>
                  )}
                </span>
                <span className={styles.linkDescription}>{item.description}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
```

- [ ] **Step 4: Write `Section.module.scss`**

```scss
.section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.kicker {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.title {
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.2;
}

.prose {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-2);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-top: var(--space-2);
  list-style: none;
}

// --- Experience ---

.entry {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.period {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.separator {
  margin: 0 var(--space-2);
}

.role {
  font-size: var(--text-lg);
  font-weight: 600;
}

.organisation {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.summary {
  margin-top: var(--space-2);
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
  list-style: none;
}

.tag {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

// --- Links ---

.link {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
  transition: color var(--transition);

  &:hover .linkLabel {
    color: var(--color-accent);
  }
}

.linkLabel {
  font-weight: 600;
  transition: color var(--transition);
}

.linkDescription {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
```

- [ ] **Step 5: Run the full check**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site/personal-site.web && npm test && npm run build
```

Expected: 12 tests pass, build succeeds.

- [ ] **Step 6: Verify in the browser**

Create `.claude/launch.json` at the repository root:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "personal-site",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev", "--prefix", "personal-site.web"],
      "port": 5173
    }
  ]
}
```

Start the preview and check, in order:

1. `/` redirects to `/about`.
2. `/about`, `/experience` and `/links` each render their heading and content.
3. `/nonsense` redirects to `/about`.
4. The theme toggle switches light and dark, and the choice survives a reload.
5. The language toggle switches EN and DE, and the choice survives a reload.
6. The console has no errors or warnings.
7. Tab from the top of the page reveals the skip link first.

- [ ] **Step 7: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Add the about, experience and links sections

Each section reads its content from the locale files, so the shape of the
data is fixed but every word in it can be replaced without touching a
component.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Documentation

Written fresh, not copied. A copied README would describe a frame, an intro animation and scroll navigation that this app does not have.

**Files:**
- Create: `README.md`
- Create: `docs/DECISIONS.md`
- Create: `docs/KNOWN-ISSUES.md`
- Create: `docs/NEXT-STEPS.md`

**Interfaces:**
- Consumes: the finished application.
- Produces: nothing code depends on. The Netlify badge is added in Task 10, once a site ID exists.

- [ ] **Step 1: Write `README.md`**

Cover, in this order: what the site is and that the visual style is deliberately unfinished; requirements (Node 22+, npm 10+); `cd personal-site.web && npm install && npm run dev`; a table of the npm scripts (`dev`, `build`, `preview`, `typecheck`, `test`); the repository layout and the application layout, both copied from the spec; the tech stack table; how routing works, driven by `config/sections.ts`, with the URL table; the styling section explaining tokens and CSS Modules and stating plainly that the baseline is a placeholder; the theme section naming the `nick-baumann-site.theme` key; the translations section naming the `nick-baumann-site.language` key and the "no strings in components" rule, with the three-step recipe for adding a key; the recipe for adding a section; the accessibility list; deployment via `netlify.toml`; and the MIT licence line.

Do not describe an intro, a frame, a side navigation or scroll navigation. They do not exist here.

- [ ] **Step 2: Write `docs/DECISIONS.md`**

Record the reasoning, not the code. At minimum:

- **Why the visual layer is empty.** The style had not been chosen when the site was built. Structure, routing, theming, i18n and accessibility are finished; colour, type, layout ornament and motion are not. The restyle contract: class names and DOM structure are stable, everything in `_tokens.scss` and the `*.module.scss` files is replaceable.
- **Why the architecture came from `brunoccst/personal-site`.** It is a proven arrangement for exactly this kind of site, and reusing it meant the effort went into what was actually undecided.
- **Why Material UI is here.** It serves only the two icon buttons and their tooltips, and it brings `@emotion/react` and `@emotion/styled` with it. It was kept for parity with the reference project. Note honestly that a future restyle will have to override MUI's own styles for those buttons, and that dropping MUI in favour of two hand-rolled buttons remains a reasonable option.
- **Why the copy is Lorem Ipsum.** The site is a gift; the recipient writes the words. The Lorem is sized to realistic content so the layout is not tuned to text that will never exist.
- **Why the `localStorage` keys are `nick-baumann-site.*`.** The reference project uses `personal-site.*`, and both dev servers serve `http://localhost:5173` — one origin, one `localStorage`. Sharing keys would let each site overwrite the other's saved theme and language.
- **Why there is no CI.** Netlify's deploy previews already build and type-check every pull request. A GitHub Actions job would duplicate that.
- **Why the repository is under `brunoccst`.** The GitHub account `nick-baumann` did not exist when the site was built. Transfer preserves history, issues and stars.
- **Contrast ratios.** Reproduce the six measured values from `_tokens.scss`, both themes, and state that all clear WCAG AA for body text.

- [ ] **Step 3: Write `docs/KNOWN-ISSUES.md`**

State plainly:

- The visual style is a placeholder, not a design. This is intended, not an oversight.
- All copy is Lorem Ipsum.
- The link `href` values point at site roots (`https://github.com/` and so on) and a `mailto:hello@example.com` that nobody reads.
- There are no component or end-to-end tests. The suite covers section lookup and locale shape only; everything else is checked by `tsc`, the build, and by hand in a browser.
- The repository and the Netlify project are owned by `brunoccst`, not by the recipient.
- The favicon is a plain `NB` monogram, matched to the placeholder styling.

- [ ] **Step 4: Write `docs/NEXT-STEPS.md`**

In rough order:

1. Choose the visual style, then rewrite `_tokens.scss` and the component stylesheets. Decide at that point whether MUI stays.
2. Replace the Lorem Ipsum in `en.json` and `de.json`, and the real `href` values in the links section.
3. Replace the favicon and the `<meta name="description">` in `index.html`.
4. Transfer the GitHub repository to the recipient's account once it exists.
5. Transfer the Netlify project, or have the recipient link their own and point a custom domain at it.
6. Optional: add a GitHub Actions workflow running `npm ci`, `npm run typecheck`, `npm test` and `npm run build` on pull requests, if a status check independent of Netlify is wanted.
7. Two helpers were left out because nothing here calls them, and can be lifted back from `brunoccst/personal-site` if the restyle needs them: `indexOfSection` in `config/sections.ts`, for previous/next section navigation, and the `usePrefersReducedMotion` hook, for motion driven from JavaScript rather than CSS.

- [ ] **Step 5: Commit**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git add -A
git commit -m "Document the project

Written for two readers: whoever chooses the visual style later, and the
person receiving the site. The decisions file records why the visual layer
was left empty, so that choice reads as deliberate rather than unfinished.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 10: Publish

Creates the GitHub repository, opens and merges the pull request, and creates the Netlify project.

**This task performs outward-facing actions. Confirm with the user before Step 2 (creating a public GitHub repository), Step 4 (merging), and Step 5 (creating the Netlify project). Do not run them unprompted.**

**Files:**
- Modify: `README.md` (add the Netlify badge, once a site ID exists)

**Interfaces:**
- Consumes: the committed branch `feature/initial-scaffold`.
- Produces: `https://github.com/brunoccst/nick-baumann-personal-site`, a Netlify project, and a live URL.

- [ ] **Step 1: Confirm the tree is clean and the checks pass**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site && git status --short && cd personal-site.web && npm run typecheck && npm test && npm run build
```

Expected: no output from `git status`, all tests pass, build succeeds. Do not continue otherwise.

- [ ] **Step 2: Create the GitHub repository and push**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
gh repo create brunoccst/nick-baumann-personal-site --public --source=. --remote=origin --description "A personal site built as a gift. Architecture is finished; the visual style is deliberately not."
git push -u origin feature/initial-scaffold
```

Note: `gh repo create --source=.` pushes the current branch and sets `origin`. `main` currently exists locally with the two spec commits; push it too so the default branch is not empty:

```bash
git push origin main
```

- [ ] **Step 3: Open the pull request**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
gh pr create --base main --head feature/initial-scaffold \
  --title "Build the personal site" \
  --body "Builds the site described in \`docs/superpowers/specs/2026-09-08-personal-site-design.md\`.

The architecture, routing, theming, translations and accessibility are finished. The visual layer is deliberately not: the style has not been chosen yet, so the baseline is a plain unstyled document that can be replaced without rearranging anything.

Verified with \`npm run typecheck\`, \`npm test\` and \`npm run build\`, and by driving the dev server through all three routes in both themes and both languages.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

- [ ] **Step 4: Merge and clean up**

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
gh pr merge --merge --delete-branch
git checkout main && git pull
```

- [ ] **Step 5: Create the Netlify project**

Use the Netlify project tooling: `create-new-project` with `name: "nick-baumann-personal-site"` and `teamSlug: "brunoccst"`. If the name is taken, retry with `nick-baumann-site`.

That tooling creates the project but cannot link it to GitHub — the link needs a GitHub authorization only the account owner can grant. Give the user these steps and wait:

1. Open the project in the Netlify dashboard.
2. **Site configuration → Build & deploy → Continuous deployment → Link repository.**
3. Choose GitHub and authorize, then pick `brunoccst/nick-baumann-personal-site`.
4. Leave the build settings empty — `netlify.toml` supplies base, command and publish directory.

- [ ] **Step 6: Verify the deploy**

Once the user says the repository is linked, confirm through the Netlify tooling that the project has a linked repo and a successful published deploy, and fetch the live URL. Load the URL and check that `/experience` survives a hard refresh — that is the catch-all redirect doing its job. Do not describe the site as live until a deploy has actually succeeded.

- [ ] **Step 7: Add the deploy badge and commit**

With the real site ID and name, add to `README.md` under the title:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/<SITE_ID>/deploy-status)](https://app.netlify.com/sites/<SITE_NAME>/deploys)
```

Then, on a branch:

```bash
cd /d/Users/bruno/Repositories/nick-baumann-personal-site
git checkout -b docs/netlify-badge
git add README.md
git commit -m "Add the Netlify deploy badge

The site now has a project and a successful deploy, so the badge has a real
status to report.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
gh pr create --base main --head docs/netlify-badge --title "Add the Netlify deploy badge" --body "Adds the badge now that the site is deployed.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
gh pr merge --merge --delete-branch
```

---

## Verification checklist

Run before calling the work done:

- [ ] `npm run typecheck` — exit 0
- [ ] `npm test` — 12 tests pass
- [ ] `npm run build` — succeeds, writes `dist/`
- [ ] `/` redirects to `/about`; all three routes render; an unknown path redirects
- [ ] Theme toggle works and survives a reload
- [ ] Language toggle works and survives a reload
- [ ] Browser console clean
- [ ] Skip link is first in the tab order
- [ ] Hard refresh on `/experience` works on the deployed URL
- [ ] `localStorage` keys are `nick-baumann-site.*`, and the reference project's saved theme is untouched

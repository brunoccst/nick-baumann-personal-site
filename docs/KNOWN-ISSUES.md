# Known issues

## The visual style is a placeholder, not a design

Every colour, spacing value and layout rule in `src/styles/_tokens.scss` and
the component `*.module.scss` files is a neutral placeholder. This is
intended, not an oversight: the visual style had not been chosen when the
site was built, and finishing the structure first meant the eventual style
could be applied without fighting anything already in place. See
`docs/DECISIONS.md` for the reasoning and the restyle contract.

## Body copy is Lorem Ipsum; the interface text is real

The About paragraphs, the Experience summaries and stack tags, the link
descriptions, the section kickers, `identity.role`, and `footer.note` are
placeholder Latin text in both `en.json` and `de.json` — that is the body
copy, and it is expected to be filler. Navigation labels, control labels,
accessibility strings, section titles and link labels are real text in both
locales, not Lorem Ipsum, because Lorem Ipsum would break them rather than
stand in for them. The recipient replaces the body copy with his own words;
`docs/NEXT-STEPS.md` and the README's "Translations" section say exactly
what to edit.

## `npm install` crashes on the npm version bundled with recent Node 22 installers

npm 10.9.3 fails to install this project's dependencies. The bundled
`@npmcli/arborist` throws `Cannot read properties of null (reading
'edgesOut')` while resolving this dependency set's peer graph. Workaround:

```bash
npx --yes npm@11 install
```

## A flash of the wrong theme on first paint

`index.html` ships `data-theme="dark"` statically, along with a matching
`<meta name="color-scheme" content="dark">` and `theme-color`. `main.tsx`
mounts `AppThemeProvider`, which reads the saved or system theme and
corrects the `data-theme` attribute — but only after React has rendered. A
visitor whose saved preference or `prefers-color-scheme` is light sees one
dark frame before the correction lands.

This is inherent to a single-page app with no server rendering and no inline
script in `<head>` to set the attribute before first paint. Fixing it would
mean adding a small blocking script to `index.html` that reads
`localStorage` and `matchMedia` before React loads — a reasonable follow-up,
not done here to keep `index.html` free of inline logic.

## No runtime validation of locale shape

`useTranslatedList<T>` (`src/i18n/useTranslatedList.ts`) reads a value out of
the active locale file and casts it to the `T` declared by the calling
section component — it only checks that the value is an array, not that its
elements have the fields the component expects.

The test suite in `src/i18n/locales.test.ts` compares the key shapes of
`en.json` and `de.json` against each other, so it catches one locale
drifting from the other (a field present in English but missing in German,
say). It does **not** catch a field removed from both locale files at once —
that passes the shape comparison because the two files still agree with each
other, and then throws at render when a section component reads a field
that no longer exists. See `docs/NEXT-STEPS.md` for a proposed fix.

## Section lists are keyed by array index

`AboutSection`, `ExperienceSection` and `LinksSection` key their list items
by index rather than by content. This is a deliberate choice, not an
oversight — see `docs/DECISIONS.md` for why it is safe for these
particular, static lists.

## No component or end-to-end tests

The test suite (`npm test`, 12 tests) covers section lookup
(`src/config/sections.test.ts`) and locale-file shape
(`src/i18n/locales.test.ts`) only. Nothing exercises component rendering,
user interaction, or the app end to end. Everything else is checked by
`tsc` (`npm run typecheck` and the type-check step in `npm run build`), by
the production build succeeding, and by hand in a browser.

## Placeholder link destinations

The Links section's `href` values point at real site roots rather than a
real person's profile: `https://github.com/`, `https://www.linkedin.com/`,
`https://mastodon.social/`, and a `mailto:hello@example.com` that nobody
reads. These are meant to be replaced — see `docs/NEXT-STEPS.md`.

## The repository and hosting are to be owned by `brunoccst`, not the recipient

The repository has no remote yet and the site is not deployed. Once
published, both the GitHub repository and the Netlify project are to be
created under the `brunoccst` account/team, because the recipient's GitHub
account did not exist when the site was built, and transferred to him
later. `docs/DECISIONS.md` explains why, and `docs/NEXT-STEPS.md` lists the
transfer steps.

## The favicon is a placeholder monogram

`public/favicon.svg` is a plain "NB" monogram on a flat dark background,
matched to the current placeholder styling rather than any chosen visual
identity. It is meant to be replaced alongside the rest of the visual style.

# Known issues

## Personal data is deliberately absent

Home address, phone number, personal email address, date and place of birth,
nationality and school grades are not published, and should not be added
without asking Nick first. If a contact route is wanted, prefer a form over an
address in the markup.

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

## The Links section has a single entry

Links lists only LinkedIn. There is no GitHub, Mastodon or email entry,
because no other public profile was available. Adding one is a locale-file
edit; adding an email address is not — see below.

## The repository and hosting are owned by `brunoccst`

The GitHub repository `brunoccst/nick-baumann-personal-site` and the Netlify
project `nick-baumann` both live under the `brunoccst` account and team,
because Nick's GitHub account did not exist when the site was built. Both
still need transferring. `docs/NEXT-STEPS.md` lists the steps.

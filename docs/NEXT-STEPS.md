# Next steps

Roughly in the order they would naturally happen.

1. **Choose the visual style, then rewrite `src/styles/_tokens.scss` and the
   component stylesheets.** Class names and DOM structure stay stable — see
   the restyle contract in `docs/DECISIONS.md`. Decide at this point whether
   Material UI stays for the two icon buttons in `SystemControls`, or is
   replaced with hand-rolled buttons; either is reasonable.

2. **Replace the Lorem Ipsum in `en.json` and `de.json`**, and the
   placeholder `href` values in the Links section, with the recipient's own
   words and real profile links. The README's "Translations" section lists
   exactly which keys are body copy and which are interface text.

3. **Replace the favicon (`personal-site.web/public/favicon.svg`) and the
   `<meta name="description">` in `personal-site.web/index.html`** once a
   visual style and real copy exist to describe.

4. **Transfer the GitHub repository** to the recipient's account once it
   exists. A transfer preserves history, issues and stars.

5. **Transfer the Netlify project**, or have the recipient link their own
   Netlify account to the repository and point a custom domain at it.

6. **Optional: add a GitHub Actions workflow** running `npm ci`,
   `npm run typecheck`, `npm test` and `npm run build` on pull requests, if a
   status check independent of Netlify's deploy previews is wanted. Not done
   now because Netlify's previews already build and type-check every pull
   request — see `docs/DECISIONS.md`.

7. **Extend the locale shape test to assert required fields**, not just
   matching shapes between `en.json` and `de.json`. Today,
   `src/i18n/locales.test.ts` catches one locale drifting from the other but
   not a field removed from both at once, which currently throws at render —
   see `docs/KNOWN-ISSUES.md`. Adding an assertion that each section's
   required fields (`period`, `role`, `summary`, `stack`, and so on) are
   present would catch that case before it reaches a browser.

8. **Two helpers were left out of this build because nothing here calls
   them**, and can be lifted back from `brunoccst/personal-site` if a
   restyle needs them:
   - `indexOfSection` in `config/sections.ts`, for previous/next section
     navigation.
   - The `usePrefersReducedMotion` hook, for motion driven from JavaScript
     rather than CSS. The current baseline only ever animates through CSS
     transitions, which the `motion-reduce` block in `global.scss` already
     disables.

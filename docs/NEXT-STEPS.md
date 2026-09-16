# Next steps

Roughly in the order they would naturally happen.

1. **Add further links** in `en.json` and `de.json` if other public profiles
   appear. Do not add a personal email address, phone number or home address —
   see `docs/KNOWN-ISSUES.md` for why.

2. **Decide whether Material UI stays.** It serves only the two icon buttons
   in `SystemControls`, and `createAppTheme.ts` already overrides its styling
   by hand. Hand-rolled buttons would drop `@mui/*` and both `@emotion/*`
   packages.

3. **Transfer the GitHub repository** to Nick's account once it exists. A transfer preserves history, issues and stars.

4. **Transfer the Netlify project**, or have Nick link his own
   Netlify account to the repository and point a custom domain at it. A domain
   carrying the name outranks a hosting subdomain for a search on that name —
   see the "Search engines" section of `README.md`. Setting `VITE_SITE_URL` in
   the Netlify project is the only code-side change a new domain needs.

5. **Verify the site in Google Search Console and submit the sitemap**, at
   `https://<domain>/sitemap.xml`. Nothing in the repository can do this; it
   needs Nick's Google account. Add the site's URL to the LinkedIn profile's
   website field at the same time, so the `sameAs` link in the site's
   structured data points both ways.

6. **Serve the German copy at its own URLs.** The language is chosen in the
   browser today, so every static file `plugins/seo.ts` writes is English, and
   a German search sees an English title and description. Routing German under
   a `/de/` prefix — one more pass in the plugin, and `hreflang` tags pairing
   the two — is what would fix that. It is the largest remaining piece of the
   search work, and matters most for queries like
   "Mechatroniktechniker Landsberg am Lech".

7. **Optional: add a GitHub Actions workflow** running `npm ci`,
   `npm run typecheck`, `npm test` and `npm run build` on pull requests, if a
   status check independent of Netlify's deploy previews is wanted. Not done
   now because Netlify's previews already build and type-check every pull
   request — see `docs/DECISIONS.md`.

8. **Extend the locale shape test to assert required fields**, not just
   matching shapes between `en.json` and `de.json`. Today,
   `src/i18n/locales.test.ts` catches one locale drifting from the other but
   not a field removed from both at once, which currently throws at render —
   see `docs/KNOWN-ISSUES.md`. Adding an assertion that each section's
   required fields (`period`, `role`, `summary`, `stack`, and so on) are
   present would catch that case before it reaches a browser.

9. **Two helpers were left out of this build because nothing here calls
   them**, and can be lifted back from `brunoccst/personal-site` if a
   restyle needs them:
   - `indexOfSection` in `config/sections.ts`, for previous/next section
     navigation.
   - The `usePrefersReducedMotion` hook, for motion driven from JavaScript
     rather than CSS. The current baseline only ever animates through CSS
     transitions, which the `motion-reduce` block in `global.scss` already
     disables.

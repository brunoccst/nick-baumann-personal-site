# Decisions

This records why the project is built the way it is, not what the code does.
Read `README.md` for that.

## Why the styling is a technical drawing

The subject is mechatronics, so the page is presented as an engineering
drawing: an exploded assembly — rotor, bearings, gear train, belt drive,
encoder, control board — behind a light blueprint-blue theme and a black one.

It is inline SVG rather than an image file for three reasons. Strokes read
`--color-blueprint-line`, so one drawing serves both themes instead of two
exported assets drifting apart. It scales without resampling, which matters
for hairlines. And it costs no extra request.

Gear teeth, windings and encoder slots are dashed strokes on circles, not
individually placed segments: one attribute where dozens of hand-placed lines
would otherwise need to stay evenly spaced by hand.

The drawing is decorative, so it is `aria-hidden` and carries no text. It
fades out on narrow viewports, where the text column has nowhere to sit that
is clear of it.

**The styling contract still holds:** class names and DOM structure are
stable, and every value in `_tokens.scss` and every rule in a `*.module.scss`
file is replaceable without touching a component or disturbing the router,
the translations or the accessibility behaviour.

## The favicon

`public/favicon.svg` is an "NB" monogram drawn to match a supplied reference:
monoline strokes with rounded caps, a stem shared between the two letters, and
the doubled diagonals and doubled bowls that give the mark its character. It is
drawn with the same eight `<path>` elements the reference implies rather than
traced, so the geometry is editable.

It uses the site's own colours — `#a5dbfa` on `#08304d`, 9.16:1 — rather than
the reference's dark-blue-on-paper, and the background is a full-bleed square
because the rest of the design has no border radii.

The doubled strokes are the point of the mark, so they were kept even though
they crowd at 16px. It reads cleanly from 24px up, which covers every browser
tab on a modern display; a simplified single-stroke variant would be the
answer if 16px legibility ever matters more than fidelity.

## Why the architecture came from `brunoccst/personal-site`

`brunoccst/personal-site` is a proven arrangement for exactly this kind of
site: a small set of routed sections, a theme toggle, a language toggle, and
a config-driven navigation list. Reusing it meant the effort that went into
this project went entirely into the part that was actually undecided — the
look — instead of re-solving routing and i18n from scratch.

The reuse is architectural, not literal. This app has no intro animation, no
frame, and no side or scroll-driven navigation — none of those exist in the
reference project's newer form, and none were carried over here. `Nav`
replaces the reference project's `SideNav`, renamed because it no longer
promises a side; `ContentPanel` and `Intro` have no counterpart at all.

## Why Material UI is here

MUI serves two things: the icon buttons in `SystemControls` and their
tooltips. It pulls in `@mui/material`, `@mui/icons-material`, and by
extension `@emotion/react` and `@emotion/styled` for a total of two visible
controls. It was kept for parity with `brunoccst/personal-site`, which uses
it the same way.

This is an honest trade, not a settled one. A future restyle has to override
MUI's own styling for those two buttons — `createAppTheme.ts` already does
this by hand, reading the CSS custom properties and setting
`styleOverrides` on `MuiIconButton` and `MuiTooltip`, including a
`sizeSmall` override needed only because MUI's own rule would otherwise win
on specificity. Dropping MUI for two hand-rolled `<button>` elements remains
a reasonable option, and would remove `@emotion/react` and
`@emotion/styled` as well.

## What is deliberately not published

Home address, phone number, personal email address, date and place of birth,
nationality, and school grades are all absent, and none should be added
without asking Nick first.

A personal site reaches a wider audience than a job application, and contact
details on a public page invite scraping. If a contact route is wanted later,
a form is preferable to an address in the markup.

## Why German terms are kept in the English locale

Job titles and qualifications like *Monteur*, *Ausbildung zum Mechatroniker*
and *staatlich geprüfter Mechatroniktechniker* name specific German
credentials. Translating them outright would misstate a qualification a German
employer recognises; leaving them bare would strand an English reader.

So the English locale keeps the German term, italicises it, and follows it
with a gloss. The markup lives in the components, not the JSON: a term is
wrapped in asterisks in the locale file, and `i18n/emphasis.ts` splits on
those so `EmphasisedText` can render `<em lang="de">`. The `lang` attribute
also gets the pronunciation right in a screen reader.

Institution, company and place names are left alone — "Technikerschule
Augsburg" is a proper noun, not a term to translate.

## Why the `localStorage` keys are `nick-baumann-site.*`

`brunoccst/personal-site` stores its theme and language under
`personal-site.*` keys. Both projects' dev servers default to
`http://localhost:5173` — the same origin, and therefore the same
`localStorage`. If this project used the same key names, running both dev
servers during development would let each site silently overwrite the
other's saved theme and language. Prefixing this project's keys with
`nick-baumann-site.` keeps the two independent even when they share an
origin.

## Why there is no CI

The Netlify project is linked to this repository, so its deploy previews
build and type-check every pull request against `netlify.toml`'s build
command. A separate GitHub Actions workflow running the same `npm run build`
would duplicate a check that already exists and already gates merges.
`docs/NEXT-STEPS.md` lists adding one anyway as an optional step, for a
status check independent of Netlify.

## Why the repository is under `brunoccst`

The GitHub account `nick-baumann` did not exist when this site was built, so
the repository was created under `brunoccst` and is meant to
be transferred once that account exists. A GitHub transfer preserves commit
history, issues and stars, which recreating the repository under a new
account would not.

## Contrast ratios

Measured against each theme's background colour. All figures clear WCAG AA
for body text (4.5:1 for normal text, 3:1 for large text and UI components).

Each background is a radial gradient. The ratios below use `--color-bg`, its
**lightest** stop, because that is the worst case for text sitting on it; over
`--color-bg-edge` every figure improves.

**Light theme, on `--color-bg` `#145b8a`:**

| Token | Value | Ratio |
| --- | --- | --- |
| `--color-text` | `#f2f8fc` | 6.78:1 |
| `--color-text-muted` | `#cfe3f2` | 5.50:1 |
| `--color-accent` | `#a5dbfa` | 4.88:1 |

**Dark theme, on `--color-bg` `#0a1016`:**

| Token | Value | Ratio |
| --- | --- | --- |
| `--color-text` | `#ededed` | 16.33:1 |
| `--color-text-muted` | `#a3a3a3` | 7.58:1 |
| `--color-accent` | `#7aa2d6` | 7.25:1 |

`--color-accent` is link hover text as well as the focus ring, so it is held
to 4.5:1 rather than the 3:1 a non-text control would need. That is what ruled
out the more saturated blues first tried against the blueprint background.

## Why the section lists are keyed by array index

`AboutSection`, `TimelineSection` and `LinksSection` all key their
`.map()`-rendered list items by array index rather than by a value derived
from the item's content. A key derived from content — a paragraph's text, a
link's label — collides as soon as two items share the value it is derived
from, and a duplicate React key is a silent rendering bug rather than an
error.

Index keys are safe here because none of the conditions that make them risky
apply to these lists:

- The lists are static and ordered — nothing reorders, filters, inserts into,
  or removes from them at runtime.
- No list item carries per-item component state that would need to survive
  a reorder.
- The only time a list changes wholesale is a language switch, where an
  index key is exactly what lets React update each item's text in place
  instead of remounting it.

An index key is also simpler than deriving a stable key from content that is
expected to be edited.

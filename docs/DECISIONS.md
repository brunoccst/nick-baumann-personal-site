# Decisions

This records why the project is built the way it is, not what the code does.
Read `README.md` for that.

## Why the visual layer is empty

The visual style had not been chosen when this site was built. Rather than
guess at colours, type and layout ornament and have someone undo that work
later, the structural layer — routing, theming, translations, accessibility —
was finished on its own, and the visual layer was left as a neutral
placeholder: `src/styles/_tokens.scss` and the component `*.module.scss`
files.

The restyle contract is deliberately narrow: **class names and DOM structure
are stable; every value in `_tokens.scss` and every rule in a `*.module.scss`
file is replaceable.** Whoever picks the style later can rewrite colours,
type, spacing and motion without touching a component, and without the
router, the translations or the accessibility behaviour moving underneath
them.

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

## Why the copy is Lorem Ipsum

The site is a gift. The recipient — Nick — writes the words that describe
his own work and experience; nobody else can write them for him. Lorem
Ipsum holds each section at a realistic size (four About paragraphs, three
Experience entries with eight stack tags each, four Links) so the layout is
tuned to content of the right shape and length, not to text that will never
exist.

The split between placeholder and real text follows one rule: **Lorem Ipsum
stands in for body copy; interface text is real**, because Lorem Ipsum would
break interface text rather than stand in for it. A navigation item labelled
"Lorem" cannot be navigated, and a screen reader announcing "Ipsum section"
tells its listener nothing.

Lorem Ipsum: the About paragraphs, the Experience summaries and stack tags,
the link descriptions, the section kickers, `identity.role`, and
`footer.note`.

Real: the navigation labels, the control labels and accessibility strings,
the section titles, the link labels (`GitHub`, `LinkedIn`, and so on),
`identity.name` ("Nick Baumann"), the link `href` values, and each locale's
`meta.htmlLang` and `meta.nativeName`.

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

Netlify's deploy previews already build and type-check every pull request
against `netlify.toml`'s build command, so a separate GitHub Actions
workflow running the same `npm run build` would duplicate a check that
already exists and already gates merges. `docs/NEXT-STEPS.md` lists adding
one anyway as an optional step, for a status check independent of Netlify.

## Why the repository is under `brunoccst`

The GitHub account `nick-baumann` did not exist when this site was built, so
the repository was created under the author's own account and is meant to
be transferred once that account exists. A GitHub transfer preserves commit
history, issues and stars, which recreating the repository under a new
account would not.

## Contrast ratios

Measured against each theme's background colour. All figures clear WCAG AA
for body text (4.5:1 for normal text, 3:1 for large text and UI components).

**Light theme, on `--color-bg` `#ffffff`:**

| Token | Value | Ratio |
| --- | --- | --- |
| `--color-text` | `#1a1a1a` | 17.40:1 |
| `--color-text-muted` | `#595959` | 7.00:1 |
| `--color-accent` | `#2c5aa0` | 6.82:1 |

**Dark theme, on `--color-bg` `#121212`:**

| Token | Value | Ratio |
| --- | --- | --- |
| `--color-text` | `#ededed` | 16.00:1 |
| `--color-text-muted` | `#a3a3a3` | 7.43:1 |
| `--color-accent` | `#7aa2d6` | 7.11:1 |

## Why the section lists are keyed by array index

`AboutSection`, `ExperienceSection` and `LinksSection` all key their
`.map()`-rendered list items by array index rather than by a value derived
from the item's content. A key derived from content — a paragraph's text, a
link's label — collides the moment that content is edited to match another
item, which is the one thing this repository exists to have happen to its
placeholder copy.

Index keys are safe here because none of the conditions that make them risky
apply to these lists:

- The lists are static and ordered — nothing reorders, filters, inserts into,
  or removes from them at runtime.
- No list item carries per-item component state that would need to survive
  a reorder.
- The only time a list changes wholesale is a language switch, where an
  index key is exactly what lets React update each item's text in place
  instead of remounting it.

An index key is also simpler than deriving a stable key from content that a
gift recipient is expected to rewrite.

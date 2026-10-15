# Rescoldo — Design Context

The design brief for Rescoldo. **Start with "Current design"**; everything under "Design log" is the history of how it got there, kept as written at the time.

## What the app is

A private BBQ cook journal. Log a cook (meat, cooker, cook time, temperature, smoked or not, wood, a 1–5 result, recipe, tips), browse and search past ones. A personal tool, not a product: the tone should stay handmade and specific to how you actually cook, not generic app-template.

## How it was designed

The whole interface was designed in Paper Pro and implemented as hand-written CSS. The direction is a humble homage to Otl Aicher: simplicity, usability above all, minimalistic, no frills.

---

# Current design

*Source: the Aicher / ERCO light direction, developed on the `aicher-redesign` branch and now merged into `main`.*

## Principles

- Light only. No dark mode.
- One accent color, used sparingly. Restraint is deliberate.
- Flat: no radius, no shadows, no cards. Structure comes from hairlines and one heavy rule.
- Usability first. Where a rule conflicts with usability (for example, a destructive action benefiting from a warning color), usability wins.

## Palette

| Token | Hex | Use |
|---|---|---|
| Ground | `#efefef` | Page background (Weiß from the reference palette) |
| Ink | `#0a0b0b` | Text, rules, filled elements (Schwarz) |
| Hairline | `#9ba595` | Borders and dividers (Grau) |
| Faint rule | `#d5d8d2` | Lightest separators |
| Muted | `#61675e` | Secondary text |
| Accent (Vlau-dark) | `#586a76` | Selected states, filled result squares, active nav dash |
| Danger | `#864036` | Outline only: delete, replace all |

Why two tones of Vlau: the sourced Vlau (`#758d9e`) is too light for text (about 3:1 on paper). Anything carrying legible text uses the darkened `#586a76`, which clears 4.5:1. Muted `#61675e` exists for the same reason: Grau itself fails as text (about 2.2:1), so it is reserved for borders and fills.

Teal `#435C56`, yellow `#E6CC6E` and greige `#A38F63` from the reference palette are recorded in the log but unused, to keep to "the one accent".

## Typography

Helvetica Neue bold and regular (falling back to Helvetica, Arial). Flush-left, lowercase headings. No serif. Univers and Frutiger remain mood references only, since they are commercial typefaces and would need licensed files.

## Layout and components

- 3px ink rule under the brand row; 1px hairlines elsewhere.
- **Result** is five squares (not stars), filled with the accent.
- **Archive** opens pre-filtered to the enabled cooker with the most cooks (ties alphabetical), with an "all cookers" option. The cooker is shown on each row only when viewing all.
- **New cook:** up to two enabled cookers render as buttons, three or more as a select. Smoked is a No/Yes toggle. The save bar is pinned above the nav.
- **Cook detail** is a full-screen view with pinned edit and delete. "Smoked" appears only for smoked cooks. The hand-test temperature reads `High <5s · 220°C`.
- **Bottom nav:** three equal cells, centered labels, a 2px dash under the active label, and "new cook" as a solid ink block.
- **Pictogram:** a single-color bull head with crossed trinche and facón, drawn in ink, shown beside the title in the header (inline SVG using `currentColor`).

## Constraints

- **No build step, no bundler.** Plain HTML, CSS and JS. Hand-written CSS only; custom properties are fine.
- **No reliable network for new dependencies.** Prefer system fonts, inline SVG and CSS-drawn shapes over CDNs, icon fonts or component libraries.
- **Mobile-first, single column.** Anything new has to work on a small phone first.
- **Respect `env(safe-area-inset-bottom)`.** The bottom nav and sheets account for the iPhone home indicator.

## Where the design lives

| Surface | Files | Notes |
|---|---|---|
| Mobile (PWA) | `mobile/index.html`, `mobile/styles.css` | Single column, bottom nav |
| Android (Capacitor) | `www/` and `android/` | `www/` is a synced copy of `mobile/`. Never edit it directly; `npm run android:sync` overwrites it |
| Pictogram | `pictogram/asado_pictogram_vector.svg` | Master vector; all icons are derived from it |
| Icons | `mobile/icons/`, `android/app/src/main/res/` | PWA, iOS and Android launcher icons (see the icon entry in the log) |

---

# Design log

*History, in the order it happened. Written at the time, so earlier entries describe states that have since been replaced. Where that matters, the heading says so.*

## Design direction (September 2026)

**Mood / references:**

A humble homage to Otl Aicher: simplicity, usability above all, minimalistic, no frills. References:
- https://www.otlaicher.de/en/
- https://www.itsnicethat.com/features/otl-aicher-design-type-thinking-graphic-design-270622
- https://www.otlaicher.de/en/articles/butterflies-nasturtiums-roses-and-chromatic-greys/
- https://www.arquitecturaydiseno.es/mobiliario/por-que-tienes-que-conocer-a-otl-aicher_3096
- https://www.otlaicher.de/en/articles/the-rainbow-games/

*Researched context (from the articles above):* Aicher (Ulm School / HfG Ulm) is best known for the Lufthansa identity, the 1972 Munich Olympics identity, ERCO's lighting-company identity, and, late in his career, the Rotis typeface. His color thinking wasn't decorative, it was systematic and named:
- **Greige**: a grey/beige family he graded in named steps, from "light shell greige" through "chalk", "smoky", "sand", "clay" and "nut" to "dark ore greige".
- **Vlau**: a violet-grey he invented for ERCO's identity, described as a shift "from feeling to thinking". Used as a quiet accent inside an otherwise very restrained, neutral, grey-dominated system, so as not to distract from ERCO's actual product (light).
- **The 1972 Munich Olympics palette**: light/"apolitical" blue as the primary color, plus silver, white, green and orange, all landscape-derived. Red, black, gold and purple were deliberately excluded (associations with the 1936 Berlin Games). Later in the project this loosened into the brighter, multicolored "Rainbow Games" look, a deliberate expression of openness, not just decoration.
- **Method**: Aicher treated color as empirical craft (huge collections of printed color papers, organized by hue and saturation, influenced by Josef Albers at the Bauhaus), and let a project's context dictate the palette rather than applying a fixed formula.

**Starting palette proposal (draft, since superseded by the sourced palette below):** an ERCO-restraint-style system (mostly neutral greige/grey, Vlau as the one accent) rather than the Olympic multicolor approach, since it fits "minimalistic, no frills" better than the Rainbow Games look.

| Role | Hex (draft) | Note |
|---|---|---|
| Paper (base bg) | `#f4f2ee` | cooler/more neutral than the app's then-current warm cream |
| Ink (text) | `#1c1b19` | near-black, slightly warm |
| Greige — light | `#dcd7cc` | borders, dividers |
| Greige — mid | `#a39a89` | secondary text, muted UI |
| Greige — dark | `#5c564a` | stronger secondary, icons |
| Vlau (accent) | `#6f6478` | the one accent color |

**Typography options considered:**

Univers, Helvetica, Frutiger: all real Aicher-era grotesque/humanist sans faces (Univers was the official Lufthansa/Olympics typeface; Rotis came later, in 1988, when he moved toward something warmer than strict grotesque purism). Univers, Helvetica and Frutiger are commercial typefaces: not on Google Fonts, can't be pulled from a CDN. Two honest paths were identified:
1. **Helvetica Neue** is a real system font already on Mac and iPhone, so using it costs nothing and needs no network.
2. **Univers / Frutiger** aren't preinstalled; using the real thing means self-hosting licensed font files. Otherwise an open alternative with similar character (e.g. Archivo, Work Sans) as a stand-in.

**Decisions (September 2026):** Helvetica Neue only for now (Univers/Frutiger stay mood reference unless licensed files turn up later); restrained palette with Vlau as the one accent; mobile/Android only this round (the desktop app has since been removed entirely, 2026-09-16).

## Reference palette (sourced from the image, September 2026)

Extracted directly from the reference image (https://m.itsnicethat.com/original_images/otl-aicher-design-type-thinking-graphic-design-itsnicethat-01.jpg), so actual values rather than approximations:

| Name | Hex | Role in the swatch |
|---|---|---|
| Schwarz (Black 56921) | `#0A0B0B` | neutral |
| Grau (ERCO Grau T 33209, sage-tinted technical grey) | `#9BA595` | neutral |
| Weiß | `#EFEFEF` | neutral |
| Deep Teal / Slate Green | `#435C56` | accent/identity |
| **Vlau** (signature muted slate/violet-blue) | `#758D9E` | accent/identity |
| Bright Yellow | `#E6CC6E` | accent/identity |
| Greige (ERCO Hellbraun M 32512) | `#A38F63` | accent/identity |

Given the "restrained, Vlau as the one accent" direction, only the three neutrals plus Vlau were wired into the CSS. Teal, yellow and greige are recorded for later, so the palette stays true to "the one accent" and doesn't become a Rainbow-Games multi-color system.

## First design pass (mobile/Android), superseded by the current design

*Describes the first implementation of the sourced palette. Stars, rounded corners and the status dot mentioned here were later replaced or removed; see "Current design".*

Shipped in `mobile/styles.css`:

```
--ink: #0a0b0b          Schwarz, exact: primary text
--paper: #efefef        Weiß, exact: page background (flat, no gradient)
--surface: #ffffff      cards, inputs, sheets (a touch brighter than paper, for lift)
--line: #9ba595         Grau, exact: borders, dividers, secondary-button/badge fill
--muted: #61675e        Grau darkened ~40% toward Schwarz: secondary text (Grau itself
                         fails contrast as text, ~2.2:1, so it's reserved for fills/borders)
--vlau: #758d9e         Vlau, exact: decorative-only (status dot, focus glow)
--vlau-dark: #586a76    Vlau darkened ~25% toward black: every interactive filled/active
                         state that carries text
--danger: #864036       delete button, outline style (border + text, white fill)
--shadow: rgba(10, 11, 11, 0.08)
```

**Two-tier accent rule, and why:** the sourced Vlau is fairly light: as text on paper it's only 3.0:1, and white text on it is only 3.5:1, both below the 4.5:1 bar real text needs. Rather than quietly ship low-contrast text, anything with legible text on or in it uses the darkened `--vlau-dark`, which clears 4.5:1 everywhere it's used. Plain `--vlau` is reserved for spots with no text riding on it.

**Idle vs. active state pattern:** idle = outlined surface with muted text/icon, active = filled `--vlau-dark` with white text/icon. This replaced an earlier draft where the unselected star icon was white-on-Grau, which measured 2.6:1 and would have been nearly invisible, caught by the same contrast check and fixed before shipping.

**Verification:** every text/icon/background pair used in the stylesheet was run through a WCAG contrast script (4.5:1 for real text, 3:1 for icons and large UI), full pass. HTML/CSS syntax checked.

**Colors left unused:** teal, yellow and greige. Worth revisiting if a future need (a distinct "smoked" indicator, a wood-tone touch) calls for a second accent.

## First visual language, before the Aicher palette (superseded)

*The look the app had before any of the above. Kept for the record.*

- Colors: `--ink:#17231f` `--muted:#6e766f` `--paper:#f7f3eb` `--surface:#fffdf8` `--line:#dedbd1` `--pine:#14251f` `--ember:#d45e36` `--ember-dark:#a94327` `--sage:#c8d4c2` `--danger:#a33b31`
- Headings in Georgia serif for a "journal" feel; body in "Avenir Next", "Trebuchet MS", sans-serif
- Radius scale from 0.65rem (chips/buttons) to 1.25rem (modal sheet)
- Background: a diagonal gradient, sage-green into cream into warm peach
- Components: entry cards with shadow, five stars filled cumulatively (reverse-DOM-order + `flex-direction: row-reverse`), segmented toggle for temperature mode and °C/°F, 2×2 hand-test level chips showing a seconds hint, bottom-sheet modals, fixed bottom nav with safe-area padding

## App icon / favicon (September 2026)

The pictogram, `pictogram/asado_pictogram_vector.svg`, is a bull head with a crossed fork and knife, a single-color silhouette on a transparent background.

**Palette applied:** the mark is recolored to the exact ink (`#0a0b0b`) so it is drawn in the same ink as the rest of the app. For rasterized icon files (favicon, home-screen icons) a solid ground-color (`#efefef`) background is baked in rather than left transparent: transparent PWA/home-screen icons render inconsistently (iOS fills transparency with black), and a deliberate paper-colored square reads as a considered, branded icon. The master SVG itself stays transparent.

Generated with headless Chromium (rendered large, downsampled with Lanczos; direct small-viewport rendering proved unreliable, caught by checking each output's content bounding box before shipping):
- `favicon-32.png`, `favicon-16.png`: browser tab and bookmark
- `icon-192.png`, `icon-512.png`: PWA manifest, `purpose: "any"`, mark at 78% with padding
- `icon-512-maskable.png`: PWA manifest, `purpose: "maskable"`, mark at 58% so it survives Android's circular safe-zone crop
- `apple-touch-icon.png` (180×180): iOS home screen, opaque background (iOS renders transparency as black)

**Android native launcher icon:** generated directly (without the `@capacitor/assets` CLI) with the same render-then-downscale technique:
- **Adaptive foreground** (`ic_launcher_foreground.png`, five densities, 108–432px): the ink mark alone on transparency at about 58% scale, so it clears the safe zone under any launcher mask (circle, squircle, rounded square, all previewed).
- **Adaptive background:** `ic_launcher_background.xml` set to the ground color `#EFEFEF`, composited by Android at render time.
- **Legacy icons** (`ic_launcher.png`, `ic_launcher_round.png`): ground color baked in, square at about 78% scale, round at about 58% since the OS circle-crops it.

Old unused Android Studio template resources were left in place; neither is referenced by the manifest or adaptive-icon XML.

## Pictogram in the app header (September 2026)

The pictogram was added inline in the header beside the title (chosen over replacing the wordmark). Inlined as SVG rather than `<img>` so it scales at any size and follows `currentColor`, inheriting the ink token if the palette ever changes.

**Follow-up:** the mark was first centered against the whole brand block, including the stacked eyebrow line, so it read as sitting above the title's center. Fixed by restructuring the markup so the eyebrow sits above, and a separate flex row contains only the mark and the `<h1>`, with `align-items: center`. Verified by rendering the real files in headless Chromium at a 420px viewport.

## Open questions (as of the first redesign pass)

- Do you own licensed files for Univers and/or Frutiger, or should those stay long-term mood reference?
- Now that Vlau's real value is a cooler blue-grey (not the more violet tone the text research suggested), does the restrained direction still feel right on the phone, or does it read as too cool or technical for a personal cook journal?

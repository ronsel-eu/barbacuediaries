# Barbacue Diaries — Design Context

A living brief: the top half is what's actually true about the app's design today (so nothing has to be rediscovered later); the bottom half is blank for your own direction, references, and priorities. Edit this file directly — nothing here is generated automatically, so it'll only stay accurate if it's kept up to date by hand.

## What the app is

A private BBQ cook journal. Log a cook (meat, cooker, cook time, temperature, smoked or not, wood, a 1–5 result, recipe, tips), browse/search past ones. Personal tool, not a product — the tone should stay handmade and specific to how you actually cook, not generic app-template.

## Where the design lives

Three surfaces, three separate stylesheets — there's no shared design-system file yet:

| Surface | Files | Notes |
|---|---|---|
| Desktop (Electron) | `src/renderer/index.html`, `src/renderer/styles.css` | Three-column card layout, no bottom nav |
| Mobile (PWA) | `mobile/index.html`, `mobile/styles.css` | Single column, bottom nav, bottom-sheet modals |
| Android (Capacitor) | `www/` | A synced *copy* of `mobile/` — never edit `www/` directly, it gets overwritten by `npm run mobile:copy` |

## Current visual language

**Desktop** (`src/renderer/styles.css`):
- Colors: `--bg:#f4efe6` `--surface:#fff9f0` `--ink:#1e1e1e` `--muted:#5c554d` `--brand:#b54225` `--brand-dark:#8f3019` `--line:#d7cdbf`
- Body font: "Avenir Next", "Segoe UI", sans-serif. No serif anywhere — headings just scale up the body font.
- Radius scale: 10px (inputs/buttons) → 16px (cards/modal)
- Background: a soft radial gradient from peach into the base cream

**Mobile** (`mobile/styles.css`):
- Colors: `--ink:#17231f` `--muted:#6e766f` `--paper:#f7f3eb` `--surface:#fffdf8` `--line:#dedbd1` `--pine:#14251f` `--ember:#d45e36` `--ember-dark:#a94327` `--sage:#c8d4c2` `--danger:#a33b31`
- Headings: Georgia serif (`h1`/`h2`/`h3`), giving it a "journal" feel; body text is "Avenir Next", "Trebuchet MS", sans-serif
- Radius scale: 0.65rem (chips/buttons) → 1.25rem (modal sheet, top corners only — it slides up from the bottom)
- Background: a diagonal gradient, sage-green into cream into warm peach
- Bottom nav is fixed on mobile widths, becomes a static bar above 700px

**They're not the same palette.** Both are warm/terracotta-on-cream, but desktop's ember is `#b54225`, mobile's is `#d45e36`, and mobile has a pine-green + sage accent pair that desktop doesn't use at all. Nobody's unified these on purpose — it happened because the two were built at different times.

## Component inventory

- **Entry list item** — desktop: bordered list row, plain text meta line. Mobile: card with shadow, meat name in serif, a `·`-separated meta line (cooker · time · temp · wood), a rating in the corner, optional tip preview.
- **Star rating** — 5 radio inputs styled as stars, reverse-DOM-order + `flex-direction: row-reverse` CSS trick so N stars fill cumulatively. Desktop already had this right; mobile's version was fixed this session (previously only the single selected star lit up).
- **Segmented toggle** (`mobile/styles.css` `.segmented`/`.mode-button`) — used for temperature mode (Degrees/Hand test) and the °C/°F setting. Desktop has no equivalent component.
- **Level-rating chips** (mobile only) — 2×2 grid of hand-test heat levels (High/Medium/Medium-low/Low), each showing a seconds hint.
- **Modal** — desktop: centered dialog. Mobile: bottom sheet that slides up, rounded top corners only.
- **Bottom nav** (mobile/Android only) — Archive / + New cook / Settings, fixed to viewport bottom with safe-area padding for the home indicator.

## Known gaps

- **No app icon.** `mobile/manifest.webmanifest` has `"icons": []` — the installed PWA/Android icon is whatever the OS falls back to.
- **No dark mode.** Both stylesheets are a single fixed light palette; `prefers-color-scheme` isn't handled anywhere.
- **Desktop is visually behind** — still missing a delete button, and its filter UI doesn't expose fields the backend already supports (see `app-analysis.md` in the project for the full list — that's a functionality gap, not a design one, but it means the desktop UI has dead space where those controls could go).

## Constraints for any new direction

- **No build step, no bundler.** Both apps are plain HTML/CSS/JS loaded directly — no Sass, no PostCSS, no Tailwind. Whatever the design becomes, it has to be hand-written CSS (custom properties are fine and already used).
- **No reliable network for new dependencies.** Pulling in an icon font, a webfont from a CDN, or a component library isn't safe to assume will work in every environment this gets built/tested in — prefer system fonts, inline SVG, or CSS-drawn shapes over external assets.
- **Mobile-first, single column.** The phone is the primary surface now; anything explored for mobile should work down to a small phone width first.
- **Respect `env(safe-area-inset-bottom)`** on mobile — the bottom nav and modal sheets already account for the iPhone home indicator; a redesign shouldn't lose that.

---

## David's design direction

**Mood / references:**

A humble homage to Otl Aicher — simplicity, usability above all, minimalistic, no frills. References:
- https://www.otlaicher.de/en/
- https://www.itsnicethat.com/features/otl-aicher-design-type-thinking-graphic-design-270622
- https://www.otlaicher.de/en/articles/butterflies-nasturtiums-roses-and-chromatic-greys/
- https://www.arquitecturaydiseno.es/mobiliario/por-que-tienes-que-conocer-a-otl-aicher_3096
- https://www.otlaicher.de/en/articles/the-rainbow-games/

*Researched context (from the articles above), for whoever works on this next:* Aicher (Ulm School / HfG Ulm) is best known for the Lufthansa identity, the 1972 Munich Olympics identity, ERCO's lighting-company identity, and — late in his career — the Rotis typeface. His color thinking wasn't decorative, it was systematic and named:
- **Greige** — a grey/beige family he graded in named steps: "light shell greige" → "chalk greige" → "smoky greige" → "sand greige" → "clay greige" → "nut greige" → "dark ore greige."
- **Vlau** — a violet-grey he invented for ERCO's identity, described as a shift "from feeling to thinking." Used as a quiet accent inside an otherwise very restrained, neutral, grey-dominated system — restraint was deliberate, to avoid distracting from ERCO's actual product (light).
- **The 1972 Munich Olympics palette** — light/"apolitical" blue as the primary color, plus silver, white, green, and orange, all landscape-derived (the lake, alpine foothills, forests near Bad Tölz). Red, black, gold, and purple were deliberately excluded (associations with Nazi Germany / the 1936 Berlin Games). Later in the project this loosened into the brighter, more multicolored "Rainbow Games" look — a deliberate expression of openness and anti-authoritarianism, not just decoration.
- **Method** — Aicher treated color as empirical craft (he kept huge collections of printed color papers, organized by hue/saturation, influenced by Josef Albers at the Bauhaus), and let a project's *context* dictate the palette rather than applying a fixed formula.

**Colors:**

- Reference palette: https://m.itsnicethat.com/original_images/otl-aicher-design-type-thinking-graphic-design-itsnicethat-01.jpg (a swatch image — I wasn't able to pull exact values from it directly; worth eyeballing together against whatever we land on)
- Explore **Vlau** (the violet-grey above) as a main or secondary color.

*Starting proposal, not final* — an ERCO-restraint-style system (mostly neutral greige/grey, Vlau as the one accent) rather than the Olympic multicolor approach, since it fits "minimalistic, no frills" better than the Rainbow Games look:

| Role | Hex (draft) | Note |
|---|---|---|
| Paper (base bg) | `#f4f2ee` | cooler/more neutral than the app's current warm cream |
| Ink (text) | `#1c1b19` | near-black, slightly warm |
| Greige — light | `#dcd7cc` | borders, dividers |
| Greige — mid | `#a39a89` | secondary text, muted UI |
| Greige — dark | `#5c564a` | stronger secondary, icons |
| Vlau (accent) | `#6f6478` | the one accent color — CTAs, active states, rating fill |

These are my own approximation of Aicher's named concepts, not colors lifted pixel-for-pixel from the reference image — treat as a first draft to react to and refine, not a final answer.

**Typography:**

Explore Univers, Helvetica, Frutiger — all real Aicher-era grotesque/humanist sans faces (Univers was the official Lufthansa/Olympics typeface; Rotis came later, in 1988, when he moved toward something warmer than strict grotesque purism).

*Practical note:* Univers, Helvetica, and Frutiger are commercial typefaces — not on Google Fonts, can't be pulled from a CDN. Two honest paths:
1. **Helvetica Neue** is a real system font already on your Mac and iPhone — using it costs nothing and needs no network, it's just `font-family: "Helvetica Neue", Helvetica, Arial, sans-serif`.
2. **Univers / Frutiger** aren't preinstalled — using the real thing means self-hosting licensed font files you already own (drop them in the repo, I wire up `@font-face`, no CDN needed). Otherwise I'd suggest an open alternative with similar grotesque/humanist character (e.g. Archivo, Work Sans) as a stand-in.

**What's working / keep:**

**What's not working / change:**

**Decisions (September 2026):** Helvetica Neue only for now (Univers/Frutiger stay mood reference unless licensed files turn up later); restrained palette with Vlau as the one accent; mobile/Android only this round, desktop untouched.

## Reference palette (sourced from the image, September 2026)

David extracted these directly from the reference image — actual values now, not my earlier approximation:

| Name | Hex | Role in the swatch |
|---|---|---|
| Schwarz (Black 56921) | `#0A0B0B` | neutral |
| Grau (ERCO Grau T 33209 — sage-tinted technical grey) | `#9BA595` | neutral |
| Weiß | `#EFEFEF` | neutral |
| Deep Teal / Slate Green | `#435C56` | accent/identity |
| **Vlau** (signature muted slate/violet-blue) | `#758D9E` | accent/identity |
| Bright Yellow | `#E6CC6E` | accent/identity |
| Greige (ERCO Hellbraun M 32512) | `#A38F63` | accent/identity |

Given the "restrained, Vlau as the one accent" direction chosen earlier, only the three neutrals + Vlau are wired into the CSS below. Teal, Yellow, and Greige are recorded here for later — not used in this pass, so the palette stays true to "the one accent," not a Rainbow-Games multi-color system.

## Implemented — first redesign pass (mobile/Android)

Shipped in `mobile/styles.css` (synced to `www/`):

```
--ink: #0a0b0b          Schwarz, exact — primary text
--paper: #efefef        Weiß, exact — page background (flat, no gradient)
--surface: #ffffff      cards, inputs, sheets (a touch brighter than paper, for lift)
--line: #9ba595         Grau, exact — borders, dividers, secondary-button/badge fill
--muted: #61675e        Grau darkened ~40% toward Schwarz — secondary text (Grau itself
                         fails contrast as text, ~2.2:1, so it's reserved for fills/borders)
--vlau: #758d9e         Vlau, exact — decorative-only (status dot, focus glow)
--vlau-dark: #586a76    Vlau darkened ~25% toward black — every interactive filled/active
                         state that carries text: buttons, active nav/toggle, checked
                         star & heat-level chips, the read-only star-rating text, eyebrow labels
--danger: #864036       delete button — now an outline style (border + text, white fill)
                         rather than a filled pastel, since no color in the reference
                         palette reads as "danger" (consistent with Aicher deliberately
                         avoiding red/black-as-power in the Olympic identity) — this is
                         the one deliberate exception, kept because a destructive action
                         benefiting from a distinct warning color is a usability call,
                         and usability was stated as the top priority
--shadow: rgba(10, 11, 11, 0.08)
```

Typography unchanged from the previous pass: Helvetica Neue/Helvetica/Arial throughout, no serif.

**Two-tier accent rule, and why:** the sourced Vlau (`#758d9e`) is fairly light — as text on paper it's only 3.0:1, and white text on it is only 3.5:1, both below the 4.5:1 bar real text needs. Rather than quietly ship low-contrast text, anything with legible text on/in it (buttons, active toggle states, the level-rating chips' "High"/"Medium-low" labels, the read-only star-rating glyphs, eyebrow labels) uses the darkened `--vlau-dark`, which clears 4.5:1+ everywhere it's used. Plain `--vlau` is reserved for spots with no text riding on it — the small "saved on this phone" status dot and the input focus glow.

Idle vs. active state pattern, consistent across all rating/toggle controls now (stars, heat-level chips, mode toggle, secondary buttons): idle = outlined surface with muted text/icon, active = filled `--vlau-dark` with white text/icon. This replaced an earlier draft where the unselected star icon was white-on-Grau, which measured at 2.6:1 and would have been nearly invisible — caught by the same contrast check, fixed before shipping.

**Verification:** every text/icon/background pair actually used in the final stylesheet was run through a WCAG contrast script (4.5:1 for real text, 3:1 for icons/large UI) — full pass, including the fix above. HTML/CSS syntax checked (balanced tags, balanced braces). Not yet phone-tested.

**Not yet done:** phone-tested by David. Desktop's `src/renderer/styles.css` is untouched. Teal, Yellow, and Greige from the reference palette are recorded but unused — worth revisiting if a future need (e.g. a distinct "smoked" indicator, or a wood-tone touch somewhere) calls for a second accent.

**Open questions:**

- Do you own licensed files for Univers and/or Frutiger, or should those two stay long-term "mood reference"?
- Bring desktop in line with this palette, or leave it as-is for now?
- Now that Vlau's real value is a cooler blue-grey (not the more violet tone the text research suggested), does the restrained direction still feel right once you've seen it on the phone — or does it read as too cool/technical for a personal cook journal?

## App icon / favicon (September 2026)

David supplied `pictogram/asado_pictogram_vector.svg` — a bull-head + crossed fork/knife silhouette, transparent background, originally `fill="#111111"`.

**Palette applied:** yes — recolored the source SVG's fill to the exact `--ink` (`#0a0b0b`, Schwarz) so the mark itself is drawn in the same ink as the rest of the app, not just a close approximation. For the rasterized icon files specifically (favicon, home-screen icons), baked in a solid `--paper` (`#efefef`, Weiß) background rather than leaving them transparent — reasoning: transparent PWA/home-screen icons render inconsistently (iOS in particular fills transparency with black), and a deliberate paper-colored square reads as a considered, branded icon rather than a mark floating on whatever background happens to be behind it. The master SVG itself stays transparent-background as delivered — the paper fill is only added at export time for the specific files that need it.

Generated with headless Chromium (rendered large, downsampled with Lanczos resize — direct small-viewport rendering turned out unreliable, caught by checking each output's actual content bounding box before shipping):
- `mobile/icons/favicon-32.png`, `favicon-16.png` — browser tab / bookmark
- `mobile/icons/icon-192.png`, `icon-512.png` — PWA manifest, `purpose: "any"`, mark at 78% with padding
- `mobile/icons/icon-512-maskable.png` — PWA manifest, `purpose: "maskable"`, mark at 58% so it survives Android's circular safe-zone crop
- `mobile/icons/apple-touch-icon.png` (180×180) — iOS home screen, opaque background (no alpha, since iOS renders transparency as black)

Wired into `manifest.webmanifest`'s `icons` array and `index.html`'s `<head>` (favicon links + `apple-touch-icon`). Synced to `www/icons/`.

**Not done:** the actual Android *native app* launcher icon (what shows on the home screen for the compiled APK) is separate from these PWA/web icons — Capacitor generates it from density-specific mipmap resources under `android/app/src/main/res/`, normally via the `@capacitor/assets` CLI tool. Out of scope for this pass; flagging so it doesn't look finished when it isn't. The web/PWA icons above do cover the phone browser install (bookmark, "Add to Home Screen") and iOS.

**Update (September 2026): now done.** Generated the native Android launcher icon set directly (without the `@capacitor/assets` CLI, which wasn't available) using the same headless-Chromium master-render-then-downscale technique as the PWA icons. Three renders from `pictogram/asado_pictogram_vector.svg`, each verified for symmetric, uncropped bounding boxes before downscaling:
- **Adaptive icon foreground** (`ic_launcher_foreground.png`, all 5 densities: 108/162/216/324/432px) — the ink mark alone, transparent background, at ~58% scale so it clears the safe zone regardless of which mask shape a launcher applies (circle, squircle, rounded square — all three previewed and checked for clipping).
- **Adaptive icon background** — switched `values/ic_launcher_background.xml` from Android Studio's default white (`#FFFFFF`) to `--paper` (`#EFEFEF`), composited separately by Android at render time (not baked into the foreground PNG, per the adaptive-icon spec).
- **Legacy icons** (`ic_launcher.png` / `ic_launcher_round.png`, pre-Android-8 devices and OS fallback paths): `--paper` background baked directly into the PNG since there's no separate compositing on legacy paths. Square variant at the more generous ~78% mark scale (matches the existing non-maskable PWA icons); round variant at the conservative ~58% scale (matches the maskable PWA icon), since it gets circle-cropped by the OS.

Left the old unused Android Studio template files in place (`drawable/ic_launcher_background.xml`, a teal grid vector; `drawable-v24/ic_launcher_foreground.xml`, a vector "IC" mark) — confirmed via `AndroidManifest.xml` and the adaptive-icon XML that neither is actually referenced (the manifest points at `@mipmap/ic_launcher`/`@mipmap/ic_launcher_round`, and the adaptive-icon XML points at `@mipmap/ic_launcher_foreground` + `@color/ic_launcher_background`), so they're harmless dead resources rather than live ones.

## Pictogram in the app header (September 2026)

Added the pictogram inline into `mobile/index.html`'s header, beside the "Barbacue Diaries" title (option chosen over icon-replaces-wordmark). Inlined as SVG (not an `<img>` tag) so it scales perfectly at any size and its color follows `currentColor` — inherits `var(--ink)` via `.brand-mark { color: var(--ink); }` rather than a hardcoded fill, so it'll track the ink token automatically if the palette ever changes again.

Layout: `.brand` wraps the mark + the existing eyebrow/title block in a flex row, `.brand-mark` fixed at `2.6rem` square. Verified by rendering the actual `index.html`/`styles.css`/`app.js` in headless Chromium at a phone-width viewport (420px) before calling it done — looks balanced against the title at that size, doesn't overflow or wrap.

Not touched: desktop's header (`src/renderer/index.html`) and the empty-state "+" — this pass was header-only, per David's choice of "beside the title" over the other placement options offered.

### Follow-up: aligned to the title, not the eyebrow+title block (September 2026)

David's feedback after seeing it live: "I think it should be aligned to the middle of Barbacue" — the mark was centered (`align-items: center`) against the *whole* `.brand` block, which included the stacked eyebrow line above the title. That made the icon read as vertically centered against eyebrow+title combined, which sits visibly higher than the title text alone.

Fixed by restructuring the header markup so the eyebrow is no longer inside the icon's flex row:

```html
<div class="brand">
  <p class="eyebrow">Private cook log</p>
  <div class="brand-row">
    <svg class="brand-mark" ...>...</svg>
    <h1>Barbacue Diaries</h1>
  </div>
</div>
```

`.brand` is now just a plain block wrapper (eyebrow stacked above). The flex/center rule moved to a new `.brand-row` that contains *only* the mark and the `<h1>` — so `align-items: center` now centers the icon against the h1's own line-box specifically, not against the taller two-line block. `.brand-mark` itself is unchanged (`2.6rem` square, `color: var(--ink)`).

Verified the same way as the original placement: rendered the real `mobile/index.html` + `mobile/styles.css` in headless Chromium at a 420px-wide viewport and inspected the crop — eyebrow now sits on its own line above the icon+title row, and the icon lines up with the title's vertical center.

Synced to `www/` (Android/Capacitor build) immediately after.

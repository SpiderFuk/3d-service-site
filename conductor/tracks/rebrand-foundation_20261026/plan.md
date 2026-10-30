# Implementation Plan: Rebrand · Design System Foundation & Single-Source Config

**Track ID:** rebrand-foundation_20261026
**Spec:** [spec.md](./spec.md)
**Created:** 2026-10-26
**Status:** [x] Complete

## Overview

Tokens and fonts first, then the shared primitives every section uses, then the three owner settings with tests, then the page skeleton the section tracks fill in.

## Phase 1: Tokens, Fonts & Assets

### Tasks

- [x] Task 1.1: Get `tokens.json` and `printo-wordmark-cobalto.svg` into `design/landing-v1/` (blocker; see spec). Copy the wordmark to `static/brand/`.
  - Note: wordmark copied from `D:\[PRINTO]\logo\svg`; `tokens.json` exported from the design canvas (`project/ds/printo-filamento/tokens.json`).
- [x] Task 1.2: Create `src/lib/styles/tokens.css` with colors, font families, radius scale (20/24/28/pill), border width, extrusion shadows (large and small), section padding and gutters as custom properties.
- [x] Task 1.3: Update `tailwind.config.js`: remove old `primary`/`whatsapp`/Inter, map the brand colors and fonts to the variables, add `screens` for 960 px and 1200 px plus a `<360` variant.
- [x] Task 1.4: Load Bricolage Grotesque + Figtree in `src/app.html` (preconnect + `display=swap`, the same URL as the reference HTML); set body crema background, tinta text, Figtree base.

### Verification

- [x] Fonts render; `grep -rE '#[0-9A-Fa-f]{6}' src --include=*.svelte` shows no new hard-coded brand colors.

## Phase 2: Shared UI Primitives

### Tasks

- [x] Task 2.1: Global base styles in `app.css`: focus ring (+ crema variant via a `.on-cobalto` scope), links (tinta, underline offset 4 px, hover cobalto), `.cta` hover with `prefers-reduced-motion` guard, `.extrude` / `.extrude-sm`.
- [x] Task 2.2: `ui/Section.svelte`: section shell (id, `aria-labelledby`, padding 96/32 px, side padding 64/16 px, `scroll-margin-top: 100px`).
- [x] Task 2.3: `ui/SectionHeading.svelte`: eyebrow + two-line headline (56/36 px, 800, -0.04em, lh 0.95, second line cobalto), `size="xl"` for 72 px (hero/contacto), configurable heading level and second-line color.
- [x] Task 2.4: Rewrite `ui/Button.svelte` as variants `quote` (cobalto), `ink` (tinta/crema), `butter` (mantequilla); accepts `href` (renders `<a target="_blank" rel="noopener">` for WhatsApp) or button mode; 44 px min target.
- [x] Task 2.5: `ui/Tag.svelte` (pill, color prop) and rewrite `ui/Card.svelte` (2 px tinta border, radius tier prop, background color prop).

### Verification

- [x] A temporary primitives route or story page matches the reference HTML at 1440 px and 375 px; keyboard focus ring is visible on every primitive.

## Phase 3: Single-Source Settings

### Tasks

- [x] Task 3.1: Add Vitest (`vitest` dev dependency, `npm run test` script).
- [x] Task 3.2: `config/hours.ts` (`{ week: [600, 1080], sat: [720, 960] }`) + `utils/hours.ts`: `isOpenAt(date)`, `horarioLargo`, `horarioCorto` ("L a V 10 a 18 · S 12 a 16"), `horarioFrase` (FAQ answer). Use Montevideo time zone. Tests first for edges: 9:59/10:00/17:59/18:00 weekdays, Saturday window, Sunday, a visitor in another time zone.
- [x] Task 3.3: `stores/hoursStore.ts`: readable `abiertoAhora`, rechecked every 60 s, cleaned up on unsubscribe.
- [x] Task 3.4: Update `config/contact.ts` (number `59896341462`, display `096 341 462`, Instagram, email). Create `config/whatsappMessages.ts` with every message from the BUILD.md table (viewer ones as functions). Rewrite `utils/whatsapp.ts` to `whatsappUrl(message)`. Tests for encoding of accents, `¿`, `{nombre}` interpolation.
- [x] Task 3.5: Migrate `static/content/data/materials.json` and its types + `materialsStore` fallback to the new stock list (PLA 12 colors / PETG 3, Bambu hex, `agotado`, translucent rgba values).

### Verification

- [x] `npm run test` passes; `npm run check` clean.
  - Note: 29 tests pass. `check` errors (and the build error from Task 3.4) are only in legacy components still rendered by +page/+layout; removed in Phase 4.

## Phase 4: Page Skeleton

### Tasks

- [x] Task 4.1: Update `config/sections.ts` + `sectionsVisibilityDefaults.ts` to the new 11 sections (re-keyed ids).
- [x] Task 4.2: Create placeholder components under `components/landing/` (Navegacion, Hero, TresCaminos, Trabajos, ComoFunciona, Materiales, Precios, Visor, Preguntas, Contacto, Pie), each a `Section` with its id and an h2 stub (h1 in Hero).
- [x] Task 4.3: Rewrite `+page.svelte` to render them in order, keep visibility gating, add "Saltar al contenido" skip link targeting `<main id="contenido">`.
  - Note: the skip link lives in `+layout.svelte` so it stays ahead of the out-of-service banner's button. Legacy `layout/`, `sections/` and old viewer UI (FileUploader, ModelInfo, ModelThumbnails, ViewerControls) deleted here with the owner's OK (pulled forward from rebrand-cleanup-qa).
- [x] Task 4.4: Update `<svelte:head>` title/description to the new brand placeholder (final SEO in track 7).

### Verification

- [x] Every anchor (`#inicio` … `#contacto`, `#visor`, `#preguntas`) scrolls to its section; skip link is the first Tab stop; `npm run build` passes.

## Final Verification

- [x] All acceptance criteria met
  - Note: `src/lib/config/filamentColors.ts` still holds the old color list (only `ColorSwatch` imports its type); removal is scheduled in rebrand-cleanup-qa.
- [x] Tests passing (29)
- [x] Documentation updated (if applicable)
- [x] Ready for review

---

_Generated by Conductor. Tasks will be marked [~] in progress and [x] complete._

# Implementation Plan: Filamento Rebrand

**Track ID:** filamento-rebrand_20261019
**Spec:** [spec.md](./spec.md)
**Created:** 2026-10-19
**Status:** [~] In Progress

## Overview

Apply the brand bottom-up: tokens and fonts first (so most components recolor automatically), then logo/icons, then shared UI components, then each section, then metadata, and finally a QA pass with Playwright screenshots and leftover greps. All work happens on `rebrand/filamento`; every phase ends with the verification checkpoint from `conductor/workflow.md` (dev server in desktop and phone widths, Three.js renders, `npm run check`, `npm run build`) and a Conventional Commit.

## Phase 1: Foundation

Tokens, fonts and base typography. No component changes.

### Tasks

- [x] Task 1.1: Commit the brand kit (`docs/`, `static/brand/`, `REBRAND-PLAN.md`, `tailwind.extend.snippet.js`) (`docs`)
- [x] Task 1.2: Update `tailwind.config.js` with tokens from `tailwind.extend.snippet.js`, keeping `primary` / `background` / `text` names; add `font-display`, brand radii
- [x] Task 1.3: In `src/app.css` replace the Inter import with Bricolage Grotesque (500, 700, 800) and Figtree (400, 500, 600); body `font-sans`, h1-h3 `font-display`, 800 on h1/h2, `-0.04em` tracking on h1; import or mirror `static/brand/brand.css` variables
- [x] Task 1.4: Set `theme-color` in `src/app.html` to `#2B3CFF`
- [x] Task 1.5: Align `conductor/tech-stack.md` with the new fonts/tokens if needed

### Verification

- [x] Workflow checkpoint passes; site recolored with no broken layout; fonts load (Network tab)

## Phase 2: Logo and Icons

### Tasks

- [x] Task 2.1: `Navbar.svelte`: `printo-wordmark-cobalto.svg` (~36-40px tall, alt "printo"), remove GIF, "[PRINTO]" text and `onerror` fallback; nav behavior unchanged (`layout`)
- [x] Task 2.2: `Footer.svelte`: `printo-wordmark-crema.svg` on tinta background, remove duplicate text name (`layout`)
- [x] Task 2.3: Favicons: `static/brand/favicon.svg`, `favicon.ico`, `logo/icons/favicon-180.png` as apple-touch-icon; update `src/app.html` links; replace `static/favicon.png` and `static/apple-touch-icon.png`
- [ ] Task 2.4: Grep for references, then move old logo files from `static/images/` (`logo animado.gif/mp4`, `logo nombre *`, `logo.png`, `logo-with-no-bg.png`) to `static/images/_old-logos/`; confirm zero references remain
- [ ] Task 2.5: `contactInfo.businessName` → `"printo"`; check usages (alt texts, copyright, WhatsApp message)

### Verification

- [ ] Workflow checkpoint passes; logo correct in Navbar/Footer at all widths; favicon visible in tab; no 404s in console

## Phase 3: Base Components

Shape language from `docs/brand.md`.

### Tasks

- [ ] Task 3.1: `Button.svelte`: `rounded-full`, min-height 44px, `font-semibold`; variants primary (cobalto/crema), outline (white, 2px tinta border), whatsapp (green with tinta text), new `warm` (mantequilla/tinta); visible focus ring (`ui`)
- [ ] Task 3.2: `Card.svelte`: white, `rounded-brand-xl` (28px), 2px tinta border, no heavy shadow; hover translate; `--extrude` effect opt-in for a single card type only (`ui`)
- [ ] Task 3.3: `ColorSwatch.svelte`: radius and fonts only (`ui`)
- [ ] Task 3.4: `OutOfServiceBanner` / `OutOfServiceModal`: radius and fonts only, keep amber/red semantics (`ui`)

### Verification

- [ ] Workflow checkpoint passes; keyboard tab shows focus on every button; buttons >= 44px tall; contrast >= 4.5:1 on all variants

## Phase 4: Hero

### Tasks

- [ ] Task 4.1: Propose headline options ("Dale vida a tus ideas con Impresión 3D" vs "Tu idea, en tus manos.") and **wait for the user's choice**
- [ ] Task 4.2: Restyle `Hero.svelte` keeping `openWhatsApp`, `scrollToSection` and store-driven counts: crema background, eyebrow pill, display h1, body-lg paragraph, two CTAs; no gradients (`hero`)
- [ ] Task 4.3: Cobalto `rounded-brand-xl` block (right on desktop, below on mobile) with the spool SVG: five concentric circles tomate, mantequilla, menta, crema, cobalto, radii 146/116/86/56/26 in a 300 viewBox, `aria-hidden` (`hero`)
- [ ] Task 4.4: Quick stats as tiles with mantequilla, menta, tomate backgrounds and tinta text (`hero`)

### Verification

- [ ] Workflow checkpoint passes; Hero CTAs open WhatsApp / scroll correctly; layout good at 390 and 1440

## Phase 5: Remaining Sections

One commit per section.

### Tasks

- [ ] Task 5.1: `Services.svelte`: support-color icon tiles with tinta icons, `font-display` titles, alternating crema/white section backgrounds (`ui`)
- [ ] Task 5.2: `ModelViewer.svelte` and viewer components (`ViewerControls`, `ModelInfo`, `FileUploader`, `ModelThumbnails`, `ModelThumbnailPreview`); scene background `#FFF4E0` in `src/lib/three/sceneSetup.ts` (`viewer`)
- [ ] Task 5.3: `FilamentColors.svelte`: layout/typography only; filament color values untouched (`materials`)
- [ ] Task 5.4: `Gallery3D.svelte` (`ui`)
- [ ] Task 5.5: `ContactWhatsApp.svelte` (`ui`)
- [ ] Task 5.6: `Footer.svelte` final pass (tinta background, crema text, links/focus) (`layout`)

### Verification

- [ ] Workflow checkpoint passes; STL and 3MF upload, preload models and thumbnails all render; WhatsApp message unchanged; sections hidden by feature flags still hide

## Phase 6: Metadata and Social

### Tasks

- [ ] Task 6.1: `src/app.html` and `src/routes/+page.svelte`: title "printo", real description in Spanish, `og:url` / canonical `https://printo.uy/`, remove "Impresiones 3D Pro" / `tudominio.com`
- [ ] Task 6.2: New `static/og-image.png` 1200x630 built from brand assets
- [ ] Task 6.3: `static/site.webmanifest` (name, short_name, theme/background colors, 192/512 icons) and link it in `app.html`

### Verification

- [ ] Workflow checkpoint passes; built HTML contains the correct meta tags; manifest loads without errors

## Phase 7: 3D Logo Model (Optional)

### Tasks

- [ ] Task 7.1: Decide with the user whether to do this phase
- [ ] Task 7.2: Create an extruded "p" model from `printo-p-cobalto.svg` (Three.js `SVGLoader` + `ExtrudeGeometry` or exported OBJ) to replace `static/logo/logo.obj` as viewer placeholder (`viewer`)

### Verification

- [ ] Placeholder renders, oriented correctly, disposed on unmount

## Phase 8: QA

### Tasks

- [ ] Task 8.1: Add `@playwright/test` as devDependency and a screenshot script (e.g. `npm run screenshots`) capturing the page at 1440/768/390 against `npm run preview` (`chore`)
- [ ] Task 8.2: Run `npm run check`, `npm run lint`, `npm run build`; fix issues
- [ ] Task 8.3: Grep for leftovers: `#3B82F6`, `bg-blue-`, `text-blue-`, `Inter`, `rounded-lg` on buttons, `[PRINTO]`, old logo paths; exclude `filamentColors.ts` and out-of-service semantics
- [ ] Task 8.4: Accessibility pass: contrast, focus visibility, 44px touch targets, no emojis, voseo copy
- [ ] Task 8.5: Review screenshots with the user; open PR `rebrand/filamento` → `develop`

### Verification

- [ ] All commands pass; screenshots approved; grep clean

## Final Verification

- [ ] All acceptance criteria met
- [ ] Tests passing (check, lint, build)
- [ ] Documentation updated (CLAUDE.md, conductor docs)
- [ ] Ready for review

---

_Generated by Conductor. Tasks will be marked [~] in progress and [x] complete._

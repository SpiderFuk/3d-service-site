# Specification: Rebrand · Design System Foundation & Single-Source Config

**Track ID:** rebrand-foundation_20261026
**Type:** Feature
**Created:** 2026-10-26
**Status:** Draft
**Rebrand series:** 1 of 7 (blocks tracks 2–7)

## Summary

Lay the base for the printo landing v1 rebrand: PRINTO Filamento tokens as CSS custom properties, the new fonts and breakpoints, shared UI primitives, the three single-source settings the owner edits (opening hours, filament stock, WhatsApp number + messages), and the new page skeleton with all section anchors.

## Context

Source of truth: `design/landing-v1/BUILD.md` (wins over the HTML when they disagree), visual reference `design/landing-v1/landing-final.html`. The current site uses Inter + blue `#3B82F6` + Lucide icons; the new system bans icons/emojis and uses cobalto/tomate/mantequilla/menta on crema. Stack stays the same (SvelteKit 5 + Tailwind 3 + Three.js).

## User Story

As the printo owner, I want the new brand defined in one place and the hours, stock and WhatsApp number each editable with a single change, so that the whole page stays consistent and I can update it without touching components.

## Acceptance Criteria

- [ ] All colors live as CSS custom properties in one file; no hard-coded hex outside it (stock swatch hex values in the stock list excepted). Tailwind theme references the variables.
- [ ] Bricolage Grotesque (700/800) and Figtree (400/500/600) load from Google Fonts with `display=swap`; Inter is gone. Page background is crema.
- [ ] Breakpoints match BUILD.md: phone ≤959 px, small desktop 960–1199 px, desktop ≥1200 px (plus a <360 px hook).
- [ ] Shared primitives exist and match the reference: section shell (padding, `scroll-margin-top: 100px`), eyebrow, section headline (56/36 px, second phrase cobalto), buttons (cobalto quote / tinta / mantequilla), tags/pills, cards (2 px tinta border, 20/24/28 px radius), extrusion utility, `.cta` hover (lift 2 px, rotate -1.5deg, off under reduced motion), focus ring (3 px cobalto, offset 3 px, crema variant), link style.
- [ ] Opening hours stored once (`{ week: [600, 1080], sat: [720, 960] }`), with helpers giving open/closed for Montevideo time (UTC-3) and the long and short hours text.
- [ ] WhatsApp number stored once; every message from the BUILD.md table is in one catalog; a single helper builds `https://wa.me/59896341462?text=…` links.
- [ ] Filament stock list stored once (PLA + PETG, Bambu Lab hex codes, sold-out flag) and readable by the materials section.
- [ ] `+page.svelte` renders the 11 sections in BUILD.md order as placeholder components with ids `inicio`, `que-imprimimos`, `trabajos`, `como-funciona`, `materiales`, `precios`, `visor`, `preguntas`, `contacto`, plus a "Saltar al contenido" skip link as the first focusable element.
- [ ] Unit tests cover hours logic (open/closed edges, Saturday, Sunday, timezone) and WhatsApp URL encoding.
- [ ] `npm run check` and `npm run build` pass.

## Dependencies

- **Blocker, missing files:** `design/landing-v1/tokens.json` and `design/landing-v1/assets/printo-wordmark-cobalto.svg` are referenced by BUILD.md but are not in the repo. Get them from the design canvas or `D:\[PRINTO]\logo` before Phase 1. Until then, colors come from BUILD.md and the extrusion from the reference HTML (`5px 5px 0 … 20px 20px 0 #FF5A47`, smaller `3px … 12px` variant).
- Existing: `src/lib/config/contact.ts`, `src/lib/utils/whatsapp.ts`, `src/lib/stores/materialsStore.ts`, `static/content/data/materials.json` (remote content pipeline).

## Out of Scope

- Building the real section content (tracks 2–6).
- Deleting legacy components and dependencies (track 7). Legacy components may stay in the tree, unused.
- Restyling the out-of-service modal/banner (track 7).

## Technical Notes

- Tokens: `src/lib/styles/tokens.css` imported from `app.css`; Tailwind `theme.extend` maps `cobalto: 'var(--color-cobalto)'` and so on. Set custom `screens` for the 960/1200 breakpoints instead of overloading `md`/`lg` silently.
- Hours: compute Montevideo time with `Intl.DateTimeFormat('es-UY', { timeZone: 'America/Montevideo', … })`, not the visitor's local clock. Expose a readable store that rechecks every minute so the hero, FAQ and Contacto pill stay in sync.
- Stock list: **default decision**, keep `static/content/data/materials.json` (already fed by the spools pipeline and the remote-content fallback) as the one place, migrated to the new schema (Bambu hex codes, `agotado`, PLA/PETG only). Change the fallback in `materialsStore` to match. If the owner prefers a plain TS file, change only this task.
- WhatsApp: replace the old `generateMessage` (emojis, dimensions, volume) with `whatsappUrl(message: string)` and a typed `mensajes` catalog; viewer messages take a parameter (file name / example name).
- Feature flags: keep `sections-visibility` gating in `+page.svelte`, re-keyed in `sections.ts` to the new section ids.
- Add Vitest (dev-only) for the pure utilities; `workflow.md` recommends tests for utility functions.

---

_Generated by Conductor. Review and edit as needed._

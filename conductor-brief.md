# Using this kit with the Conductor plugin

Your repo already has `conductor/` (product, guidelines, tech-stack, workflow, tracks). The rebrand fits as ONE new track with phases. Order matters: update the context first, then create the track.

## 0. Prepare
```
git checkout develop && git pull
git checkout -b feature/brand-filamento
```
Unzip the kit in the repo root (adds `static/brand/`, `docs/`, `conductor-seed/`, `tailwind.extend.snippet.js`).
Replace `conductor/product-guidelines.md` with `conductor-seed/product-guidelines.md`.
Paste `CLAUDE.md.snippet` at the end of `CLAUDE.md` and fix the lines that still say "#3B82F6" and "Inter" (or ask Claude Code to).
Commit: `docs(conductor): update product guidelines for printo Filamento brand`.
(Conductor reads these files as context, so a track created before this would plan with the old blue and Inter.)

## 1. Create the track
In Claude Code, run `/conductor:new-track`. When it asks for the track type choose **Feature** (or "Refactor/Chore" if offered for visual work), title `printo brand rollout (Filamento)`, and give it this description:

```
Roll out the printo "Filamento" visual identity across the whole site.
Source of truth: docs/brand.md, docs/tokens.json, static/brand/brand.css, tailwind.extend.snippet.js, and the logo files in static/brand/logo. Reference for the intended look: REBRAND-PLAN.md.

Goals
- Replace the old blue/Inter look and the old cube logo everywhere with the new identity.
- Keep all behavior (feature flags, WhatsApp flow, 3D viewer, model loaders) unchanged.
- Mobile-first; text contrast >= 4.5:1; visible focus; 44px touch targets; no emojis; UI copy in Spanish with voseo.

Out of scope
- src/lib/config/filamentColors.ts values (real product colors), AWS/feature-flag code, amber/red out-of-service semantic colors.

Phases (each ends with a verification checkpoint per conductor/workflow.md)
1. Foundation: tailwind tokens (keep names primary/background/text so components recolor), fonts in app.css (Bricolage Grotesque + Figtree), heading styles, theme-color.
2. Logo and icons: Navbar and Footer use the SVG wordmark; favicons/apple-touch-icon; move old logo files to static/images/_old-logos; businessName "printo".
3. Base components: Button (pill, whatsapp with tinta text, warm variant), Card (white, rounded 28px, 2px tinta border), ColorSwatch, banners (radius/fonts only).
4. Hero: cobalto block with the spool illustration (5 concentric discs), eyebrow pill, display headline, support-color stat tiles. Ask me which headline to use before writing it.
5. Remaining sections: Services, ModelViewer (+ scene background #FFF4E0), FilamentColors, Gallery3D, ContactWhatsApp, Footer.
6. Metadata and social: app.html/+page.svelte titles, descriptions, og:url https://printo.uy/, new static/og-image.png 1200x630, site.webmanifest.
7. (Optional) New 3D logo model for the viewer placeholder (static/logo).
8. QA: npm run check, lint, build; Playwright screenshots at 1440/768/390; grep for leftovers (#3B82F6, bg-blue-, font Inter, rounded-lg buttons).

Commits: Conventional Commits, scopes ui, layout, hero, viewer, materials, docs.
```
Review the generated `spec.md` and `plan.md` in `conductor/tracks/`: confirm the phases above are all there and the out-of-scope list is respected. Fix them before implementing.

## 2. Implement
Run `/conductor:implement`. Conductor works task by task and stops at each phase checkpoint:
- Open `npm run dev` and look at the result at desktop and phone width.
- If a phase looks wrong, tell it what to change before approving, or use `/conductor:revert` for that phase.
- Use `/conductor:status` to see progress. Use `/clear` between phases only after Conductor has saved progress in `plan.md`.

## 3. Release
Push the branch, open a PR into `develop`, check the deployed staging site, then merge to `main`. Remember: both branches auto-deploy.

## Tips
- Brand drift: if Claude Code writes a raw hex or `bg-blue-500`, tell it "use only tokens from tailwind.config.js and static/brand/brand.css".
- The kit's `REBRAND-PLAN.md` has plain Claude Code prompts for each phase; use them as the wording for tasks that Conductor's plan leaves vague.

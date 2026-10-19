# PRINTO rebrand: step-by-step plan for Claude Code

Repo: SpiderFuk/3d-service-site (SvelteKit 5 + Tailwind 3 + Three.js, static SPA).
Important: `main` AND `develop` deploy automatically to S3/CloudFront. Never work on them directly.

## What I found in the repo (and what has to change)

| Where | Today | Change |
|---|---|---|
| `tailwind.config.js` | primary #3B82F6, Inter, slate grays | Brand tokens (see `tailwind.extend.snippet.js`). Keeping the names `primary`, `background`, `text` recolors the whole site in one go |
| `src/app.css` | Imports Inter from Google Fonts | Import Bricolage Grotesque + Figtree, `font-display` for headings |
| `Navbar.svelte` | Animated GIF cube logo + text "[PRINTO]" | The new SVG wordmark, no extra text |
| `Footer.svelte` | `/images/logo-with-no-bg.png` + text | Cream wordmark on the dark (tinta) footer |
| `Button.svelte`, `Card.svelte` | `rounded-lg`, blue/green | Pill buttons, large rounded cards with 2px tinta border |
| `Hero.svelte` | Blue gradient, centered text | Brand hero (cobalt block, spool illustration, support-color stats) |
| `Services`, `FilamentColors`, `Gallery3D`, `ContactWhatsApp` | Blue icon tiles, gray borders | Support colors (mantequilla, menta, tomate) on icon tiles, crema/white section rhythm |
| `src/lib/three/sceneSetup.ts` | Viewer background #F8FAFC | Crema #FFF4E0 |
| `static/logo/logo.obj` | Old cube logo shown in the 3D viewer at start | Optional: new 3D model of the extruded p |
| `static/favicon.png`, `apple-touch-icon.png`, `og-image.png` | Old logo | New favicons and a new 1200x630 social image |
| `src/app.html`, `+page.svelte` | "Impresiones 3D Pro", `tudominio.com`, theme-color #3B82F6 | "printo", `https://printo.uy/`, theme-color #2B3CFF, real description |
| `contact.ts` | `businessName: '[PRINTO]'` | `printo` (the brackets look like a template placeholder; confirm) |
| `CLAUDE.md`, `conductor/product-guidelines.md` | Say "Primary #3B82F6, Font Inter" | Update, otherwise Claude Code will keep re-introducing the old look |

Leave alone: `filamentColors.ts` (those are the real filament colors you sell), the amber and red out-of-service banner states (semantic colors), feature flags and AWS code, the WhatsApp green (functional color).
Known issue to decide: white text on WhatsApp green is only 1.9:1 contrast. Better: tinta text on the green button.

## Setup (once)

1. Unzip the kit into the repo root (`static/brand/`, `docs/`, `REBRAND-PLAN.md`, `tailwind.extend.snippet.js`).
2. Terminal in the repo: `git checkout develop && git pull && git checkout -b rebrand/filamento`.
3. Start Claude Code in the repo folder: `claude`. It reads `CLAUDE.md` automatically.
4. Start every step in Plan mode (Shift+Tab until it says plan mode), read the plan, approve, then let it edit.
5. After each step: `npm run dev`, look at it in the browser (desktop and phone width), then commit. Use `/clear` between steps so the context stays clean.
6. Open a Pull Request into `develop` at the end, check the deployed result, only then merge to `main`.

## Prompts, in order

### Step 1: Foundation (tokens, fonts, docs)
```
Read docs/brand.md, static/brand/brand.css and tailwind.extend.snippet.js.
We are rebranding the site to the PRINTO "Filamento" identity.
1. Update tailwind.config.js with the tokens from the snippet (keep the existing color names so components recolor automatically). Add font-display.
2. In src/app.css replace the Inter import with Bricolage Grotesque (500,700,800) and Figtree (400,500,600). Body uses font-sans; h1, h2, h3 use font-display, font-weight 800 for h1/h2, tight tracking (-0.04em on h1).
3. Update CLAUDE.md and conductor/product-guidelines.md (and conductor/tech-stack.md if needed) so they describe the new palette, fonts and brand rules instead of #3B82F6 and Inter. Add a short "Brand" section to CLAUDE.md that points to docs/brand.md.
4. Change theme-color in src/app.html to #2B3CFF.
Do not change any component yet. Show me the diff summary and run npm run check.
```

### Step 2: Logo and icons
```
Replace the old logo everywhere with the new brand assets in static/brand/logo/svg.
- Navbar.svelte: use printo-wordmark-cobalto.svg (height about 36-40px, alt "printo") instead of the animated GIF and the "[PRINTO]" text. Remove the onerror fallback logic. Keep the nav behavior unchanged.
- Footer.svelte: use printo-wordmark-crema.svg on the dark background, remove the duplicated text name.
- Favicons: use static/brand/favicon.svg, favicon.ico and logo/icons/favicon-180.png (apple-touch-icon). Update src/app.html links. Replace static/favicon.png and apple-touch-icon.png.
- Move the old logo files in static/images (logo animado.gif/mp4, logo nombre *, logo.png, logo-with-no-bg.png) into static/images/_old-logos/ instead of deleting them, and confirm nothing references them.
- contactInfo.businessName: change to "printo" and check where it is used (alt texts, footer copyright).
```

### Step 3: Base components (shape language)
```
Restyle the shared UI components to the brand rules in docs/brand.md:
- Button.svelte: pill shape (rounded-full), min height 44px, font-semibold. primary = cobalto with crema text, outline = white with 2px tinta border and tinta text, whatsapp keeps its green but with tinta text for contrast, add a "warm" variant (mantequilla, tinta text). Visible focus ring.
- Card.svelte: white, rounded-brand-xl (28px), 2px border tinta, no heavy shadow. Hover: small translate or the tomato extrude effect (box-shadow: var(--extrude) is available in static/brand/brand.css) used only on one card type, not everywhere.
- ColorSwatch.svelte, OutOfServiceBanner/Modal: only adjust radius and fonts, keep the amber/red semantic colors.
Run npm run check and show me before/after screenshots of Hero buttons and a service card at 1440 and 390 wide.
```

### Step 4: Hero
```
Redesign Hero.svelte with the brand look while keeping its logic (openWhatsApp, scrollToSection, material and color counts from the stores):
- Cream background. A large cobalto rounded block (rounded-brand-xl) on the right (desktop) / below (mobile) containing the spool illustration: five concentric circles tomate, mantequilla, menta, crema, cobalto, radii 146/116/86/56/26 in a 300 viewBox (see docs/brand.md). Decorative, aria-hidden.
- Left: small eyebrow pill, h1 in font-display weight 800 ("Dale vida a tus ideas con <span class='text-primary'>Impresión 3D</span>" or "Tu idea, en tus manos." - propose which fits better and ask me), body-lg paragraph, the two CTAs.
- The three quick stats become tiles with mantequilla, menta and tomate backgrounds and tinta text.
- Mobile first. No gradients.
```

### Step 5: The remaining sections
```
Apply the brand to the other sections one at a time, committing after each:
1. Services.svelte: icon tiles with support colors (mantequilla, menta, tomate) and tinta icons; section titles in font-display; alternate crema and white section backgrounds.
2. ModelViewer + viewer components: viewer panel white with 2px tinta border and rounded-brand-xl; change scene background in src/lib/three/sceneSetup.ts to #FFF4E0; upload dropzone dashed tinta border.
3. FilamentColors.svelte: same card language; do NOT change filamentColors.ts values.
4. Gallery3D.svelte: rounded-brand-xl images, category chips as pills in support colors.
5. ContactWhatsApp.svelte and Footer.svelte: tiles in support colors, footer on tinta with the cream wordmark.
After each, run the dev server, take screenshots at 1440 and 390, and check text contrast (tinta on tomate/mantequilla/menta only; never tomate as text on cream).
```

### Step 6: Metadata and social image
```
Fix the SEO metadata:
- src/app.html and src/routes/+page.svelte: replace "Impresiones 3D Pro" with "printo - Impresión 3D en Uruguay", og:url and twitter:url with https://printo.uy/, a real description in Spanish with voseo, author "printo".
- Create static/og-image.png (1200x630): cobalto background, the cream wordmark large, the line "Impresión 3D hecha en Uruguay." in crema, optional spool on the right. Render it from an HTML/SVG page with Playwright and keep the generator script in scripts/.
- Add a minimal site.webmanifest with name "printo", theme_color #2B3CFF, background_color #FFF4E0 and the 192/512 icons from static/brand/logo/icons.
```

### Step 7 (optional): 3D logo in the viewer
```
The viewer opens with the old cube logo (static/logo/logo.obj + logo.mtl, loaded in src/lib/three/placeholderLoader.ts). Create a new 3D model of the lowercase "p" from the brand (stem + ring, extruded, cobalto) with a tomato layer behind it, export as OBJ/MTL (or GLB if a loader exists), and swap it in. Keep the old files in static/logo/_old.
```

### Step 8: QA and release
```
Run npm run check, npm run lint and npm run build. Then serve the build and use Playwright to screenshot every section at 1440, 768 and 390 wide. List anything that still uses the old blue (#3B82F6, bg-blue-*), Inter, or rounded-lg buttons (grep). Check keyboard focus visibility and that all text meets 4.5:1 contrast. Fix what you find, then write a PR description (English) listing the changes and open the PR into develop.
```

## Rules to repeat when Claude Code drifts
- "Use only the tokens in tailwind.config.js and static/brand/brand.css. No new hex colors."
- "No emojis. UI text in Spanish with voseo."
- "Small commits, one per step. Do not touch main or develop."
- "Only the p is extruded in the logo; never recolor or add shadows to the logo."

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SPA (Single Page Application) for a 3D printing service** built with SvelteKit 5, TypeScript, Tailwind CSS, and Three.js. The main feature is an interactive 3D model viewer that allows users to visualize pre-loaded models or upload their own STL files for quotation via WhatsApp.

**Business:** [PRINTO] - Montevideo | Las Piedras, Uruguay

**Language:** All UI text and code comments are in Spanish.

## Technology Stack

- **Framework:** Svelte 5.x + SvelteKit 2.x (with Svelte 5 runes)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS 3.x reading the PRINTO Filamento tokens (CSS custom properties)
- **Fonts:** Bricolage Grotesque (700/800, headlines) + Figtree (400/500/600, text), Google Fonts
- **3D Engine:** Three.js 0.160+
- **Icons:** none in the new design (no icons, no emojis). `lucide-svelte` is still a dependency (only the legacy `config/services.ts` imports it) until the cleanup track.
- **Dependencies:** JSZip (for 3MF parsing)
- **Testing:** Vitest (unit tests for pure utilities and stores)
- **Deployment:** Static adapter (pre-rendered SPA)
- **Feature Flags:** AWS AppConfig integration

**Rebrand in progress:** the page is being rebuilt from `design/landing-v1/BUILD.md` (source of truth) and `design/landing-v1/landing-final.html` (visual reference), tracked in `conductor/tracks/rebrand-*`. Sections in `components/landing/` are placeholders until their track builds them.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Unit tests (Vitest)
npm run test

# Linting
npm run lint
```

## Architecture Overview

### Directory Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── landing/       # Navegacion, Hero, TresCaminos, Trabajos, ComoFunciona, Materiales, Precios, Visor, Preguntas, Contacto, Pie
│   │   ├── viewer/        # ThreeCanvas, ModelThumbnailPreview (old viewer, reused by the Visor track)
│   │   └── ui/            # Section, SectionHeading, Button, Card, Tag, ColorSwatch
│   ├── config/            # Static configuration files (hours, contact, whatsappMessages, sections…)
│   ├── loaders/           # 3D model loaders (Factory + Adapters)
│   ├── stores/            # Svelte stores (hoursStore, materialsStore, uiStore, featureFlagsStore, modelStore)
│   ├── services/          # External service integrations (AWS AppConfig, content JSON)
│   ├── styles/            # tokens.css (design tokens, the only place with brand colors)
│   ├── three/             # Three.js scene setup and utilities
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── routes/                # SvelteKit routes
└── app.css                # Global styles
static/
├── brand/                 # printo wordmark (SVG)
├── content/data/          # materials.json (filament stock list), gallery.json
├── images/                # caminos/, trabajos/, visor/ (photos and thumbnails)
└── models/                # Viewer example models (4 STL files)
```

### Svelte 5 Runes

This project uses the **Svelte 5 runes** reactive system:

```svelte
<script lang="ts">
  // Props with $props()
  let { autoRotate = false }: Props = $props();

  // Reactive state with $state()
  let count = $state(0);

  // Derived values with $derived()
  let doubled = $derived(count * 2);

  // Side effects with $effect()
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>

<!-- Snippets for component composition -->
{@render children?.()}
```

### Factory Pattern for 3D Loaders

The project uses a **Factory Pattern** to handle different 3D file formats:

- **Interface:** `IModelLoader` ([src/lib/loaders/types.ts](src/lib/loaders/types.ts))
- **Factory:** `ModelLoaderFactory` ([src/lib/loaders/ModelLoaderFactory.ts](src/lib/loaders/ModelLoaderFactory.ts))
- **Adapters:**
  - `STLLoaderAdapter` ([src/lib/loaders/STLLoaderAdapter.ts](src/lib/loaders/STLLoaderAdapter.ts))
  - `ThreeMFLoaderAdapter` ([src/lib/loaders/ThreeMFLoaderAdapter.ts](src/lib/loaders/ThreeMFLoaderAdapter.ts))

```typescript
const loader = ModelLoaderFactory.getLoader(filename);
const object3D = await loader.load(file);
const info = loader.getModelInfo(object3D);
```

### Three.js Scene Management

Scene setup is centralized in [src/lib/three/sceneSetup.ts](src/lib/three/sceneSetup.ts):

```typescript
interface SceneContext {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  controls: OrbitControls
  dispose: () => void
  addModel(model: Object3D): void
  removeModel(model: Object3D): void
  clearModels(): void
}
```

**Key Configuration:**
- **Lighting:** Ambient (0.6) + Directional (0.8) + Fill (0.3)
- **Camera:** 50° FOV, position (0, 80, 150), near/far 0.1-2000
- **Controls:** OrbitControls with damping, distance 20-500
- **Shadows:** PCFSoftShadowMap enabled

### State Management

Uses **Svelte stores** for global state:

1. **`abiertoAhora`** ([src/lib/stores/hoursStore.ts](src/lib/stores/hoursStore.ts)): readable boolean, workshop open now (Montevideo time), rechecked every minute. Drives the hero headline and the Contacto pill.

2. **`materialsStore`** ([src/lib/stores/materialsStore.ts](src/lib/stores/materialsStore.ts)): filament stock (`materials.pla`, `materials.petg`), `isLoading`, `isRemote`. Starts with the bundled `materials.json` and swaps in the fetched copy if it passes `esStockValido`.

3. **`modelStore`** ([src/lib/stores/modelStore.ts](src/lib/stores/modelStore.ts)): 3D model state
   - `currentModel`, `modelInfo`, `isLoading`, `error`, `fileName`
   - Methods: `setModel()`, `clearModel()`, `setLoading()`, `setError()`

4. **`uiStore`** ([src/lib/stores/uiStore.ts](src/lib/stores/uiStore.ts)): UI state
   - `isMobileMenuOpen`, `activeSection`, `showUploadModal`
   - `heroCtaVisible`: whether the hero "Pedir presupuesto" is on screen (the bar shows its own only when false)

5. **`featureFlagsStore`** ([src/lib/stores/featureFlagsStore.ts](src/lib/stores/featureFlagsStore.ts)): Feature flags
   - Polling from AWS AppConfig (5-minute interval)
   - Derived stores: `sectionsVisibilityFlag`, `servicesVisibilityFlag`

### Feature Flags System

The project uses **AWS AppConfig** for dynamic feature configuration:

**Service:** [src/lib/services/featureFlagsService.ts](src/lib/services/featureFlagsService.ts)
- Endpoint: AWS API Gateway → AppConfig
- Timeout: 10 seconds
- Graceful degradation: Returns empty array on failure

**Flag Types:**
1. `sections-visibility` - Show/hide page sections
2. `services-visibility` - Show/hide specific services (legacy, removed in the cleanup track)

The `out-of-service` flag (modal + banner) was removed; if AppConfig still returns it, the parser ignores it like any unknown key.

`sections-visibility` keys are the ones in `sections.ts` (`navegacion`, `hero`, `tresCaminos`, `trabajos`, `comoFunciona`, `materiales`, `precios`, `visor`, `preguntas`, `contacto`, `pie`). **The AppConfig profile must use these keys**; unknown or missing keys fall back to the defaults (visible).

**Override Pattern** ([src/lib/utils/visibilityHelpers.ts](src/lib/utils/visibilityHelpers.ts)):
- If flag enabled → Use AppConfig values (complete override)
- If flag disabled/missing → Use local config (fallback)

```typescript
import { isSeccionVisible, getVisibleNavItems } from '$lib/utils/visibilityHelpers';
import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';

// In component
const visible = isSeccionVisible('gallery', $sectionsVisibilityFlag);
const navItems = getVisibleNavItems($sectionsVisibilityFlag);
```

**Development Helpers** (available in DEV mode via browser console):
```javascript
window.__featureFlags.forceRefresh()      // Trigger immediate refresh
window.__featureFlags.startPolling(ms)    // Start custom polling interval
```

## Critical Implementation Details

### 1. Three.js in Svelte

Three.js requires the DOM. Use `onMount` for initialization and **always call `dispose()`**:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createScene } from '$lib/three/sceneSetup';

  let container: HTMLElement;
  let sceneContext: SceneContext | null = null;

  onMount(() => {
    sceneContext = createScene({ container });
  });

  onDestroy(() => {
    sceneContext?.dispose(); // CRITICAL: prevent memory leaks
  });
</script>
```

### 2. Model Rotation Correction

ThreeCanvas automatically corrects model orientation:

```typescript
model.rotation.x = -Math.PI / 2;  // -90° transversal
model.rotation.z = -Math.PI / 2;  // -90° frontal
// Also recalculates vertex normals for proper lighting
```

### 3. Model Cloning Pattern

Thumbnails use deep cloning to prevent mutation:

```typescript
const clonedModel = loadedPreviews[model.id].clone(true); // Deep clone
```

### 4. Dynamic Camera Distance

Camera adjusts automatically based on model size:

```typescript
const diagonal = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);
const fov = camera.fov * (Math.PI / 180);
const cameraDistance = diagonal / (2 * Math.tan(fov / 2)) * 1.5;
```

### 5. SSR Configuration

Three.js components **cannot render server-side**:

```typescript
// src/routes/+page.ts
export const ssr = false;

// src/routes/+layout.ts
export const prerender = true;
```

### 6. Feature Flags Lifecycle

**CRITICAL:** Start polling in layout mount, stop in destroy:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { featureFlagsStore } from '$lib/stores/featureFlagsStore';

  onMount(() => {
    featureFlagsStore.startPolling(); // 5-minute default
  });

  onDestroy(() => {
    featureFlagsStore.stopPolling(); // CRITICAL: prevent memory leaks
  });
</script>
```

## Configuration Files

### Single-source settings (owner edits these)

Each lives in exactly one place; components derive from it.

- **Opening hours:** [src/lib/config/hours.ts](src/lib/config/hours.ts), `{ week: [600, 1080], sat: [720, 960] }` (minutes, Montevideo time). Helpers in [src/lib/utils/hours.ts](src/lib/utils/hours.ts): `isOpenAt(date)`, `horarioLargo()`, `horarioCorto()`, `horarioFrase()`.
- **WhatsApp number:** [src/lib/config/contact.ts](src/lib/config/contact.ts) (`whatsappNumber: '59896341462'`, shown as `096 341 462`), plus Instagram and email.
- **Filament stock:** [static/content/data/materials.json](static/content/data/materials.json), PLA + PETG, Bambu Lab hex codes (`#RRGGBBAA` + `translucido` for translucent), `agotado` per color. Types in [src/lib/types/content.ts](src/lib/types/content.ts). `src/lib/config/filamentColors.ts` is an old leftover; do not edit it.
- **Importing content JSON:** import files from `static/content/data/` as `$contenido/<file>.json` (plugin in [vite.config.ts](vite.config.ts), types in [src/contenido.d.ts](src/contenido.d.ts)). Never import from `static/` by path: the build accepts it, but `npm run dev` returns 404 and the page renders blank.

### WhatsApp messages

[src/lib/config/whatsappMessages.ts](src/lib/config/whatsappMessages.ts) holds one message per entry point (BUILD.md table); viewer messages are functions.

```typescript
import { mensajes } from '$lib/config/whatsappMessages';
import { whatsappUrl } from '$lib/utils/whatsapp';

whatsappUrl(mensajes.presupuesto);
whatsappUrl(mensajes.visorArchivo(file.name));
```

### Sections Configuration

[src/lib/config/sections.ts](src/lib/config/sections.ts) lists the 11 sections in page order; `id` is the anchor (`inicio`, `que-imprimimos`, `trabajos`, `como-funciona`, `materiales`, `precios`, `visor`, `preguntas`, `contacto`). Menu items come from `getVisibleNavItems()` in `visibilityHelpers.ts`.

### Feature Flag Defaults

- [src/lib/config/sectionsVisibilityDefaults.ts](src/lib/config/sectionsVisibilityDefaults.ts) - Section visibility
- [src/lib/config/servicesVisibilityDefaults.ts](src/lib/config/servicesVisibilityDefaults.ts) - Service visibility (legacy)

## Utility Functions

### Visibility Helpers

[src/lib/utils/visibilityHelpers.ts](src/lib/utils/visibilityHelpers.ts):

```typescript
// Sections
isSeccionVisible(sectionKey, flag?)
getSeccionesWithVisibility(flag?)
getVisibleNavItems(flag?)

// Services
isServiceVisible(serviceId, flag?)
getVisibleServices(flag?)

```

### File Validation

[src/lib/utils/fileValidation.ts](src/lib/utils/fileValidation.ts):
- Max file size: 50MB
- Supported extensions: `.stl` (the viewer only accepts STL)

### WhatsApp Integration

[src/lib/utils/whatsapp.ts](src/lib/utils/whatsapp.ts): `whatsappUrl(message)` builds `https://wa.me/59896341462?text=…`. Open it with a link (`target="_blank" rel="noopener"`), e.g. `<Button href={whatsappUrl(mensajes.precios)}>`.

### Formatters

[src/lib/utils/formatters.ts](src/lib/utils/formatters.ts):

```typescript
formatNumber(value, locale = 'es-AR')
formatDimensions(x, y, z)        // "123.4 × 456.7 × 789.0 mm"
formatVolume(volume)             // "123.45 cm³"
formatPrice(price)               // Currency UYU
```

### Scroll Utilities

[src/lib/utils/scroll.ts](src/lib/utils/scroll.ts):

```typescript
scrollToSection(sectionId)
observarSeccionActual(secciones, alCambiar)  // IntersectionObserver; returns disconnect()
debounce(func, wait)
```

## Static Assets

### Images (`static/images/`)

- `caminos/` (Tres caminos, 4:3), `trabajos/` (gallery.json, square), `visor/` (example thumbnails, `<id>.webp`)
- **SEO:** `static/og-image.png`; favicons in `static/icons/`; wordmark in `static/brand/`

### 3D Models (`static/models/`)

STL only, one per viewer example (`visorEjemplos.ts`): `DrunkSanta.stl`, `mini.stl`, `FlowerVase.stl`, `agus-ine.stl`.

## Styling Guidelines

### Design Tokens (PRINTO Filamento)

All brand values live in [src/lib/styles/tokens.css](src/lib/styles/tokens.css) (from `design/landing-v1/tokens.json`). **No hex colors anywhere else** (filament stock excepted). Tailwind maps them:

- **Colors:** `cobalto` #2B3CFF, `tomate` #FF5A47, `mantequilla` #FFD84D, `menta` #86E3C0, `crema` #FFF4E0 (page background), `blanco`, `tinta` #1B1B2F (text and all borders), `tinta-suave` #4A4A63. Never tomate/mantequilla/menta as text.
- **Fonts:** `font-display` (Bricolage Grotesque), `font-sans` (Figtree, default).
- **Radius:** `rounded-chip` 20, `rounded-card` 24, `rounded-tile` 28, `rounded-pill`.
- **Borders:** `border` = 2 px tinta by default.
- **Extrusion:** `.extrude` / `.extrude-md` / `.extrude-sm` (one per view, square-edged shapes only).
- **Spacing:** `px-gutter` (64/16), `py-section` (96/32), `max-w-page` (1312), `min-h-tap` (44).
- **Sticky bar and anchors:** `--header-height` (74/66, the bar's own height), `--anchor-gap` (32/16) and `--scroll-offset` (their sum). `ui/Section` sets `scroll-margin-top` to `--scroll-offset` minus its top padding, so every anchor lands with its content `--anchor-gap` below the bar; `--section-scroll-margin` overrides it (Hero uses it to go back to the top).

### Breakpoints

Phone ≤959 px, small desktop 960–1199 px, desktop ≥1200 px. Tailwind screens: `xs` 360, `desk` 960, `wide` 1200, so `max-desk:` = phone, `desk:max-wide:` = small desktop, `max-xs:` = under 360 px. In component CSS use `@media (max-width: 959px)`.

### Primitives and global styles

BUILD.md rules: the cobalto `quote` button appears once at a time; the tomate extrusion is used once per view; no icons or emojis anywhere.


- `ui/Section` (anchor, `scroll-margin-top`, padding; `contentClass` replaces the default stack layout), `ui/SectionHeading` (eyebrow + two-phrase headline, `size="lg" | "xl"`), `ui/Button` (`quote` cobalto only for "Pedir presupuesto", `ink` default, `butter` Contacto WhatsApp, `plain`), `ui/Tag`, `ui/Card` (`radius`, `fondo`).
- `app.css`: focus ring (3 px cobalto, crema inside `.on-cobalto`), links (tinta, underline offset 4, hover cobalto), `.cta` hover (lift + rotate, off under reduced motion), `.eyebrow`.

## Common Patterns

### Dynamic Icon Mapping

```typescript
import * as Icons from 'lucide-svelte';

const iconMap: Record<string, any> = {
  Printer: Icons.Printer,
  Pen: Icons.PenTool,
  Zap: Icons.Zap,
  Wrench: Icons.Wrench
};

<svelte:component this={iconMap[service.icon]} size={24} />
```

### Conditional Section Rendering

```svelte
{#if isSeccionVisible('services', $sectionsVisibilityFlag)}
  <Services />
{/if}
```

### Loading a Model from URL

```typescript
const response = await fetch('/models/example.stl');
const blob = await response.blob();
const file = new File([blob], 'example.stl');

const loader = ModelLoaderFactory.getLoader(file.name);
const model = await loader.load(file);
```

## Technical Limitations

- Volume calculation is approximated (bounding box), not exact mesh volume
- File upload size limited to browser memory (~50MB practical limit)
- Three.js scenes use WebGL (not supported in very old browsers)
- 3MF support limited by Three.js (doesn't support Production Extension)
- Feature flags require AWS connectivity (graceful degradation on failure)

## Testing Considerations

Vitest runs `src/**/*.test.ts` in a Node environment (`npm run test`). Existing tests cover hours (incl. visitor time zones), `abiertoAhora`, WhatsApp URL encoding (checked against every link in `landing-final.html`) and the stock list.

When writing tests:
- Mock Three.js imports for unit tests
- Use `@testing-library/svelte` for component tests
- Mock `window.open` for WhatsApp link tests
- Mock `File` and `FileReader` for upload tests
- Mock feature flags service for flag-dependent components

## Performance Optimization

- SSR disabled for Three.js routes
- Lazy load Three.js components
- Model cloning instead of re-loading for thumbnails
- Feature flags polling at 5-minute intervals
- Debounced resize handlers
- Consider Draco compression for complex models

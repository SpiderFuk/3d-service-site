# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SPA (Single Page Application) for a 3D printing service** built with SvelteKit 5, TypeScript, Tailwind CSS, and Three.js. The main feature is an interactive 3D model viewer that allows users to visualize pre-loaded models or upload their own STL/3MF files for quotation via WhatsApp.

**Business:** [PRINTO] - Montevideo | Las Piedras, Uruguay

**Language:** All UI text and code comments are in Spanish.

## Technology Stack

- **Framework:** Svelte 5.x + SvelteKit 2.x (with Svelte 5 runes)
- **Language:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS 3.x
- **3D Engine:** Three.js 0.160+
- **Icons:** Lucide Svelte
- **Dependencies:** JSZip (for 3MF parsing)
- **Deployment:** Static adapter (pre-rendered SPA)
- **Feature Flags:** AWS AppConfig integration

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

# Linting
npm run lint
```

## Architecture Overview

### Directory Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/        # Navbar, Footer
│   │   ├── sections/      # Hero, Services, FilamentColors, ModelViewer, Gallery3D, ContactWhatsApp
│   │   ├── viewer/        # ThreeCanvas, ViewerControls, ModelInfo, FileUploader, ModelThumbnails, ModelThumbnailPreview
│   │   └── ui/            # Button, Card, ColorSwatch, OutOfServiceModal, OutOfServiceBanner
│   ├── config/            # Static configuration files
│   ├── loaders/           # 3D model loaders (Factory + Adapters)
│   ├── stores/            # Svelte stores (modelStore, uiStore, featureFlagsStore)
│   ├── services/          # External service integrations (AWS AppConfig)
│   ├── three/             # Three.js scene setup and utilities
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── routes/                # SvelteKit routes
└── app.css                # Global styles
static/
├── images/                # Logo variants, hero image (13 files)
└── models/                # Preloaded 3D models (4 STL files)
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

1. **`modelStore`** ([src/lib/stores/modelStore.ts](src/lib/stores/modelStore.ts)): 3D model state
   - `currentModel`, `modelInfo`, `isLoading`, `error`, `fileName`
   - Methods: `setModel()`, `clearModel()`, `setLoading()`, `setError()`

2. **`uiStore`** ([src/lib/stores/uiStore.ts](src/lib/stores/uiStore.ts)): UI state
   - `isMobileMenuOpen`, `activeSection`, `showUploadModal`
   - Out-of-service state: `outOfServiceUI` derived store

3. **`featureFlagsStore`** ([src/lib/stores/featureFlagsStore.ts](src/lib/stores/featureFlagsStore.ts)): Feature flags
   - Polling from AWS AppConfig (5-minute interval)
   - Derived stores: `outOfServiceFlag`, `sectionsVisibilityFlag`, `servicesVisibilityFlag`, `materialsVisibilityFlag`

### Feature Flags System

The project uses **AWS AppConfig** for dynamic feature configuration:

**Service:** [src/lib/services/featureFlagsService.ts](src/lib/services/featureFlagsService.ts)
- Endpoint: AWS API Gateway → AppConfig
- Timeout: 10 seconds
- Graceful degradation: Returns empty array on failure

**Flag Types:**
1. `out-of-service` - Disable site temporarily with modal/banner
2. `sections-visibility` - Show/hide page sections
3. `services-visibility` - Show/hide specific services
4. `materials-visibility` - Show/hide materials

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
window.__featureFlags.resetDismissal()    // Reset out-of-service modal dismissal
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

### 7. Out-of-Service Modal Dismissal

Modal dismissal persists in localStorage and shows banner instead:

```typescript
import { outOfServiceUI, dismissOutOfServiceModal } from '$lib/stores/uiStore';

// Show modal when: flag enabled AND not dismissed
$: if ($outOfServiceUI.showModal) { /* show modal */ }

// Show banner when: flag enabled AND dismissed
$: if ($outOfServiceUI.showBanner) { /* show banner */ }

// Dismiss modal
dismissOutOfServiceModal(); // Stores in localStorage, shows banner
```

## Configuration Files

### Sections Configuration

[src/lib/config/sections.ts](src/lib/config/sections.ts):

```typescript
const secciones = {
  hero: { id: 'hero', nombre: 'Hero', habilitada: true },
  services: { id: 'services', nombre: 'Servicios', habilitada: true },
  modelViewer: { id: 'model-viewer', nombre: 'Visor de Modelos', habilitada: true },
  filamentColors: { id: 'filament-colors', nombre: 'Colores de Filamento', habilitada: true },
  gallery: { id: 'gallery', nombre: 'Galería de Proyectos', habilitada: false },
  contact: { id: 'contact', nombre: 'Contacto WhatsApp', habilitada: true }
}
```

### Filament Colors & Materials

[src/lib/config/filamentColors.ts](src/lib/config/filamentColors.ts):

```typescript
// 4 materials: PLA, PETG, ABS, TPU
// Each with availability and colors

getMaterialesList()                    // All materials
getMaterialesDisponibles()             // Available only
getColoresByMaterial(materialId)       // Colors for material
getColoresDisponiblesByMaterial(id)    // Available colors only
```

### Contact Information

[src/lib/config/contact.ts](src/lib/config/contact.ts):

```typescript
const contactInfo = {
  whatsappNumber: '59896341462',
  whatsappDisplayNumber: '+598 96 341 462',
  businessName: '[PRINTO]',
  city: 'Montevideo | Las Piedras',
  email: 'hola@printo.uy',
  socialMedia: { instagram: 'https://www.instagram.com/printo.uy' }
}
```

### Feature Flag Defaults

- [src/lib/config/outOfServiceConfig.ts](src/lib/config/outOfServiceConfig.ts) - Modal/banner defaults
- [src/lib/config/sectionsVisibilityDefaults.ts](src/lib/config/sectionsVisibilityDefaults.ts) - Section visibility
- [src/lib/config/servicesVisibilityDefaults.ts](src/lib/config/servicesVisibilityDefaults.ts) - Service visibility
- [src/lib/config/materialsVisibilityDefaults.ts](src/lib/config/materialsVisibilityDefaults.ts) - Material availability

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

// Materials
isMaterialAvailable(materialId, flag?)
getAvailableMaterials(flag?)
```

### File Validation

[src/lib/utils/fileValidation.ts](src/lib/utils/fileValidation.ts):
- Max file size: 50MB
- Supported extensions: `.stl`, `.3mf`

### WhatsApp Integration

[src/lib/utils/whatsapp.ts](src/lib/utils/whatsapp.ts):

```typescript
generateMessage({ modelInfo?, customMessage? })
generateWhatsAppURL(options)
openWhatsApp(options)
copyMessageToClipboard(options)
```

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
getActiveSection(sections)
debounce(func, wait)
```

## Static Assets

### Images (`static/images/`)

- **Logo variants:** `logo.png`, `logo-with-no-bg.png`, `logo animado.gif` (animated), logo nombre variants
- **SEO:** `og-image.png`
- **Hero:** `imagen hero.png`

### 3D Models (`static/models/`)

- `FlowerVase.stl`
- `mini.stl`
- `DiceTower.stl`
- `DrunkSanta.stl`

## Styling Guidelines

### Design Tokens (Tailwind)

**Colors:**
- Primary: `#3B82F6` (blue)
- WhatsApp: `#25D366` (green)
- Background: `#FFFFFF`, secondary `#F8FAFC`
- Text: `#1E293B`, secondary `#64748B`

**Typography:**
- Font: Inter (weights: 400, 500, 600, 700)

**Responsive:**
- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

### Custom Utilities (app.css)

```css
.container         /* max-w-7xl */
.transition-smooth /* transition-all duration-300 ease-in-out */
.shadow-card       /* Custom card shadow */
.hide-scrollbar    /* Hides scrollbar but keeps functionality */
```

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

When writing tests (not configured yet):
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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SPA (Single Page Application) for a 3D printing service** built with SvelteKit 5, TypeScript, Tailwind CSS, and Three.js. The main feature is an interactive 3D model viewer that allows users to visualize pre-loaded models or upload their own STL/3MF files for quotation via WhatsApp.

**Language:** All UI text and code comments are in Spanish.

## Technology Stack

- **Framework:** Svelte 5.x + SvelteKit
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **3D Engine:** Three.js 0.160+
- **Icons:** Lucide Svelte
- **Dependencies:** JSZip (for 3MF parsing)

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

### Factory Pattern for 3D Loaders

The project uses a **Factory Pattern** to handle different 3D file formats (STL, 3MF). This is the core architectural pattern:

- **Interface:** `IModelLoader` ([src/lib/loaders/types.ts](src/lib/loaders/types.ts)) defines the contract for all loaders
- **Factory:** `ModelLoaderFactory` ([src/lib/loaders/ModelLoaderFactory.ts](src/lib/loaders/ModelLoaderFactory.ts)) creates the appropriate loader based on file extension
- **Adapters:**
  - `STLLoaderAdapter` ([src/lib/loaders/STLLoaderAdapter.ts](src/lib/loaders/STLLoaderAdapter.ts)) wraps Three.js STLLoader
  - `ThreeMFLoaderAdapter` ([src/lib/loaders/ThreeMFLoaderAdapter.ts](src/lib/loaders/ThreeMFLoaderAdapter.ts)) wraps Three.js 3MFLoader

**Usage:**
```typescript
const loader = ModelLoaderFactory.getLoader(filename);
const object3D = await loader.load(file);
const info = loader.getModelInfo(object3D);
```

### Three.js Scene Management

Scene setup is centralized in [src/lib/three/sceneSetup.ts](src/lib/three/sceneSetup.ts):
- Creates scene, camera, renderer, and OrbitControls
- Sets up lighting (ambient + directional lights with shadows)
- Handles resize and animation loop
- **Returns a `dispose()` function** - MUST be called in Svelte's `onDestroy` to prevent memory leaks

### State Management

Uses **Svelte stores** for global state:
- `modelStore` ([src/lib/stores/modelStore.ts](src/lib/stores/modelStore.ts)): Manages current 3D model, loading states, and errors
- `uiStore` ([src/lib/stores/uiStore.ts](src/lib/stores/uiStore.ts)): UI state management (if needed)

### Component Structure

```
src/lib/components/
├── layout/          # Navbar, Footer
├── sections/        # Hero, Services, FilamentColors, ModelViewer, Gallery3D, ContactWhatsApp
├── viewer/          # ThreeCanvas, ViewerControls, ModelInfo, FileUploader, ModelThumbnails
└── ui/              # Reusable UI components (Button, Card, ColorSwatch)
```

## Critical Implementation Details

### 1. Three.js in Svelte

Three.js requires the DOM, so **always initialize in `onMount`**:

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createScene } from '$lib/three/sceneSetup';

  let container: HTMLElement;
  let sceneContext: SceneContext;

  onMount(() => {
    sceneContext = createScene({ container });
  });

  onDestroy(() => {
    sceneContext?.dispose(); // Critical: prevent memory leaks
  });
</script>

<div bind:this={container} class="w-full h-full"></div>
```

### 2. Memory Management

**Always dispose Three.js resources:**
- Call `geometry.dispose()` on geometries
- Call `material.dispose()` on materials
- Call `texture.dispose()` on textures
- Call `renderer.dispose()` when done
- Use the loader's `dispose()` method

### 3. File Upload Handling

File uploads are **client-side only**:
- Max file size: ~50MB
- Supported formats: `.stl`, `.3mf`
- Validation happens in [src/lib/utils/fileValidation.ts](src/lib/utils/fileValidation.ts)

### 4. WhatsApp Integration

WhatsApp links are generated using the `wa.me` API:
- Base URL: `https://wa.me/{PHONE_NUMBER}`
- Message includes model info (dimensions, volume) if available
- Located in [src/lib/utils/whatsapp.ts](src/lib/utils/whatsapp.ts)
- **Note:** Phone number must be configured in format `549XXXXXXXXXX` (without spaces or +)

### 5. Model Information Calculation

Models provide metadata via `getModelInfo()`:
- **Dimensions:** Calculated from bounding box (in mm)
- **Volume:** Approximated from bounding box (in cm³) - not exact mesh volume
- **Triangles:** Count of faces for complexity estimation
- Located in each loader adapter

### 6. SSR Considerations

Three.js components **cannot render server-side**. Options:
1. Disable SSR for Three.js routes in `+page.ts`:
   ```typescript
   export const ssr = false;
   ```
2. Use dynamic imports with `{#await import()}`

### 7. Gallery Mini Viewers

Each gallery card renders a **small Three.js scene** with:
- Auto-rotation enabled (`mesh.rotation.y += 0.005`)
- Simplified lighting
- **Performance:** Use `IntersectionObserver` to only render visible canvases

## Configuration Files

### Filament Colors & Materials

Located in [src/lib/config/filamentColors.ts](src/lib/config/filamentColors.ts):
- `filamentColors[]`: Array of available colors with hex values and availability
- `materials[]`: PLA, PETG, ABS, TPU with descriptions
- **Update these based on actual inventory**

### Services & Contact Info

- [src/lib/config/services.ts](src/lib/config/services.ts): Service offerings
- [src/lib/config/contact.ts](src/lib/config/contact.ts): WhatsApp number, social media links

## Styling Guidelines

### Design System (from [03-UI-CONTENT-SPEC.md](03-UI-CONTENT-SPEC.md))

**Colors:**
- Primary accent: `#3B82F6`
- WhatsApp: `#25D366`
- Background: `#FFFFFF`, secondary `#F8FAFC`
- Text: `#1E293B`, secondary `#64748B`

**Typography:**
- Font: Inter (weights: 400, 500, 600, 700)
- Import in `app.css`

**Spacing:**
- Uses 8px system (`space-2`, `space-4`, etc.)

**Responsive:**
- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`

### Tailwind Configuration

Configure in `tailwind.config.js`:
- Extend colors with design tokens
- Add custom spacing if needed
- Enable JIT mode (default in v3)

## Static Assets

Place in `static/` directory:
- `static/models/`: Pre-loaded 3D models (`.stl`, `.3mf`)
- `static/images/`: Logo, og-image for SEO
- Reference as `/models/file.stl` in code (SvelteKit convention)

## Common Patterns

### Loading a Model from URL

```typescript
const response = await fetch('/models/example.stl');
const blob = await response.blob();
const file = new File([blob], 'example.stl');

const loader = ModelLoaderFactory.getLoader(file.name);
const model = await loader.load(file);
```

### Smooth Scroll to Section

```typescript
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth'
  });
}
```

### WhatsApp Link with Model Data

```typescript
import { openWhatsApp } from '$lib/utils/whatsapp';
import { modelStore } from '$lib/stores/modelStore';

// From component
const handleQuote = () => {
  openWhatsApp({
    modelInfo: $modelStore.modelInfo || undefined
  });
};
```

## Known Constraints & Pending Items

**From specifications, these items need configuration:**
1. Business name (for Hero and SEO)
2. WhatsApp phone number (in `whatsapp.ts`)
3. City/location (for SEO metadata)
4. Actual filament colors inventory
5. Pre-loaded gallery models (4-6 STL/3MF files)
6. Logo file
7. Social media handles

**Technical limitations:**
- Volume calculation is approximated (bounding box), not exact mesh volume
- File upload size limited to browser memory (~50MB practical limit)
- Three.js scenes use WebGL (not supported in very old browsers)

## Testing Considerations

When writing tests (not configured yet):
- Mock Three.js imports for unit tests
- Use `@testing-library/svelte` for component tests
- Mock `window.open` for WhatsApp link tests
- Mock `File` and `FileReader` for upload tests

## Performance Optimization

- Lazy load Three.js components
- Use `IntersectionObserver` for gallery mini viewers
- Implement debouncing on resize handlers
- Consider Draco compression for complex models
- Limit max polygon count for uploaded models

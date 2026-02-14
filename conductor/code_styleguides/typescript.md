# TypeScript / JavaScript Style Guide - [PRINTO]

## General

- TypeScript in **strict mode** (`tsconfig.json`)
- ES modules (`"type": "module"` in package.json)
- Prefer `const` over `let`; avoid `var`
- Use explicit return types for exported functions
- Use `unknown` over `any` when type is uncertain

## Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Variables | camelCase | `modelInfo`, `isLoading` |
| Functions | camelCase | `getLoader()`, `formatVolume()` |
| Classes | PascalCase | `ModelLoaderFactory`, `STLLoaderAdapter` |
| Interfaces | PascalCase with `I` prefix | `IModelLoader` |
| Types | PascalCase | `SceneContext`, `ModelInfo` |
| Constants | camelCase or UPPER_SNAKE_CASE | `contactInfo`, `MAX_FILE_SIZE` |
| Files | PascalCase for classes, camelCase for utils | `ModelLoaderFactory.ts`, `formatters.ts` |
| Svelte components | PascalCase | `ThreeCanvas.svelte`, `FileUploader.svelte` |
| Config files | camelCase | `filamentColors.ts`, `sections.ts` |

## Svelte 5 Patterns

### Runes (Reactive System)

```typescript
// Props - always use $props()
let { autoRotate = false, children }: Props = $props();

// State - use $state() for reactive variables
let count = $state(0);

// Derived - use $derived() for computed values
let doubled = $derived(count * 2);

// Effects - use $effect() for side effects
$effect(() => {
  console.log('Count changed:', count);
});
```

### Component Composition

```svelte
<!-- Use snippets instead of slots -->
{#snippet header()}
  <h2>Title</h2>
{/snippet}

{@render children?.()}
```

### Lifecycle

```typescript
import { onMount, onDestroy } from 'svelte';

onMount(() => {
  // DOM-dependent initialization (Three.js, event listeners)
});

onDestroy(() => {
  // Cleanup (dispose Three.js, remove listeners)
});
```

## Imports

### Order
1. Svelte/SvelteKit imports
2. Third-party libraries (three, jszip, lucide-svelte)
3. Internal aliases (`$lib/...`)
4. Relative imports

### Path Aliases
- Always use `$lib/` for imports from `src/lib/`
- Use relative imports only within the same directory

```typescript
// Good
import { modelStore } from '$lib/stores/modelStore';
import { formatVolume } from '$lib/utils/formatters';

// Bad
import { modelStore } from '../../stores/modelStore';
```

## Type Definitions

- Define types in `src/lib/types/`
- Export interfaces for component props
- Use `Record<string, T>` over index signatures
- Prefer union types over enums

```typescript
// Types file
export interface ModelInfo {
  dimensions: { x: number; y: number; z: number };
  volume: number;
  triangleCount: number;
}

// Component props
interface Props {
  autoRotate?: boolean;
  children?: import('svelte').Snippet;
}
```

## Error Handling

- Use try/catch for async operations (file loading, API calls)
- Provide user-facing error messages in Spanish
- Log technical details to console
- Graceful degradation for feature flags (fallback to local config)

```typescript
try {
  const model = await loader.load(file);
} catch (error) {
  console.error('Error loading model:', error);
  modelStore.setError('Error al cargar el modelo');
}
```

## Three.js Specific

- Always call `dispose()` on destroy (renderers, materials, geometries)
- Use `onMount` for scene initialization (requires DOM)
- Clone models with `clone(true)` for thumbnails
- Recalculate normals after rotation corrections

## File Organization

```
src/lib/
├── components/     # Svelte components (grouped by feature)
├── config/         # Static configuration (no logic)
├── loaders/        # 3D file loaders (Factory pattern)
├── stores/         # Svelte stores (global state)
├── services/       # External API integrations
├── three/          # Three.js scene setup and utilities
├── types/          # TypeScript type definitions
└── utils/          # Pure utility functions
```

## CSS / Tailwind

- Use Tailwind utility classes in templates
- Custom utilities defined in `app.css`
- Avoid inline styles; prefer Tailwind classes
- Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- Mobile-first approach (base styles = mobile)

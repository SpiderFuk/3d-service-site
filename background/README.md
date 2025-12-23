# Fondo Geométrico Isométrico para SvelteKit

Implementación del patrón geométrico sutil para tu sitio web usando Svelte 5.x, SvelteKit y Tailwind CSS 3.x.

## Archivos Incluidos

```
├── GeometricBackground.svelte     # Componente SVG (más personalizable)
├── GeometricBackgroundCSS.svelte  # Componente CSS (mejor rendimiento)
├── tailwind.config.ts             # Configuración de Tailwind con clases personalizadas
└── usage-example.svelte           # Ejemplos de uso
```

## Instalación

### 1. Copiar los componentes

Copia los archivos `.svelte` a tu carpeta de componentes:

```bash
cp GeometricBackground.svelte src/lib/components/
cp GeometricBackgroundCSS.svelte src/lib/components/
```

### 2. Configurar Tailwind (opcional)

Combina el contenido de `tailwind.config.ts` con tu configuración existente para usar las clases utilitarias de Tailwind.

---

## Uso

### Opción 1: Componente SVG (Recomendado para personalización)

```svelte
<script lang="ts">
  import GeometricBackground from '$lib/components/GeometricBackground.svelte';
</script>

<GeometricBackground
  bgColor="#F8FAFC"
  lineColor="#CBD5E1"
  lineOpacity={0.4}
  patternSize={28}
  strokeWidth={0.5}
  class="min-h-screen"
>
  <main class="container mx-auto px-4 py-16">
    <!-- Tu contenido aquí -->
  </main>
</GeometricBackground>
```

**Props disponibles:**

| Prop          | Tipo     | Default     | Descripción                    |
|---------------|----------|-------------|--------------------------------|
| `bgColor`     | `string` | `#F8FAFC`   | Color de fondo base            |
| `lineColor`   | `string` | `#CBD5E1`   | Color de las líneas            |
| `lineOpacity` | `number` | `0.4`       | Opacidad de líneas (0-1)       |
| `patternSize` | `number` | `28`        | Tamaño del patrón en px        |
| `strokeWidth` | `number` | `0.5`       | Grosor de las líneas           |
| `class`       | `string` | `''`        | Clases CSS adicionales         |

---

### Opción 2: Componente CSS (Recomendado para rendimiento)

```svelte
<script lang="ts">
  import GeometricBackgroundCSS from '$lib/components/GeometricBackgroundCSS.svelte';
</script>

<GeometricBackgroundCSS
  variant="isometric"
  intensity="subtle"
  class="min-h-screen"
>
  <!-- Tu contenido aquí -->
</GeometricBackgroundCSS>
```

**Props disponibles:**

| Prop        | Tipo                                    | Default      |
|-------------|-----------------------------------------|--------------|
| `variant`   | `'isometric' \| 'hexagon' \| 'cube'`    | `'isometric'`|
| `intensity` | `'light' \| 'subtle' \| 'medium'`       | `'subtle'`   |
| `class`     | `string`                                | `''`         |

---

### Opción 3: Clases de Tailwind (Más simple)

Después de configurar `tailwind.config.ts`:

```svelte
<!-- Usando backgroundImage de Tailwind -->
<div class="min-h-screen bg-slate-50 bg-isometric-pattern">
  <!-- Tu contenido -->
</div>

<!-- Usando las utilidades personalizadas -->
<div class="min-h-screen bg-isometric-subtle">
  <!-- Tu contenido -->
</div>

<!-- Con tamaño personalizado -->
<div class="min-h-screen bg-isometric-subtle bg-pattern-lg">
  <!-- Tu contenido -->
</div>
```

**Clases disponibles:**

Patrones base (usar con `bg-slate-50`):
- `bg-isometric-pattern`
- `bg-hexagon-pattern`
- `bg-cube-pattern`
- `bg-triangle-pattern`

Utilidades con fondo incluido:
- `bg-isometric-light`
- `bg-isometric-subtle`
- `bg-isometric-medium`

Modificadores de tamaño:
- `bg-pattern-sm`
- `bg-pattern-md`
- `bg-pattern-lg`
- `bg-pattern-xl`

---

## Uso en Layout Global

Para aplicar el fondo a toda tu aplicación, usa en `+layout.svelte`:

```svelte
<script lang="ts">
  import GeometricBackground from '$lib/components/GeometricBackground.svelte';
  import type { Snippet } from 'svelte';
  
  interface Props {
    children: Snippet;
  }
  
  let { children }: Props = $props();
</script>

<GeometricBackground class="min-h-screen">
  {@render children()}
</GeometricBackground>
```

---

## Personalización Avanzada

### Cambiar colores dinámicamente

```svelte
<script lang="ts">
  import GeometricBackground from '$lib/components/GeometricBackground.svelte';
  
  let isDark = $state(false);
</script>

<GeometricBackground
  bgColor={isDark ? '#0F172A' : '#F8FAFC'}
  lineColor={isDark ? '#334155' : '#CBD5E1'}
  lineOpacity={isDark ? 0.3 : 0.4}
>
  <!-- Tu contenido -->
</GeometricBackground>
```

### Crear variante personalizada en Tailwind

```typescript
// tailwind.config.ts
addUtilities({
  '.bg-my-custom-pattern': {
    backgroundImage: `url("data:image/svg+xml,...")`,
    backgroundColor: '#YOUR_COLOR',
  },
});
```

---

## Notas Técnicas

- El patrón usa proporciones basadas en `sqrt(3)` (~1.732) para mantener la geometría isométrica correcta
- Los SVG inline se codifican en base64 para evitar problemas de CSP
- El componente SVG genera un `patternId` único para evitar conflictos con múltiples instancias
- Ambos componentes usan `<slot>` para renderizar contenido hijo

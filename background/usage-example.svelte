<script lang="ts">
  /**
   * Ejemplo de uso de los componentes de fondo geométrico
   * +page.svelte o cualquier página de tu app SvelteKit
   */
  import GeometricBackground from '$lib/components/GeometricBackground.svelte';
  import GeometricBackgroundCSS from '$lib/components/GeometricBackgroundCSS.svelte';
</script>

<!-- ============================================
     OPCIÓN 1: Componente SVG (más personalizable)
     ============================================ -->
<GeometricBackground
  bgColor="#F8FAFC"
  lineColor="#CBD5E1"
  lineOpacity={0.4}
  patternSize={28}
  strokeWidth={0.5}
  class="min-h-screen"
>
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-slate-800">
      Mi Página Web
    </h1>
    <p class="mt-4 text-slate-600">
      Contenido con fondo geométrico sutil
    </p>
  </main>
</GeometricBackground>


<!-- ============================================
     OPCIÓN 2: Componente CSS (mejor rendimiento)
     ============================================ -->
<GeometricBackgroundCSS
  variant="isometric"
  intensity="subtle"
  class="min-h-screen"
>
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-slate-800">
      Mi Página Web
    </h1>
    <p class="mt-4 text-slate-600">
      Contenido con fondo geométrico sutil
    </p>
  </main>
</GeometricBackgroundCSS>


<!-- ============================================
     OPCIÓN 3: Usando solo Tailwind con clase personalizada
     (requiere configurar tailwind.config.js)
     ============================================ -->
<div class="min-h-screen bg-slate-50 bg-isometric-pattern">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-slate-800">
      Mi Página Web
    </h1>
    <p class="mt-4 text-slate-600">
      Contenido usando clase Tailwind personalizada
    </p>
  </main>
</div>


<!-- ============================================
     OPCIÓN 4: Layout completo para +layout.svelte
     ============================================ -->
<!--
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
-->

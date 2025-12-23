<script lang="ts">
  /**
   * GeometricBackgroundCSS.svelte
   * Versión alternativa usando CSS puro (mejor rendimiento)
   * Compatible con Svelte 5.x + SvelteKit + Tailwind CSS 3.x
   */

  interface Props {
    /** Variante del patrón */
    variant?: 'isometric' | 'hexagon' | 'cube';
    /** Intensidad del patrón (light, subtle, medium) */
    intensity?: 'light' | 'subtle' | 'medium';
    /** Clase CSS adicional */
    class?: string;
  }

  let {
    variant = 'isometric',
    intensity = 'subtle',
    class: className = ''
  }: Props = $props();

  // SVG patterns codificados en base64 para cada variante
  const patterns = {
    isometric: {
      light: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%23E2E8F0' stroke-width='0.5'/%3E%3C/svg%3E")`,
      subtle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
      medium: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8.66 L28 25.98 L14 34.64 L0 25.98 L0 8.66 Z M14 34.64 L28 43.3 L28 49 L14 49 L0 49 L0 43.3 Z' fill='none' stroke='%2394A3B8' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`
    },
    hexagon: {
      light: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 32 L28 40 L28 49 L0 49 L0 40 Z' fill='none' stroke='%23E2E8F0' stroke-width='0.4'/%3E%3C/svg%3E")`,
      subtle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 32 L28 40 L28 49 L0 49 L0 40 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.4' opacity='0.4'/%3E%3C/svg%3E")`,
      medium: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49'%3E%3Cpath d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 32 L28 40 L28 49 L0 49 L0 40 Z' fill='none' stroke='%2394A3B8' stroke-width='0.4' opacity='0.5'/%3E%3C/svg%3E")`
    },
    cube: {
      light: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='69'%3E%3Cpath d='M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z M20 23 L20 46 M0 11.5 L20 23 L40 11.5' fill='none' stroke='%23E2E8F0' stroke-width='0.5'/%3E%3Cpath d='M20 46 L40 57.5 L40 69 L20 69 L0 69 L0 57.5 Z' fill='none' stroke='%23E2E8F0' stroke-width='0.5'/%3E%3C/svg%3E")`,
      subtle: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='69'%3E%3Cpath d='M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z M20 23 L20 46 M0 11.5 L20 23 L40 11.5' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3Cpath d='M20 46 L40 57.5 L40 69 L20 69 L0 69 L0 57.5 Z' fill='none' stroke='%23CBD5E1' stroke-width='0.5' opacity='0.4'/%3E%3C/svg%3E")`,
      medium: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='69'%3E%3Cpath d='M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z M20 23 L20 46 M0 11.5 L20 23 L40 11.5' fill='none' stroke='%2394A3B8' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M20 46 L40 57.5 L40 69 L20 69 L0 69 L0 57.5 Z' fill='none' stroke='%2394A3B8' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`
    }
  };

  const backgroundImage = $derived(patterns[variant][intensity]);
</script>

<div
  class="geometric-bg-css {className}"
  style:background-image={backgroundImage}
>
  <slot />
</div>

<style>
  .geometric-bg-css {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #F8FAFC;
    background-repeat: repeat;
  }
</style>

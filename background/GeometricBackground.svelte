<script lang="ts">
  /**
   * GeometricBackground.svelte
   * Componente de fondo con patrón geométrico isométrico sutil
   * Compatible con Svelte 5.x + SvelteKit + Tailwind CSS 3.x
   */

  interface Props {
    /** Color de fondo base */
    bgColor?: string;
    /** Color de las líneas del patrón */
    lineColor?: string;
    /** Opacidad de las líneas (0-1) */
    lineOpacity?: number;
    /** Tamaño del patrón en píxeles */
    patternSize?: number;
    /** Grosor de las líneas */
    strokeWidth?: number;
    /** Clase CSS adicional */
    class?: string;
  }

  let {
    bgColor = '#F8FAFC',
    lineColor = '#CBD5E1',
    lineOpacity = 0.4,
    patternSize = 28,
    strokeWidth = 0.5,
    class: className = ''
  }: Props = $props();

  // ID único para evitar conflictos con múltiples instancias
  const patternId = `isometric-pattern-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div
  class="geometric-background {className}"
  style:--bg-color={bgColor}
>
  <svg
    class="absolute inset-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <!-- Patrón isométrico/hexagonal -->
      <pattern
        id={patternId}
        width={patternSize}
        height={patternSize * 1.732}
        patternUnits="userSpaceOnUse"
      >
        <!-- Líneas horizontales -->
        <line
          x1="0"
          y1={patternSize * 0.866}
          x2={patternSize}
          y2={patternSize * 0.866}
          stroke={lineColor}
          stroke-width={strokeWidth}
          opacity={lineOpacity}
        />
        
        <!-- Líneas diagonales izquierda a derecha (descendentes) -->
        <line
          x1="0"
          y1="0"
          x2={patternSize / 2}
          y2={patternSize * 0.866}
          stroke={lineColor}
          stroke-width={strokeWidth}
          opacity={lineOpacity}
        />
        <line
          x1={patternSize / 2}
          y1={patternSize * 0.866}
          x2={patternSize}
          y2={patternSize * 1.732}
          stroke={lineColor}
          stroke-width={strokeWidth}
          opacity={lineOpacity}
        />
        
        <!-- Líneas diagonales derecha a izquierda (descendentes) -->
        <line
          x1={patternSize}
          y1="0"
          x2={patternSize / 2}
          y2={patternSize * 0.866}
          stroke={lineColor}
          stroke-width={strokeWidth}
          opacity={lineOpacity}
        />
        <line
          x1={patternSize / 2}
          y1={patternSize * 0.866}
          x2="0"
          y2={patternSize * 1.732}
          stroke={lineColor}
          stroke-width={strokeWidth}
          opacity={lineOpacity}
        />
      </pattern>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#{patternId})" />
  </svg>
  
  <!-- Slot para contenido sobre el fondo -->
  <div class="relative z-10">
    <slot />
  </div>
</div>

<style>
  .geometric-background {
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: var(--bg-color);
    overflow: hidden;
  }
</style>

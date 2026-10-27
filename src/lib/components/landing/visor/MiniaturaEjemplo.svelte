<script lang="ts">
	/**
	 * Miniatura provisoria de cada ejemplo del visor (dibujos de landing-final.html)
	 *
	 * Decorativa: el nombre del ejemplo va en el botón. Se reemplaza por las fotos
	 * reales cuando la dueña las mande (BUILD.md, "Still open").
	 */
	import type { EjemploId } from '$lib/config/visorEjemplos';

	let { id }: { id: EjemploId } = $props();
</script>

<svg aria-hidden="true" focusable="false" width="100%" height="100%" viewBox="0 0 100 100">
	<ellipse class="base" cx="50" cy="84" rx="34" ry="7" />
	{#if id === 'santa'}
		<path class="pieza" d="M34 84 C 30 66, 34 54, 50 52 C 66 54, 70 66, 66 84 Z" />
		<circle class="pieza" cx="50" cy="42" r="11" />
		<path class="pieza" d="M38 36 L 52 14 L 63 36 Z" />
		<circle class="pompon" cx="52" cy="13" r="4" />
	{:else if id === 'miniatura'}
		<path class="pieza" d="M40 84 L 42 60 L 58 60 L 60 84 Z" />
		<path class="pieza" d="M36 64 L 64 64 L 60 50 L 40 50 Z" />
		<circle class="pieza" cx="50" cy="38" r="10" />
		<path class="linea" d="M30 46 L 36 28" />
	{:else if id === 'jarron'}
		<path
			class="pieza"
			d="M40 84 C 26 74, 24 58, 32 48 C 38 40, 44 36, 44 28 L 40 20 L 60 20 L 56 28 C 56 36, 62 40, 68 48 C 76 58, 74 74, 60 84 Z"
		/>
	{:else}
		<path class="linea" d="M58 80 L 66 50" />
		<rect class="lamina" x="26" y="18" width="44" height="58" rx="4" />
		<path class="relieve" d="M30 70 L 42 48 L 50 58 L 56 46 L 66 70 Z" />
		<circle class="sol" cx="56" cy="30" r="5" />
	{/if}
</svg>

<style>
	svg {
		display: block;
	}

	.base {
		fill: var(--color-crema);
		stroke: var(--color-tinta);
		stroke-width: 2;
	}

	.pieza {
		fill: var(--color-cobalto);
		stroke: var(--color-tinta);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}

	.pompon {
		fill: var(--color-blanco);
		stroke: var(--color-tinta);
		stroke-width: 2;
	}

	.linea {
		fill: none;
		stroke: var(--color-tinta);
		stroke-width: 3;
		stroke-linecap: round;
	}

	.lamina {
		fill: var(--color-blanco);
		stroke: var(--color-tinta);
		stroke-width: 2.5;
	}

	/* La referencia usa un gris fuera de la paleta; acá va crema para no sumar colores */
	.relieve {
		fill: var(--color-crema);
		stroke: var(--color-tinta);
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.sol {
		fill: var(--color-tinta-suave);
	}
</style>

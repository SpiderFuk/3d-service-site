<script lang="ts">
	/**
	 * Muestra de un color de filamento (va dentro de un <ul>)
	 *
	 * - Círculo con borde 2 px tinta. El hex viene del stock (único lugar con colores de filamento);
	 *   los translúcidos traen alfa en el hex (#RRGGBBAA) y se ven translúcidos sobre la tarjeta.
	 * - Agotado: relleno apagado, línea diagonal y etiqueta "Agotado" (texto visible, no solo color).
	 * - Nombre accesible: "Rojo" o "Azul, agotado". Lo visible se oculta a lectores de pantalla
	 *   para que no lo lean dos veces.
	 */
	import Tag from '$lib/components/ui/Tag.svelte';
	import type { ColorStock } from '$lib/types/content';

	interface Props {
		color: ColorStock;
	}

	let { color }: Props = $props();

	const nombreAccesible = $derived(color.agotado ? `${color.nombre}, agotado` : color.nombre);
</script>

<li class="sw" class:sw-agotado={color.agotado}>
	<span class="sr-only">{nombreAccesible}</span>
	<span class="sw-dot" aria-hidden="true">
		<span class="sw-relleno" style:background={color.hex}></span>
		{#if color.agotado}
			<span class="sw-tachado"></span>
		{/if}
	</span>
	<span class="sw-nombre" aria-hidden="true">{color.nombre}</span>
	{#if color.agotado}
		<span aria-hidden="true"><Tag color="blanco">Agotado</Tag></span>
	{/if}
</li>

<style>
	.sw {
		width: 96px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
	}

	.sw-dot {
		position: relative;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: var(--border);
		overflow: hidden;
	}

	.sw-relleno {
		position: absolute;
		inset: 0;
		border-radius: 50%;
	}

	.sw-agotado .sw-relleno {
		opacity: 0.35;
	}

	.sw-tachado {
		position: absolute;
		left: 50%;
		top: -2px;
		bottom: -2px;
		width: 2px;
		margin-left: -1px;
		background: var(--color-tinta);
		transform: rotate(45deg);
	}

	/* Teléfono: el ancho lo pone la grilla de la lista (columnas de 64 px como mínimo) */
	@media (max-width: 959px) {
		.sw {
			width: auto;
			font-size: 11px;
		}

		.sw-dot {
			width: 32px;
			height: 32px;
		}

		/* "Agotado" (14 px) es más ancho que 64 px: se achica de costado para no pisar al vecino */
		.sw-agotado :global(.tag) {
			padding-inline: 8px;
		}
	}
</style>

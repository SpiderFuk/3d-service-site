<script lang="ts">
	/**
	 * Pieza chica de Trabajos: foto cuadrada con borde (sin tarjeta), etiqueta de
	 * categoría y título h3.
	 */
	import Tag from '$lib/components/ui/Tag.svelte';
	import type { Trabajo } from '$lib/types/content';

	interface Props {
		trabajo: Trabajo;
	}

	let { trabajo }: Props = $props();
</script>

<li class="pieza">
	<div class="foto">
		<img src={trabajo.foto} alt={trabajo.alt} width="1200" height="1200" loading="lazy" />
	</div>
	<Tag color="blanco" class="self-start">{trabajo.categoria}</Tag>
	<h3 class="titulo">{trabajo.titulo}</h3>
</li>

<style>
	.pieza {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.foto {
		position: relative;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border: var(--border);
		border-radius: var(--radius-md);
		background: var(--color-blanco);
	}

	.foto img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.titulo {
		margin: 0;
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		line-height: 1.15;
	}

	@media (max-width: 959px) {
		.foto {
			border-radius: 16px;
		}

		.titulo {
			font-size: 16px;
		}
	}
</style>

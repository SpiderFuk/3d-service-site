<script lang="ts">
	/**
	 * Pieza destacada de Trabajos: tarjeta grande con foto cuadrada.
	 * La ubicación en la grilla (2 × 2 o ancho completo) la pone Trabajos.svelte.
	 */
	import Card from '$lib/components/ui/Card.svelte';
	import type { Trabajo } from '$lib/types/content';

	interface Props {
		trabajo: Trabajo;
	}

	let { trabajo }: Props = $props();
</script>

<Card as="li" radius="tile" class="destacado flex flex-col overflow-hidden desk:max-wide:flex-row">
	<div class="foto">
		<img src={trabajo.foto} alt={trabajo.alt} width="1200" height="1200" loading="lazy" />
	</div>
</Card>

<style>
	.foto {
		position: relative;
		aspect-ratio: 1 / 1;
		border-bottom: var(--border);
		background: var(--color-crema);
	}

	.foto img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Desktop chico: foto a la izquierda, mitad del ancho */
	@media (min-width: 960px) and (max-width: 1199px) {
		.foto {
			flex: 0 0 50%;
			border-bottom: 0;
			border-right: var(--border);
		}
	}
</style>

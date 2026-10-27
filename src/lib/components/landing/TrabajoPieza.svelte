<script lang="ts">
	/**
	 * Pieza chica de Trabajos: foto cuadrada con borde, sin tarjeta.
	 */
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

	@media (max-width: 959px) {
		.foto {
			border-radius: 16px;
		}
	}
</style>

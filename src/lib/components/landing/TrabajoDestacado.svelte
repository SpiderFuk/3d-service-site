<script lang="ts">
	/**
	 * Pieza destacada de Trabajos: tarjeta grande con foto cuadrada, etiqueta de
	 * categoría en mantequilla, título h3, y línea.
	 * La ubicación en la grilla (2 × 2 o ancho completo) la pone Trabajos.svelte.
	 */
	import Card from '$lib/components/ui/Card.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
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
	<div class="cuerpo">
		<Tag color="mantequilla" class="self-start">{trabajo.categoria}</Tag>
		<h3 class="titulo">{trabajo.titulo}</h3>
		<p class="linea">{trabajo.linea}</p>
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

	.cuerpo {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 24px 28px 28px;
	}

	.titulo {
		margin: 0;
		font-family: var(--font-display);
		font-size: 30px;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	.linea {
		margin: 0;
		font-size: 17px;
		line-height: 1.5;
	}

	/* Desktop chico: foto a la izquierda, mitad del ancho */
	@media (min-width: 960px) and (max-width: 1199px) {
		.foto {
			flex: 0 0 50%;
			border-bottom: 0;
			border-right: var(--border);
		}
	}

	@media (max-width: 959px) {
		.cuerpo {
			padding: 16px 16px 20px;
		}
	}
</style>

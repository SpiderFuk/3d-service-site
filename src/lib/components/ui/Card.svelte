<script lang="ts">
	/**
	 * Tarjeta de la marca: borde 2 px tinta y radio por nivel
	 *
	 * radius: chip 20 px (baldosas chicas), card 24 px (tarjetas), tile 28 px (baldosas grandes)
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: 'div' | 'li' | 'article';
		radius?: 'chip' | 'card' | 'tile';
		fondo?: 'blanco' | 'crema' | 'mantequilla' | 'menta' | 'tomate';
		children?: Snippet;
	}

	let {
		as = 'div',
		radius = 'card',
		fondo = 'blanco',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class="card card-{radius} {className}"
	style:background="var(--color-{fondo})"
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.card {
		border: var(--border);
		color: var(--color-tinta);
	}

	.card-chip {
		border-radius: var(--radius-md);
	}

	.card-card {
		border-radius: var(--radius-lg);
	}

	.card-tile {
		border-radius: var(--radius-xl);
	}
</style>

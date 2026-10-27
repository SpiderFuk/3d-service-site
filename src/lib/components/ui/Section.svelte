<script lang="ts">
	/**
	 * Contenedor de sección: ancla, padding y ancho máximo comunes
	 *
	 * El fondo ocupa todo el ancho; el contenido se limita a --page-max.
	 * - Padding vertical distinto: definir --section-pt / --section-pb en la sección.
	 * - Layout distinto (grid, columnas): pasar contentClass, que reemplaza la pila por defecto.
	 *
	 * Anclas: el margen de scroll descuenta el padding de arriba, así el contenido (no el
	 * borde de la sección) queda a --anchor-gap de la barra en todas las secciones.
	 * --section-scroll-margin lo reemplaza (el Hero lo usa para volver al tope de la página).
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		id: string;
		/** id del titular de la sección; por defecto `{id}-titulo` */
		labelledby?: string;
		contentClass?: string;
		children?: Snippet;
	}

	let {
		id,
		labelledby = `${id}-titulo`,
		class: className = '',
		contentClass = 'flex flex-col gap-[var(--section-gap)]',
		children,
		...rest
	}: Props = $props();
</script>

<section {id} aria-labelledby={labelledby} class="section {className}" {...rest}>
	<div class="section-content {contentClass}">
		{@render children?.()}
	</div>
</section>

<style>
	.section {
		scroll-margin-top: var(
			--section-scroll-margin,
			calc(var(--scroll-offset) - var(--section-pt, var(--section-pad-y)))
		);
	}

	.section-content {
		max-width: var(--page-max);
		margin: 0 auto;
		padding: var(--section-pt, var(--section-pad-y)) var(--gutter)
			var(--section-pb, var(--section-pad-y));
	}
</style>

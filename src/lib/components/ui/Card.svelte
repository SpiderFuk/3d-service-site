<script lang="ts">
	/**
	 * Componente Card reutilizable
	 * Superficie blanca con borde tinta de 2px y bordes redondeados (ver docs/brand.md)
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hover?: boolean;
		/** Extrusion tomate (--extrude). Usar en un solo tipo de tarjeta por vista */
		extrude?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		padding = 'md',
		hover = false,
		extrude = false,
		class: className = '',
		children
	}: Props = $props();

	const baseClasses = 'bg-white border-2 border-tinta rounded-brand-xl';

	const paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4 md:p-6',
		lg: 'p-6 md:p-8'
	};

	const extrudeClass = $derived(extrude ? 'shadow-extrude' : '');
	const hoverClass = $derived(hover ? 'hover:-translate-y-1 transition-smooth' : '');

	const classes = $derived(`${baseClasses} ${paddingClasses[padding]} ${extrudeClass} ${hoverClass} ${className}`);
</script>

<div class={classes}>
	{@render children?.()}
</div>

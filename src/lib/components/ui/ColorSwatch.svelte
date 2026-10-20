<script lang="ts">
	/**
	 * Componente para mostrar una muestra de color de filamento
	 */

	import type { Color } from '$lib/config/filamentColors';

	interface Props {
		color: Color;
		selected?: boolean;
		onclick?: () => void;
		size?: 'sm' | 'md' | 'lg';
	}

	let { color, selected = false, onclick, size = 'md' }: Props = $props();

	const sizeClasses = {
		sm: 'w-8 h-8',
		md: 'w-10 h-10',
		lg: 'w-12 h-12'
	};

	const baseClasses =
		'rounded-full border-2 border-tinta transition-all duration-200 cursor-pointer hover:scale-110 focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-tinta';
	const selectedClass = $derived(selected ? 'ring-4 ring-primary ring-offset-2 scale-110' : '');
	const disabledClass = $derived(!color.disponible ? 'opacity-40 cursor-not-allowed grayscale' : '');

	const classes = $derived(`${baseClasses} ${sizeClasses[size]} ${selectedClass} ${disabledClass}`);

	function handleClick() {
		if (color.disponible && onclick) {
			onclick();
		}
	}
</script>

<div class="flex flex-col items-center gap-2">
	<button
		class={classes}
		style="background-color: {color.hex};"
		onclick={handleClick}
		disabled={!color.disponible}
		aria-label={color.nombre}
		title={color.disponible ? color.nombre : `${color.nombre} (No disponible)`}
	>
		{#if !color.disponible}
			<span class="flex items-center justify-center w-full h-full text-white text-xs font-bold">
				✕
			</span>
		{/if}
	</button>

	<span class="text-xs font-medium text-center text-text-secondary {!color.disponible ? 'line-through' : ''}">
		{color.nombre}
	</span>
</div>

<script lang="ts">
	/**
	 * Componente Card reutilizable
	 */

	interface Props {
		padding?: 'none' | 'sm' | 'md' | 'lg';
		shadow?: boolean;
		hover?: boolean;
		class?: string;
		children?: any;
	}

	let {
		padding = 'md',
		shadow = true,
		hover = false,
		class: className = '',
		children
	}: Props = $props();

	const baseClasses = 'bg-white rounded-lg';

	const paddingClasses = {
		none: '',
		sm: 'p-3',
		md: 'p-4 md:p-6',
		lg: 'p-6 md:p-8'
	};

	const shadowClass = $derived(shadow ? 'shadow-md' : '');
	const hoverClass = $derived(hover ? 'hover:shadow-xl transition-shadow duration-300' : '');

	const classes = $derived(`${baseClasses} ${paddingClasses[padding]} ${shadowClass} ${hoverClass} ${className}`);
</script>

<div class={classes}>
	{@render children?.()}
</div>

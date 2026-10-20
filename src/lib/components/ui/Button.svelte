<script lang="ts">
	/**
	 * Componente Button reutilizable
	 * Forma de pastilla, objetivo tactil minimo de 44px y foco visible (ver docs/brand.md)
	 */
	import type { Snippet } from 'svelte';

	type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'whatsapp' | 'warm';
	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (event: MouseEvent) => void;
		class?: string;
		title?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		fullWidth = false,
		type = 'button',
		onclick,
		class: className = '',
		title,
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center min-h-11 font-semibold rounded-full border-2 transition-smooth focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-tinta disabled:opacity-50 disabled:cursor-not-allowed';

	// Texto: crema sobre cobalto/tinta, tinta sobre colores claros y de apoyo
	const variantClasses = {
		primary: 'bg-primary border-primary text-crema hover:bg-tinta hover:border-tinta',
		secondary: 'bg-crema border-tinta text-tinta hover:bg-white',
		outline: 'bg-white border-tinta text-tinta hover:bg-crema',
		whatsapp: 'bg-whatsapp border-whatsapp text-tinta hover:brightness-95',
		warm: 'bg-mantequilla border-mantequilla text-tinta hover:brightness-95'
	};

	const sizeClasses = {
		sm: 'min-w-11 px-3 text-sm gap-1.5',
		md: 'px-5 text-base gap-2',
		lg: 'min-h-12 px-7 text-[17px] gap-2.5'
	};

	const fullWidthClass = $derived(fullWidth ? 'w-full' : '');

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className}`);
</script>

<button {type} class={classes} {disabled} {onclick} {title}>
	{@render children?.()}
</button>

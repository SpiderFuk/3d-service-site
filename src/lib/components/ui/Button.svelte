<script lang="ts">
	/**
	 * Componente Button reutilizable
	 */

	type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'whatsapp';
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
		children?: any;
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
		'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary:
			'bg-primary text-white hover:bg-blue-600 focus:ring-primary shadow-sm hover:shadow-md',
		secondary:
			'bg-gray-200 text-text hover:bg-gray-300 focus:ring-gray-400 shadow-sm hover:shadow-md',
		outline:
			'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
		whatsapp:
			'bg-whatsapp text-white hover:bg-green-600 focus:ring-whatsapp shadow-sm hover:shadow-md'
	};

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm gap-1.5',
		md: 'px-4 py-2.5 text-base gap-2',
		lg: 'px-6 py-3 text-lg gap-2.5'
	};

	const fullWidthClass = $derived(fullWidth ? 'w-full' : '');

	const classes = $derived(`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${className}`);
</script>

<button {type} class={classes} {disabled} {onclick} {title}>
	{@render children?.()}
</button>

<script lang="ts">
	/**
	 * Botón de la marca (píldora, borde 2 px tinta, hover .cta)
	 *
	 * Variantes (BUILD.md):
	 * - quote: cobalto, solo para "Pedir presupuesto" (hero y barra)
	 * - ink: tinta con texto crema, el botón por defecto
	 * - butter: mantequilla, solo WhatsApp en Contacto
	 * - plain: blanco, acciones secundarias ("Probar otro")
	 *
	 * Con href se renderiza un <a>; los links externos (WhatsApp) abren en otra pestaña.
	 */
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> {
		variant?: 'quote' | 'ink' | 'butter' | 'plain';
		size?: 'md' | 'lg';
		/** Ancho completo (botones en teléfono) */
		full?: boolean;
		href?: string;
		/** Abrir en otra pestaña; por defecto true si href es absoluto */
		external?: boolean;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'ink',
		size = 'md',
		full = false,
		href,
		external = href?.startsWith('http') ?? false,
		type = 'button',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const classes = $derived(
		`btn btn-${variant} btn-${size} cta ${full ? 'btn-full' : ''} ${className}`
	);
</script>

{#if href}
	<a
		{href}
		class={classes}
		target={external ? '_blank' : undefined}
		rel={external ? 'noopener' : undefined}
		{...rest}
	>
		{@render children?.()}
	</a>
{:else}
	<button {type} {disabled} class={classes} {...rest}>
		{@render children?.()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: var(--tap-min);
		border: var(--border);
		border-radius: var(--radius-pill);
		font-family: var(--font-sans);
		font-weight: 600;
		line-height: 1;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
	}

	.btn-md {
		height: 48px;
		padding: 0 24px;
		font-size: 17px;
	}

	.btn-lg {
		height: 60px;
		padding: 0 32px;
		font-size: 18px;
	}

	.btn-full {
		display: flex;
		width: 100%;
	}

	.btn-quote,
	.btn-quote:hover {
		background: var(--color-cobalto);
		color: var(--color-crema);
	}

	.btn-ink,
	.btn-ink:hover {
		background: var(--color-tinta);
		color: var(--color-crema);
	}

	.btn-butter,
	.btn-butter:hover {
		background: var(--color-mantequilla);
		color: var(--color-tinta);
	}

	.btn-plain,
	.btn-plain:hover {
		background: var(--color-blanco);
		color: var(--color-tinta);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}

	@media (max-width: 959px) {
		.btn-md {
			height: 52px;
		}

		.btn-lg {
			height: 56px;
		}
	}
</style>

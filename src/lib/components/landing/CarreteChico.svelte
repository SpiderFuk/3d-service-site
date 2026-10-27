<!--
	Carrete chico de los botones de presupuesto (Hero, barra y píldora del teléfono):
	anillos tomate, mantequilla y menta dibujados con CSS. Decorativo.
	tamano: md 26 px (botones), sm 18 px (píldora "Presupuesto").
	Con hover o foco de teclado en el botón, los anillos de adentro laten una vez,
	el de menta un poco después (como filamento que se desenrolla).
-->
<script lang="ts">
	interface Props {
		tamano?: 'md' | 'sm';
		class?: string;
	}

	let { tamano = 'md', class: className = '' }: Props = $props();
</script>

<span class="carrete carrete-{tamano} {className}" aria-hidden="true"><span></span><span></span></span>

<style>
	.carrete {
		flex: none;
		position: relative;
		width: 26px;
		height: 26px;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-tomate);
	}

	.carrete span {
		position: absolute;
		inset: 3px;
		border-radius: 50%;
		background: var(--color-mantequilla);
	}

	.carrete span + span {
		inset: 7px;
		background: var(--color-menta);
	}

	.carrete-sm {
		width: 18px;
		height: 18px;
	}

	.carrete-sm span {
		inset: 2px;
	}

	.carrete-sm span + span {
		inset: 5px;
	}

	:global(.cta:hover) > .carrete span,
	:global(.cta:focus-visible) > .carrete span {
		animation: latido 0.5s cubic-bezier(0.3, 0.7, 0.2, 1);
	}

	:global(.cta:hover) > .carrete span + span,
	:global(.cta:focus-visible) > .carrete span + span {
		animation-delay: 0.08s;
	}

	@keyframes latido {
		0%,
		100% {
			transform: scale(1);
		}

		40% {
			transform: scale(0.6);
		}

		75% {
			transform: scale(1.12);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.cta:hover) > .carrete span,
		:global(.cta:focus-visible) > .carrete span {
			animation: none;
		}
	}
</style>

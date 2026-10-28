<script lang="ts">
	/**
	 * Tarjetas de ejemplo del visor: miniatura cuadrada + nombre
	 *
	 * La elegida queda en mantequilla con aria-pressed="true". En el teléfono
	 * la fila se desliza de costado.
	 *
	 * Respuesta al tocar: con hover la tarjeta sube y el dibujo crece y se inclina;
	 * al apretar baja; al elegirla el dibujo da un salto. Sin movimiento con
	 * prefers-reduced-motion (los colores cambian igual).
	 */
	import { ejemplosVisor, type EjemploId } from '$lib/config/visorEjemplos';
	import MiniaturaEjemplo from './MiniaturaEjemplo.svelte';

	interface Props {
		seleccionado: EjemploId | null;
		onelegir: (id: EjemploId) => void;
	}

	let { seleccionado, onelegir }: Props = $props();
</script>

<ul class="vex" aria-label="Modelos de ejemplo">
	{#each ejemplosVisor as ejemplo (ejemplo.id)}
		{@const elegido = seleccionado === ejemplo.id}
		<li>
			<button
				type="button"
				class="vcard"
				class:vcard-on={elegido}
				aria-pressed={elegido ? 'true' : 'false'}
				onclick={() => onelegir(ejemplo.id)}
			>
				<span class="vthumb"><MiniaturaEjemplo id={ejemplo.id} /></span>
				<span class="vname">{ejemplo.nombre}</span>
			</button>
		</li>
	{/each}
</ul>

<style>
	.vex {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
	}

	.vcard {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 6px 6px 10px;
		border: var(--border);
		border-radius: var(--radius-md);
		background: var(--color-blanco);
		color: var(--color-tinta);
		font: inherit;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			transform 0.15s ease;
	}

	.vcard:hover {
		background: var(--color-crema);
		transform: translateY(-2px);
	}

	.vcard:active {
		transform: translateY(1px) scale(0.98);
		transition-duration: 0.05s;
	}

	.vthumb :global(img) {
		transition: transform 0.25s cubic-bezier(0.3, 0.7, 0.2, 1);
	}

	.vcard:hover .vthumb :global(img) {
		transform: scale(1.08) rotate(-3deg);
	}

	.vcard-on .vthumb :global(img) {
		animation: salto 0.4s cubic-bezier(0.3, 0.7, 0.2, 1);
	}

	@keyframes salto {
		40% {
			transform: translateY(-8%) scale(1.06);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.vcard,
		.vcard:hover,
		.vcard:active,
		.vthumb :global(img),
		.vcard:hover .vthumb :global(img) {
			transition: none;
			transform: none;
		}

		.vcard-on .vthumb :global(img) {
			animation: none;
		}
	}

	.vcard.vcard-on {
		background: var(--color-mantequilla);
	}

	.vthumb {
		display: block;
		aspect-ratio: 1 / 1;
		border-radius: 14px;
		background: var(--color-crema);
		overflow: hidden;
		transition: background-color 0.15s ease;
	}

	.vcard-on .vthumb {
		background: var(--color-blanco);
	}

	.vname {
		padding: 0 4px;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
	}

	@media (min-width: 960px) and (max-width: 1199px) {
		.vex {
			grid-template-columns: repeat(4, minmax(0, 150px));
		}
	}

	/* Teléfono: fila que se desliza de costado hasta el borde de la pantalla.
	   El padding extra deja ver el anillo de foco (el overflow lo cortaría). */
	@media (max-width: 959px) {
		.vex {
			display: flex;
			overflow-x: auto;
			margin: -6px calc(-1 * var(--gutter)) -6px -6px;
			padding: 6px var(--gutter) 6px 6px;
		}

		.vex li {
			flex: none;
			width: 104px;
		}
	}
</style>

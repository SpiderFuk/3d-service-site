<script lang="ts">
	/**
	 * Tarjetas de ejemplo del visor: miniatura cuadrada + nombre
	 *
	 * La elegida queda en mantequilla con aria-pressed="true". En el teléfono
	 * la fila se desliza de costado.
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
	}

	.vcard:hover {
		background: var(--color-crema);
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

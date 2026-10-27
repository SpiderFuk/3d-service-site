<script lang="ts">
	/**
	 * Materiales y colores (#materiales), BUILD.md sección 06
	 *
	 * Nombre y disponibilidad de cada material vienen del stock (materialsStore);
	 * los textos de cada tarjeta son fijos y van acá.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Tag from '$lib/components/ui/Tag.svelte';
	import { materialsStore } from '$lib/stores/materialsStore';
	import type { MaterialId } from '$lib/types/content';

	interface TextosMaterial {
		lema: string;
		descripcion: string;
		propiedades: string[];
	}

	const orden: MaterialId[] = ['pla', 'petg'];

	const textos: Record<MaterialId, TextosMaterial> = {
		pla: {
			lema: 'El todoterreno.',
			descripcion:
				'Fácil de imprimir y con muy buena terminación. Ideal para figuras, decoración y regalos.',
			propiedades: ['Buena terminación', 'Rígido', 'Bajo olor']
		},
		petg: {
			lema: 'El resistente.',
			descripcion:
				'Aguanta golpes, algo de flexión y más calor que el PLA. Para piezas que se usan todos los días.',
			propiedades: ['Resiste golpes', 'Algo flexible', 'Aguanta más calor']
		}
	};
</script>

<Section id="materiales">
	<SectionHeading
		id="materiales-titulo"
		eyebrow="Materiales y colores"
		primera="Cada pieza,"
		segunda="con el material justo."
	/>
	<p class="linea">Contanos para qué es la pieza y elegimos el material que mejor le va.</p>

	<div class="mats">
		{#each orden as id (id)}
			{@const material = $materialsStore.materials[id]}
			<Card as="article" class="flex flex-col gap-3 p-7 max-desk:px-4 max-desk:py-5">
				<div class="mat-cabeza">
					<h3 class="mat-h">{material.nombre}</h3>
					{#if material.disponible}
						<Tag color="menta">Disponible</Tag>
					{/if}
				</div>
				<p class="mat-lema">{textos[id].lema}</p>
				<p class="mat-desc">{textos[id].descripcion}</p>
				<div class="mat-props">
					{#each textos[id].propiedades as propiedad (propiedad)}
						<Tag>{propiedad}</Tag>
					{/each}
				</div>
			</Card>
		{/each}
	</div>
</Section>

<style>
	p {
		margin: 0;
	}

	.linea {
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}

	.mats {
		margin-top: 28px;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}

	.mat-cabeza {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.mat-h {
		margin: 0;
		font-family: var(--font-display);
		font-size: 30px;
		line-height: 1.1;
		font-weight: 700;
	}

	.mat-lema {
		font-size: 18px;
		font-weight: 600;
	}

	.mat-desc {
		color: var(--color-tinta-suave);
	}

	.mat-props {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	/* Desktop chico: una tarjeta por fila (como la referencia) */
	@media (min-width: 960px) and (max-width: 1199px) {
		.mats {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 959px) {
		.mats {
			grid-template-columns: 1fr;
			margin-top: 8px;
			gap: 16px;
		}

		.mat-h {
			font-size: 26px;
		}
	}
</style>

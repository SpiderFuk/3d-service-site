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
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import { materialsStore } from '$lib/stores/materialsStore';
	import type { MaterialId } from '$lib/types/content';

	interface TextosMaterial {
		lema: string;
		descripcion: string;
		propiedades: string[];
	}

	interface NivelDetalle {
		nombre: string;
		texto: string;
		/** Cuántas capas dibuja el cuadradito y su alto en px (más capas = más finas) */
		capas: number;
		alto: number;
	}

	const niveles: NivelDetalle[] = [
		{
			nombre: 'Muy detallado',
			texto: 'Miniaturas, figuras chicas y textos pequeños. Lleva más tiempo.',
			capas: 7,
			alto: 2
		},
		{
			nombre: 'Normal',
			texto: 'La mayoría de las piezas: buen detalle, buen tiempo.',
			capas: 4,
			alto: 5
		},
		{
			nombre: 'Grande y rápido',
			texto: 'Piezas grandes y robustas, en menos tiempo. Menos detalle fino.',
			capas: 2,
			alto: 12
		}
	];

	const coloresMulticolor = ['cobalto', 'tomate', 'mantequilla', 'menta'];

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
				<p class="eyebrow colores-titulo">Colores</p>
				<ul class="sws" aria-label="Colores en {material.nombre}">
					{#each material.colores as color (color.id)}
						<ColorSwatch {color} />
					{/each}
				</ul>
			</Card>
		{/each}
	</div>
	<p class="nota">Los agotados vuelven a entrar. Preguntanos por WhatsApp.</p>

	<Card class="flex flex-wrap items-center gap-x-7 gap-y-3.5 px-7 py-6 max-desk:px-4 max-desk:py-5">
		<div class="puntos" aria-hidden="true">
			{#each coloresMulticolor as c (c)}
				<span class="punto" style:background="var(--color-{c})"></span>
			{/each}
		</div>
		<h3 class="extra-h">Hasta 4 colores en una misma pieza.</h3>
		<p class="nota">Sin pintar: los colores salen así de la impresora.</p>
	</Card>

	<Card class="flex flex-col gap-3.5 px-7 py-6 max-desk:px-4 max-desk:py-5">
		<h3 class="extra-h">¿Cuánto detalle necesitás?</h3>
		<ul class="niveles">
			{#each niveles as nivel (nivel.nombre)}
				<li class="nivel">
					<span class="capas" aria-hidden="true">
						{#each { length: nivel.capas } as _, i (i)}
							<span class="capa" style:height="{nivel.alto}px"></span>
						{/each}
					</span>
					<div class="nivel-texto">
						<strong class="nivel-nombre">{nivel.nombre}</strong>
						<span class="nivel-desc">{nivel.texto}</span>
					</div>
				</li>
			{/each}
		</ul>
		<p class="nota">Te recomendamos uno cuando nos mandás lo que tenés.</p>
	</Card>

	<p class="relieve">Los cuadros en relieve son en blanco y negro, y vienen con su soporte.</p>
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

	.colores-titulo {
		margin-top: 8px;
	}

	.sws {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 14px 6px;
	}

	.nota {
		color: var(--color-tinta-suave);
	}

	.puntos {
		display: flex;
		padding-left: 8px;
	}

	.punto {
		width: 34px;
		height: 34px;
		margin-left: -8px;
		border-radius: 50%;
		border: var(--border);
	}

	.extra-h {
		margin: 0;
		font-family: var(--font-display);
		font-size: 30px;
		line-height: 1.1;
		font-weight: 700;
	}

	.niveles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}

	.nivel {
		min-width: 0;
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 14px;
		border-radius: var(--radius-md);
		background: var(--color-crema);
	}

	/* Cuadradito con líneas de capa: más finas = más detalle */
	.capas {
		flex: none;
		width: 56px;
		height: 56px;
		padding: 6px;
		border-radius: 14px;
		border: var(--border);
		background: var(--color-blanco);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 3px;
	}

	.capa {
		border-radius: 3px;
		background: var(--color-cobalto);
	}

	.nivel-texto {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.nivel-nombre {
		font-family: var(--font-display);
		font-size: 20px;
		line-height: 1.1;
	}

	.nivel-desc {
		font-size: 14px;
		color: var(--color-tinta-suave);
	}

	.relieve {
		padding: 14px 18px;
		border-radius: var(--radius-md);
		border: var(--border);
		background: var(--color-blanco);
		font-weight: 500;
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

		.niveles {
			grid-template-columns: 1fr;
		}

		/* Grilla en vez de flex: cuatro por fila a 375 px sin que las etiquetas "Agotado" se pisen */
		.sws {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
		}
	}
</style>

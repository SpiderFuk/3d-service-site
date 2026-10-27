<script lang="ts">
	/**
	 * Precio y plazos (#precios), BUILD.md sección 07
	 *
	 * Solo lo que mueve el precio: sin precios ni precio mínimo en ningún lado.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import PriceChip from '$lib/components/landing/PriceChip.svelte';

	interface Factor {
		titulo: string;
		linea: string;
	}

	const factoresPiezas: Factor[] = [
		{ titulo: 'Tamaño', linea: 'Cuanto más grande, más material lleva.' },
		{ titulo: 'Material', linea: 'PLA y PETG tienen distinto costo.' },
		{ titulo: 'Detalle', linea: 'Acabado fino o normal, vos elegís.' },
		{ titulo: 'Colores', linea: 'Una pieza multicolor suma al precio.' },
		{ titulo: 'Cantidad', linea: 'Varias piezas iguales.' }
	];

	const factoresCuadros: Factor[] = [
		{ titulo: 'Tamaño', linea: 'El que vos quieras: el precio va con la medida.' },
		{
			titulo: 'Copias',
			linea: 'La primera incluye preparar la foto; las copias, solo la impresión.'
		},
		{ titulo: 'Soporte', linea: 'Siempre incluido, sin costo extra.' }
	];

	interface Plazo {
		titulo: string;
		valor: string;
		texto: string;
	}

	const plazos: Plazo[] = [
		{
			titulo: 'Plazo',
			valor: '24 a 48 h',
			texto:
				'En la mayoría de los pedidos. Piezas grandes, multicolor o en cantidad: te decimos el plazo junto con el precio.'
		},
		{
			titulo: 'Entrega',
			valor: 'Retiro o envío',
			texto:
				'Retirás en Montevideo o Las Piedras, o te lo enviamos a tu casa. El día, la hora y el envío los coordinamos por WhatsApp.'
		}
	];
</script>

<Section id="precios">
	<SectionHeading
		id="precios-titulo"
		eyebrow="Precio y plazos"
		primera="Cada pieza,"
		segunda="su precio."
	/>

	<div class="pgrid">
		<article class="pcard">
			<h3 class="pcard-h">Piezas</h3>
			<p class="pcard-sub">Lo que mueve el precio:</p>
			<ul class="factores factores-2">
				{#each factoresPiezas as f (f.titulo)}
					<PriceChip titulo={f.titulo} linea={f.linea} />
				{/each}
			</ul>
		</article>

		<article class="pcard">
			<h3 class="pcard-h">Cuadros en relieve</h3>
			<p class="pcard-sub">En blanco y negro. Lo que mueve el precio:</p>
			<ul class="factores">
				{#each factoresCuadros as f (f.titulo)}
					<PriceChip titulo={f.titulo} linea={f.linea} />
				{/each}
			</ul>
		</article>

		<!-- Plazo y Entrega: dos filas iguales que juntas miden lo mismo que las tarjetas -->
		<div class="pside">
			{#each plazos as caja (caja.titulo)}
				<div class="pbox">
					<div class="pbox-cabeza">
						<h3 class="pbox-k">{caja.titulo}</h3>
						<p class="pbox-v">{caja.valor}</p>
					</div>
					<p class="pbox-t">{caja.texto}</p>
				</div>
			{/each}
		</div>
	</div>
</Section>

<style>
	p {
		margin: 0;
	}

	.pgrid {
		margin-top: 28px;
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 0.75fr);
		gap: 24px;
		align-items: stretch;
	}

	.pcard {
		min-width: 0;
		padding: 24px;
		border: var(--border);
		border-radius: var(--radius-lg);
		background: var(--color-blanco);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.pcard-h {
		margin: 0;
		font-family: var(--font-display);
		font-size: 28px;
		line-height: 1.1;
		font-weight: 700;
	}

	.pcard-sub {
		color: var(--color-tinta-suave);
	}

	.factores {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
	}

	.factores-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	/* Columna lateral: grid de dos filas 1fr, sin medir con JS */
	.pside {
		display: grid;
		grid-template-rows: 1fr 1fr;
		gap: 16px;
	}

	.pbox {
		min-width: 0;
		padding: 18px 20px;
		border: var(--border);
		border-radius: var(--radius-md);
		background: var(--color-blanco);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 4px;
	}

	.pbox-cabeza {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	/* h3 con aspecto de etiqueta (como el eyebrow) */
	.pbox-k {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-tinta-suave);
	}

	.pbox-v {
		font-family: var(--font-display);
		font-size: 28px;
		line-height: 1;
		font-weight: 800;
		letter-spacing: -0.03em;
	}

	.pbox-t {
		font-size: 14px;
		color: var(--color-tinta-suave);
		text-wrap: pretty;
	}

	@media (max-width: 959px) {
		.pgrid {
			grid-template-columns: 1fr;
			margin-top: 4px;
			gap: 12px;
		}

		.pcard {
			padding: 16px;
			border-radius: var(--radius-md);
			gap: 8px;
		}

		.pcard-h {
			font-size: 22px;
		}

		.pcard-sub {
			font-size: 14px;
		}

		.factores,
		.factores-2 {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}
</style>


<script lang="ts">
	/**
	 * 04 Trabajos (#trabajos)
	 *
	 * Cuadros en relieve que ya salieron del taller. Copy exacto de design/landing-v1/BUILD.md.
	 *
	 * Piezas: static/content/data/gallery.json (vía trabajosStore). La destacada se
	 * elige al azar UNA vez por visita, antes del primer render, con la lista del
	 * bundle; se guarda su id, así no cambia si después llega la copia remota.
	 */
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import TrabajoDestacado from './TrabajoDestacado.svelte';
	import TrabajoPieza from './TrabajoPieza.svelte';
	import { contactInfo } from '$lib/config/contact';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { trabajosStore, loadTrabajos } from '$lib/stores/trabajosStore';
	import { armarGaleria, elegirDestacado } from '$lib/utils/galeria';

	const idDestacado = elegirDestacado(get(trabajosStore).trabajos);
	const galeria = $derived(armarGaleria($trabajosStore.trabajos, idDestacado));

	onMount(() => {
		loadTrabajos();
	});
</script>

<Section id="trabajos">
	<p class="eyebrow">Trabajos</p>
	<div class="cabecera">
		<div class="titulo">
			<SectionHeading id="trabajos-titulo" primera="Cada cuadro," segunda="una historia." />
			<p class="linea">Cuadros en relieve que ya salieron del taller.</p>
		</div>
		<a class="instagram" href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener"
			>Ver más en Instagram</a
		>
	</div>

	{#if galeria}
		<!-- La destacada va primero: ocupa 2 × 2 y las 4 chicas llenan el resto, sin huecos -->
		<ul class="galeria">
			<TrabajoDestacado trabajo={galeria.destacado} />
			{#each galeria.resto as trabajo (trabajo.id)}
				<TrabajoPieza {trabajo} />
			{/each}
		</ul>
	{/if}

	<!-- Franja de cierre: en teléfono el texto arriba y el botón a todo el ancho -->
	<Card
		radius="tile"
		fondo="mantequilla"
		class="mt-7 flex flex-wrap items-center justify-between gap-x-7 gap-y-4 px-8 py-7 max-desk:flex-col max-desk:items-stretch"
	>
		<p class="cierre">¿Querés el tuyo? Mandanos la foto.</p>
		<Button
			href={whatsappUrl(mensajes.trabajos)}
			aria-label="Quiero el mío, mandar una foto por WhatsApp">Quiero el mío</Button
		>
	</Card>
</Section>

<style>
	/* Titular + línea a la izquierda, link a Instagram abajo a la derecha */
	.cabecera {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 48px;
	}

	.titulo {
		flex: 1 1 520px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.linea {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}

	.instagram {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-size: 17px;
		font-weight: 600;
	}

	.cierre {
		margin: 0;
		font-family: var(--font-display);
		font-size: 30px;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	/* Desktop: 4 columnas, la destacada ocupa 2 columnas y 2 filas */
	.galeria {
		list-style: none;
		margin: 28px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 28px 24px;
		align-items: start;
	}

	.galeria > :global(.destacado) {
		grid-column: span 2;
		grid-row: span 2;
	}

	/* Desktop chico: destacada a todo el ancho (foto a la izquierda), las 4 chicas en una fila */
	@media (min-width: 960px) and (max-width: 1199px) {
		.galeria > :global(.destacado) {
			grid-column: 1 / -1;
			grid-row: auto;
		}
	}

	/* Teléfono: el link va centrado bajo la línea; grilla de 2 columnas, destacada a todo el ancho */
	@media (max-width: 959px) {
		.instagram {
			justify-content: center;
			width: 100%;
		}

		.galeria {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px 12px;
			margin-top: 8px;
		}

		.galeria > :global(.destacado) {
			grid-column: 1 / -1;
			grid-row: auto;
			border-radius: var(--radius-lg);
		}
	}
</style>

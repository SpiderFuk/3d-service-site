<script lang="ts">
	/**
	 * Preguntas (#preguntas): sección 09 de BUILD.md
	 *
	 * Desktop: columna del título a la izquierda, fija (sticky) mientras pasan las
	 * preguntas. 960 a 1199 px y teléfono: título arriba, sin sticky. En el teléfono
	 * el link "Preguntanos por WhatsApp" va después de las preguntas.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { preguntasFrecuentes } from '$lib/config/faq';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	const urlPregunta = whatsappUrl(mensajes.preguntas);
</script>

<!-- El link aparece dos veces (desktop y teléfono); solo una se muestra por vez -->
{#snippet otraPregunta(clase: string)}
	<p class="otra-pregunta {clase}">
		¿Otra pregunta? <a class="otra-pregunta-link" href={urlPregunta} target="_blank" rel="noopener"
			>Preguntanos por WhatsApp</a
		>
	</p>
{/snippet}

<Section id="preguntas" contentClass="preguntas-grid">
	<div class="preguntas-titulo">
		<SectionHeading
			id="preguntas-titulo"
			eyebrow="Preguntas"
			primera="Antes de escribirnos,"
			segunda="capaz ya está acá."
		/>
		{@render otraPregunta('otra-pregunta-desktop')}
	</div>

	<ul class="preguntas-lista">
		{#each preguntasFrecuentes as { pregunta } (pregunta)}
			<li>
				<h3>{pregunta}</h3>
			</li>
		{/each}
	</ul>

	{@render otraPregunta('otra-pregunta-telefono')}
</Section>

<style>
	/* contentClass de Section: el grid de dos columnas */
	:global(.preguntas-grid) {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		column-gap: 64px;
		row-gap: 20px;
		align-items: start;
	}

	/* Fija mientras pasan las preguntas, debajo de la barra */
	.preguntas-titulo {
		position: sticky;
		top: var(--scroll-offset);
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
	}

	.preguntas-lista {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.otra-pregunta {
		margin: 8px 0 0;
		font-size: 17px;
	}

	.otra-pregunta-link {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-weight: 600;
	}

	.otra-pregunta-telefono {
		display: none;
	}

	/* Desktop chico: una columna, título arriba sin sticky */
	@media (min-width: 960px) and (max-width: 1199px) {
		:global(.preguntas-grid) {
			grid-template-columns: 1fr;
		}

		.preguntas-titulo {
			position: static;
		}
	}

	/* Teléfono: una columna; el link pasa abajo de las preguntas */
	@media (max-width: 959px) {
		:global(.preguntas-grid) {
			grid-template-columns: 1fr;
			row-gap: 16px;
		}

		.preguntas-titulo {
			position: static;
			gap: 12px;
		}

		.preguntas-lista {
			gap: 8px;
		}

		.otra-pregunta-desktop {
			display: none;
		}

		.otra-pregunta-telefono {
			display: block;
			margin: 0;
			font-size: 15px;
			text-align: center;
		}
	}
</style>

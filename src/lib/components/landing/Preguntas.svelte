<script lang="ts">
	/**
	 * Preguntas (#preguntas): sección 09 de BUILD.md
	 *
	 * Desktop: columna del título a la izquierda, fija (sticky) mientras pasan las
	 * preguntas. 960 a 1199 px y teléfono: título arriba, sin sticky. En el teléfono
	 * el link "Preguntanos por WhatsApp" va después de las preguntas.
	 *
	 * Acordeón: cada pregunta es un botón dentro de un h3 con aria-expanded y
	 * aria-controls. Se pueden abrir varias a la vez; la primera empieza abierta.
	 * Las respuestas cerradas quedan en el HTML, ocultas con visibility (no con
	 * `hidden`, que no deja animar): fuera del árbol de accesibilidad y del orden de Tab.
	 * Abrir y cerrar anima el alto (grid de 0fr a 1fr) y la opacidad; el + gira
	 * hasta quedar como −. Sin animación con prefers-reduced-motion.
	 *
	 * El JSON-LD FAQPage sale de la misma lista (config/faq.ts) que el acordeón.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { preguntasFrecuentes } from '$lib/config/faq';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { faqJsonLdScript } from '$lib/utils/faqJsonLd';

	const urlPregunta = whatsappUrl(mensajes.preguntas);

	const jsonLd = faqJsonLdScript(preguntasFrecuentes);

	let abiertas = $state(preguntasFrecuentes.map((_, i) => i === 0));
</script>

<svelte:head>
	<!-- JSON-LD FAQPage: JSON propio, con "<" escapado (ver utils/faqJsonLd.ts) -->
	{@html jsonLd}
</svelte:head>

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
			primera="Lo que más"
			segunda="nos preguntan."
		/>
		{@render otraPregunta('otra-pregunta-desktop')}
	</div>

	<ul class="preguntas-lista">
		{#each preguntasFrecuentes as { pregunta, respuesta }, i (pregunta)}
			<li class="pregunta" class:abierta={abiertas[i]}>
				<h3 class="pregunta-titulo">
					<button
						id="pregunta-boton-{i}"
						type="button"
						class="pregunta-boton"
						aria-expanded={abiertas[i]}
						aria-controls="pregunta-respuesta-{i}"
						onclick={() => (abiertas[i] = !abiertas[i])}
					>
						<span>{pregunta}</span>
						<!-- Círculo con + (cerrada) o − (abierta), dibujado con dos barras -->
						<span class="pregunta-circulo" aria-hidden="true">
							<span></span>
							<span class="pregunta-circulo-vertical"></span>
						</span>
					</button>
				</h3>
				<div id="pregunta-respuesta-{i}" class="pregunta-respuesta">
					<div class="pregunta-respuesta-interior">
						<p>{respuesta}</p>
					</div>
				</div>
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

	.pregunta {
		background: var(--color-blanco);
		border: var(--border);
		border-radius: var(--radius-md);
		transition: background-color 0.25s ease;
	}

	.pregunta.abierta {
		background: var(--color-mantequilla);
	}

	.pregunta-titulo {
		margin: 0;
		font: inherit;
	}

	.pregunta-boton {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		width: 100%;
		padding: 18px 22px;
		background: none;
		border: 0;
		/* Radio interno de la fila (20 px menos el borde) para el anillo de foco */
		border-radius: 18px;
		font: inherit;
		font-size: 18px;
		font-weight: 600;
		line-height: 1.3;
		color: var(--color-tinta);
		text-align: left;
		cursor: pointer;
	}

	.pregunta-circulo {
		position: relative;
		flex: none;
		width: 32px;
		height: 32px;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-blanco);
		transition: background-color 0.25s ease;
	}

	.pregunta-circulo span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 14px;
		height: 2.5px;
		border-radius: 2px;
		background: var(--color-tinta);
		transform: translate(-50%, -50%);
		transition:
			transform 0.3s cubic-bezier(0.3, 0.7, 0.2, 1),
			background-color 0.25s ease;
	}

	.pregunta-circulo .pregunta-circulo-vertical {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	/* Abierta: círculo tinta con un menos crema. Las dos barras giran media vuelta
	   y la vertical termina acostada sobre la otra: el + gira hasta ser un − */
	.abierta .pregunta-circulo {
		background: var(--color-tinta);
	}

	.abierta .pregunta-circulo span {
		background: var(--color-crema);
		transform: translate(-50%, -50%) rotate(180deg);
	}

	.abierta .pregunta-circulo .pregunta-circulo-vertical {
		transform: translate(-50%, -50%) rotate(180deg);
	}

	/* Cerrada: alto 0 (fila 0fr), transparente y oculta (visibility cambia al
	   final del cierre y al principio de la apertura, así se ve la animación) */
	.pregunta-respuesta {
		display: grid;
		grid-template-rows: 0fr;
		opacity: 0;
		visibility: hidden;
		transition:
			grid-template-rows 0.3s cubic-bezier(0.3, 0.7, 0.2, 1),
			opacity 0.2s ease,
			visibility 0s linear 0.3s;
	}

	.abierta .pregunta-respuesta {
		grid-template-rows: 1fr;
		opacity: 1;
		visibility: visible;
		transition:
			grid-template-rows 0.3s cubic-bezier(0.3, 0.7, 0.2, 1),
			opacity 0.25s ease 0.05s,
			visibility 0s;
	}

	/* Sin padding propio (con alto 0 se seguiría viendo): el aire va en el párrafo */
	.pregunta-respuesta-interior {
		min-height: 0;
		overflow: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.pregunta,
		.pregunta-circulo,
		.pregunta-circulo span,
		.pregunta-respuesta,
		.abierta .pregunta-respuesta {
			transition: none;
		}
	}

	.pregunta-respuesta p {
		max-width: 40em;
		margin: 0;
		padding: 0 22px 20px;
		font-size: 16px;
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

		.pregunta-boton {
			padding: 14px 16px;
			font-size: 16px;
		}

		.pregunta-circulo {
			width: 28px;
			height: 28px;
		}

		.pregunta-circulo span {
			width: 12px;
		}

		.pregunta-respuesta p {
			padding: 0 16px 16px;
			font-size: 14px;
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

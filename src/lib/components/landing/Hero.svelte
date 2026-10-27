<script lang="ts">
	/**
	 * Hero (#inicio): columna de texto + arte del carrete
	 *
	 * El titular cambia según el horario de atención (abierto / cerrado).
	 * abiertoAhora ya tiene el valor correcto al montar (SSR apagado), así que no parpadea.
	 *
	 * Layout (landing-final.html): flex con wrap; el arte baja debajo del texto cuando no entra.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { abiertoAhora } from '$lib/stores/hoursStore';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	/** Baldosas de datos (BUILD.md, 02 Hero) */
	const datos = [
		{ fondo: 'mantequilla', valor: '24 a 48 h', detalle: 'en la mayoría de los pedidos' },
		{ fondo: 'menta', valor: 'Hasta 25 cm', detalle: 'de alto, ancho y largo' },
		{ fondo: 'tomate', valor: 'Hasta 4 colores', detalle: 'en una misma pieza' }
	] as const;
</script>

<Section id="inicio" class="hero" contentClass="hero-contenido">
	<div class="hero-texto">
		<p class="eyebrow hero-etiqueta">Impresión 3D hecha en Uruguay</p>
		<SectionHeading
			id="inicio-titulo"
			level={1}
			size="xl"
			primera={$abiertoAhora ? 'Capa por capa,' : 'Tu idea,'}
			segunda={$abiertoAhora ? 'tu idea toma forma.' : 'en tus manos.'}
		/>
		<p class="hero-linea">
			Mandanos una foto, un modelo que encontraste o tu archivo, y nosotros lo imprimimos.
		</p>
		<!-- Único botón cobalto en vista: el de la barra aparece cuando este sale de pantalla -->
		<Button
			variant="quote"
			size="lg"
			href={whatsappUrl(mensajes.presupuesto)}
			id="hero-cta"
			class="hero-cta"
			aria-label="Pedir presupuesto por WhatsApp"
		>
			<span class="boton-carrete" aria-hidden="true"><span></span><span></span></span>
			Pedir presupuesto
		</Button>
		<ul class="datos" aria-label="printo en datos">
			{#each datos as dato (dato.valor)}
				<Card as="li" radius="chip" fondo={dato.fondo} class="dato">
					<strong>{dato.valor}</strong>
					<span>{dato.detalle}</span>
				</Card>
			{/each}
		</ul>
	</div>

	<div class="hero-arte"></div>
</Section>

<style>
	/* Padding propio del hero: 72/104 desktop, 32/48 teléfono */
	:global(.hero) {
		--section-pt: 72px;
		--section-pb: 104px;
	}

	:global(.hero-contenido) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 56px 72px;
	}

	.hero-texto {
		flex: 1 1 560px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.hero-etiqueta {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		padding: 8px 16px;
		border: var(--border);
		border-radius: var(--radius-pill);
		background: var(--color-blanco);
	}

	.hero-linea {
		margin: 0;
		max-width: 30em;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}

	.hero-texto :global(.hero-cta) {
		align-self: flex-start;
		/* Menos aire a la izquierda: el carrete ya ocupa ese lugar */
		padding-left: 22px;
	}

	/* Carrete chico del botón: anillos tomate, mantequilla y menta */
	.boton-carrete {
		flex: none;
		position: relative;
		width: 26px;
		height: 26px;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-tomate);
	}

	.boton-carrete span {
		position: absolute;
		inset: 3px;
		border-radius: 50%;
		background: var(--color-mantequilla);
	}

	.boton-carrete span + span {
		inset: 7px;
		background: var(--color-menta);
	}

	.datos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		max-width: 560px;
		margin: 4px 0 0;
		padding: 0;
		list-style: none;
	}

	.datos :global(.dato) {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px 18px;
	}

	.datos strong {
		font-family: var(--font-display);
		font-size: 28px;
		font-weight: 800;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.datos span {
		font-size: 14px;
		font-weight: 500;
		line-height: 1.3;
	}

	.hero-arte {
		flex: 1 1 340px;
		min-width: 0;
		max-width: 440px;
		/* Lugar para la extrusión (30 px abajo y a la derecha) */
		padding: 0 30px 30px 0;
	}

	@media (max-width: 959px) {
		:global(.hero) {
			--section-pt: 32px;
			--section-pb: 48px;
		}

		:global(.hero-contenido) {
			gap: 32px;
		}

		.hero-texto {
			gap: 20px;
		}

		/* Ancho completo en el teléfono */
		.hero-texto :global(.hero-cta) {
			align-self: stretch;
		}

		.datos {
			gap: 8px;
		}

		.datos :global(.dato) {
			gap: 4px;
			padding: 12px 10px;
		}

		.datos strong {
			font-size: 20px;
		}

		.datos span {
			font-size: 12px;
		}

		.hero-arte {
			max-width: 240px;
			padding: 0 20px 20px 0;
		}
	}
</style>

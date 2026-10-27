<script lang="ts">
	/**
	 * Hero (#inicio): columna de texto + arte del carrete
	 *
	 * El titular cambia según el horario de atención (abierto / cerrado).
	 * abiertoAhora ya tiene el valor correcto al montar (SSR apagado), así que no parpadea.
	 *
	 * Layout (landing-final.html): flex con wrap; el arte baja debajo del texto cuando no entra.
	 */
	import { onMount } from 'svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import CarreteChico from './CarreteChico.svelte';
	import { abiertoAhora } from '$lib/stores/hoursStore';
	import { heroCtaVisible } from '$lib/stores/uiStore';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	/** Baldosas de datos (BUILD.md, 02 Hero) */
	const datos = [
		{ fondo: 'mantequilla', valor: '24 a 48 h', detalle: 'en la mayoría de los pedidos' },
		{ fondo: 'menta', valor: 'Hasta 25 cm', detalle: 'de alto, ancho y largo' },
		{ fondo: 'tomate', valor: 'Hasta 4 colores', detalle: 'en una misma pieza' }
	] as const;

	/** Anillos del carrete, de afuera hacia adentro (radio en un viewBox de 100) */
	const anillos = [
		{ r: 38, color: 'tomate' },
		{ r: 29, color: 'mantequilla' },
		{ r: 20, color: 'menta' },
		{ r: 12, color: 'crema' },
		{ r: 5, color: 'cobalto' }
	] as const;

	/**
	 * Visibilidad del botón del Hero → heroCtaVisible (la barra muestra el suyo cuando es false).
	 * El margen superior descuenta la barra fija: un botón tapado por la barra no cuenta como visible.
	 * Se vuelve a crear al cruzar 959 px porque la barra cambia de alto.
	 */
	onMount(() => {
		const boton = document.getElementById('hero-cta');
		if (!boton) return;

		heroCtaVisible.set(true);
		let observer: IntersectionObserver | null = null;

		const observar = () => {
			observer?.disconnect();
			const altoBarra = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
			observer = new IntersectionObserver(
				([entrada]) => heroCtaVisible.set(entrada.isIntersecting),
				{ rootMargin: `-${Math.round(altoBarra)}px 0px 0px 0px` }
			);
			observer.observe(boton);
		};

		const telefono = window.matchMedia('(max-width: 959px)');
		observar();
		telefono.addEventListener('change', observar);

		return () => {
			telefono.removeEventListener('change', observar);
			observer?.disconnect();
			heroCtaVisible.set(false);
		};
	});
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
			<CarreteChico />
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

	<div class="hero-arte">
		<!-- Decorativo: cuadrado cobalto con el carrete; la única extrusión de la vista -->
		<div class="hero-carrete" aria-hidden="true">
			<svg viewBox="0 0 100 100" focusable="false">
				{#each anillos as anillo (anillo.r)}
					<circle
						cx="50"
						cy="50"
						r={anillo.r}
						style:fill="var(--color-{anillo.color})"
						vector-effect="non-scaling-stroke"
					/>
				{/each}
			</svg>
		</div>
	</div>
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

	.hero-carrete {
		aspect-ratio: 1 / 1;
		border: var(--border);
		background: var(--color-cobalto);
		box-shadow: var(--shadow-extrude);
	}

	.hero-carrete svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.hero-carrete circle {
		stroke: var(--color-tinta);
		stroke-width: var(--border-width);
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

		/* Extrusión más corta (20 px) en el teléfono */
		.hero-carrete {
			box-shadow: var(--shadow-extrude-md);
		}
	}
</style>

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
	import { abiertoAhora } from '$lib/stores/hoursStore';
</script>

<Section id="inicio" class="hero" contentClass="hero-contenido">
	<div class="hero-texto">
		<SectionHeading
			id="inicio-titulo"
			level={1}
			size="xl"
			primera={$abiertoAhora ? 'Capa por capa,' : 'Tu idea,'}
			segunda={$abiertoAhora ? 'tu idea toma forma.' : 'en tus manos.'}
		/>
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

		.hero-arte {
			max-width: 240px;
			padding: 0 20px 20px 0;
		}
	}
</style>

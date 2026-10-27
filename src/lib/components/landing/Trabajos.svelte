<script lang="ts">
	/**
	 * 04 Trabajos (#trabajos)
	 *
	 * Cuadros en relieve que ya salieron del taller. Copy exacto de design/landing-v1/BUILD.md.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { contactInfo } from '$lib/config/contact';
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

	/* Teléfono: el link va centrado bajo la línea */
	@media (max-width: 959px) {
		.instagram {
			justify-content: center;
			width: 100%;
		}
	}
</style>

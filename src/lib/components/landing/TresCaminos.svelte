<script lang="ts">
	/**
	 * 03 Tres caminos (#que-imprimimos)
	 *
	 * Imagen, idea o archivo: cada camino lleva a WhatsApp con su propio mensaje.
	 * Copy exacto de design/landing-v1/BUILD.md.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
</script>

<Section id="que-imprimimos">
	<SectionHeading
		id="que-imprimimos-titulo"
		eyebrow="Qué imprimimos"
		primera="Una foto, una idea o un archivo."
		segunda="Elegí por dónde empezar."
	/>
	<p class="linea">Cada camino te lleva a WhatsApp con el mensaje listo.</p>
</Section>

<style>
	.linea {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}
</style>

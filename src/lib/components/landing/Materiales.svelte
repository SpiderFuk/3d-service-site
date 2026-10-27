<script lang="ts">
	/**
	 * Materiales y colores (#materiales), BUILD.md sección 06
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
</script>

<Section id="materiales">
	<SectionHeading
		id="materiales-titulo"
		eyebrow="Materiales y colores"
		primera="Cada pieza,"
		segunda="con el material justo."
	/>
	<p class="linea">Contanos para qué es la pieza y elegimos el material que mejor le va.</p>
</Section>

<style>
	.linea {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}
</style>

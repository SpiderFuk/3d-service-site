<script lang="ts">
	/**
	 * Contacto (#contacto). Placeholder: el contenido se construye en el track
	 * rebrand-faq-contact-footer.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
</script>

<Section
	id="contacto"
	class="on-cobalto border-t bg-cobalto text-crema [--headline-size-phone:40px]"
>
	<SectionHeading
		id="contacto-titulo"
		eyebrow="Contacto"
		primera="Tu próxima pieza"
		segunda="empieza con un hola."
		size="xl"
		acento="mantequilla"
	/>
</Section>

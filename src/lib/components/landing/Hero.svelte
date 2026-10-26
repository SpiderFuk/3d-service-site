<script lang="ts">
	/**
	 * Hero (#inicio). Placeholder: el contenido se construye en el track rebrand-nav-hero.
	 * El titular ya cambia según el horario de atención.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { abiertoAhora } from '$lib/stores/hoursStore';
</script>

<Section id="inicio">
	<SectionHeading
		id="inicio-titulo"
		level={1}
		size="xl"
		primera={$abiertoAhora ? 'Capa por capa,' : 'Tu idea,'}
		segunda={$abiertoAhora ? 'tu idea toma forma.' : 'en tus manos.'}
	/>
</Section>

<script lang="ts">
	/**
	 * Página principal - SPA de impresión 3D
	 */

	import Hero from '$lib/components/sections/Hero.svelte';
	import Services from '$lib/components/sections/Services.svelte';
	import ModelViewer from '$lib/components/sections/ModelViewer.svelte';
	import FilamentColors from '$lib/components/sections/FilamentColors.svelte';
	import Gallery3D from '$lib/components/sections/Gallery3D.svelte';
	import ContactWhatsApp from '$lib/components/sections/ContactWhatsApp.svelte';
</script>

<svelte:head>
	<title>Impresiones 3D Pro - Servicio Profesional de Impresión 3D</title>
	<meta
		name="description"
		content="Servicios profesionales de impresión 3D. Calidad, rapidez y atención personalizada. Múltiples materiales y colores disponibles."
	/>
	<meta name="keywords" content="impresión 3D, PLA, PETG, ABS, TPU, prototipado, diseño 3D" />
</svelte:head>

<Hero />
<Services />
<ModelViewer />
<FilamentColors />
<Gallery3D />
<ContactWhatsApp />

<script lang="ts">
	/**
	 * Página principal - SPA de impresión 3D
	 *
	 * Las secciones se muestran/ocultan según la configuración en:
	 * src/lib/config/sections.ts
	 */

	import Hero from '$lib/components/sections/Hero.svelte';
	import Services from '$lib/components/sections/Services.svelte';
	import ModelViewer from '$lib/components/sections/ModelViewer.svelte';
	import FilamentColors from '$lib/components/sections/FilamentColors.svelte';
	import Gallery3D from '$lib/components/sections/Gallery3D.svelte';
	import ContactWhatsApp from '$lib/components/sections/ContactWhatsApp.svelte';
	import { secciones } from '$lib/config/sections';
</script>

<svelte:head>
	<title>Impresiones 3D Pro - Servicio Profesional de Impresión 3D</title>
	<meta
		name="description"
		content="Servicios profesionales de impresión 3D. Calidad, rapidez y atención personalizada. Múltiples materiales y colores disponibles."
	/>
	<meta name="keywords" content="impresión 3D, PLA, PETG, ABS, TPU, prototipado, diseño 3D" />
</svelte:head>

{#if secciones.hero.habilitada}
	<Hero />
{/if}

{#if secciones.services.habilitada}
	<Services />
{/if}

{#if secciones.modelViewer.habilitada}
	<ModelViewer />
{/if}

{#if secciones.filamentColors.habilitada}
	<FilamentColors />
{/if}

{#if secciones.gallery.habilitada}
	<Gallery3D />
{/if}

{#if secciones.contact.habilitada}
	<ContactWhatsApp />
{/if}

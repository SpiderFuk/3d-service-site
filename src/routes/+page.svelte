<script lang="ts">
	/**
	 * Página principal - SPA de impresión 3D
	 *
	 * Las secciones se muestran/ocultan según la configuración de feature flags.
	 * Si el flag sections-visibility está enabled, usa configuración de AppConfig.
	 * Si no, usa src/lib/config/sections.ts como fallback.
	 */

	import Hero from '$lib/components/sections/Hero.svelte';
	import Services from '$lib/components/sections/Services.svelte';
	import ModelViewer from '$lib/components/sections/ModelViewer.svelte';
	import FilamentColors from '$lib/components/sections/FilamentColors.svelte';
	import Gallery3D from '$lib/components/sections/Gallery3D.svelte';
	import ContactWhatsApp from '$lib/components/sections/ContactWhatsApp.svelte';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { isSeccionVisible } from '$lib/utils/visibilityHelpers';
</script>

<svelte:head>
	<title>Impresiones 3D Pro - Servicio Profesional de Impresión 3D</title>
	<meta
		name="description"
		content="Servicios profesionales de impresión 3D. Calidad, rapidez y atención personalizada. Múltiples materiales y colores disponibles."
	/>
	<meta name="keywords" content="impresión 3D, PLA, PETG, ABS, TPU, prototipado, diseño 3D" />
</svelte:head>

{#if isSeccionVisible('hero', $sectionsVisibilityFlag)}
	<Hero />
{/if}

{#if isSeccionVisible('services', $sectionsVisibilityFlag)}
	<Services />
{/if}

{#if isSeccionVisible('modelViewer', $sectionsVisibilityFlag)}
	<ModelViewer />
{/if}

{#if isSeccionVisible('filamentColors', $sectionsVisibilityFlag)}
	<FilamentColors />
{/if}

{#if isSeccionVisible('gallery', $sectionsVisibilityFlag)}
	<Gallery3D />
{/if}

{#if isSeccionVisible('contact', $sectionsVisibilityFlag)}
	<ContactWhatsApp />
{/if}

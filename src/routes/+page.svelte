<script lang="ts">
	/**
	 * Página principal - SPA de impresión 3D
	 *
	 * Las secciones se muestran/ocultan según la configuración de feature flags.
	 * Si el flag sections-visibility está enabled, usa configuración de AppConfig.
	 * Si no, usa src/lib/config/sections.ts como fallback.
	 *
	 * Titulo y meta tags viven en src/app.html (ssr = false: los crawlers no ejecutan JS).
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

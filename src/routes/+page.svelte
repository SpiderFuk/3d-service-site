<script lang="ts">
	/**
	 * Página principal: landing v1 (design/landing-v1/BUILD.md)
	 *
	 * Las secciones se muestran/ocultan según la configuración de feature flags.
	 * Si el flag sections-visibility está enabled, usa configuración de AppConfig.
	 * Si no, usa src/lib/config/sections.ts como fallback.
	 */

	import Navegacion from '$lib/components/landing/Navegacion.svelte';
	import Hero from '$lib/components/landing/Hero.svelte';
	import TresCaminos from '$lib/components/landing/TresCaminos.svelte';
	import Trabajos from '$lib/components/landing/Trabajos.svelte';
	import ComoFunciona from '$lib/components/landing/ComoFunciona.svelte';
	import Materiales from '$lib/components/landing/Materiales.svelte';
	import Precios from '$lib/components/landing/Precios.svelte';
	import Visor from '$lib/components/landing/Visor.svelte';
	import Preguntas from '$lib/components/landing/Preguntas.svelte';
	import Contacto from '$lib/components/landing/Contacto.svelte';
	import Pie from '$lib/components/landing/Pie.svelte';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { isSeccionVisible } from '$lib/utils/visibilityHelpers';
</script>

<svelte:head>
	<!-- Provisorio: el SEO final (OG, JSON-LD) se hace en el track rebrand-cleanup-qa -->
	<title>printo · Impresión 3D hecha en Uruguay</title>
	<meta
		name="description"
		content="Mandanos una foto, un modelo que encontraste o tu archivo, y nosotros lo imprimimos. Impresión 3D en Montevideo y Las Piedras."
	/>
</svelte:head>

{#if isSeccionVisible('navegacion', $sectionsVisibilityFlag)}
	<Navegacion />
{/if}

<main id="contenido" tabindex="-1">
	{#if isSeccionVisible('hero', $sectionsVisibilityFlag)}
		<Hero />
	{/if}

	{#if isSeccionVisible('tresCaminos', $sectionsVisibilityFlag)}
		<TresCaminos />
	{/if}

	{#if isSeccionVisible('trabajos', $sectionsVisibilityFlag)}
		<Trabajos />
	{/if}

	{#if isSeccionVisible('comoFunciona', $sectionsVisibilityFlag)}
		<ComoFunciona />
	{/if}

	{#if isSeccionVisible('materiales', $sectionsVisibilityFlag)}
		<Materiales />
	{/if}

	{#if isSeccionVisible('precios', $sectionsVisibilityFlag)}
		<Precios />
	{/if}

	{#if isSeccionVisible('visor', $sectionsVisibilityFlag)}
		<Visor />
	{/if}

	{#if isSeccionVisible('preguntas', $sectionsVisibilityFlag)}
		<Preguntas />
	{/if}

	{#if isSeccionVisible('contacto', $sectionsVisibilityFlag)}
		<Contacto />
	{/if}
</main>

{#if isSeccionVisible('pie', $sectionsVisibilityFlag)}
	<Pie />
{/if}

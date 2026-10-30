<script lang="ts">
	/**
	 * Layout principal de la aplicación
	 *
	 * El link "Saltar al contenido" va primero para ser el primer elemento con foco.
	 * La página define <main id="contenido">.
	 */

	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import '../app.css';
	import { featureFlagsStore } from '$lib/stores/featureFlagsStore';
	import { loadMaterials } from '$lib/stores/materialsStore';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	// Inicializar polling de feature flags y carga de materiales
	onMount(() => {
		// Iniciar polling cada 5 minutos (300000ms)
		featureFlagsStore.startPolling(300000);
		loadMaterials();
	});

	// CRÍTICO: Detener polling para prevenir memory leaks
	onDestroy(() => {
		featureFlagsStore.stopPolling();
	});
</script>

<a class="skip-link" href="#contenido">Saltar al contenido</a>

{@render children?.()}

<style>
	.skip-link {
		position: absolute;
		left: 16px;
		top: -80px;
		z-index: 30;
		display: inline-flex;
		align-items: center;
		height: var(--tap-min);
		padding: 0 20px;
		border-radius: var(--radius-pill);
		background: var(--color-tinta);
		color: var(--color-crema);
		font-weight: 600;
		text-decoration: none;
	}

	.skip-link:focus {
		top: 12px;
	}
</style>

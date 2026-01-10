<script lang="ts">
	/**
	 * Layout principal de la aplicación
	 */

	import { onMount, onDestroy } from 'svelte';
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import OutOfServiceModal from '$lib/components/ui/OutOfServiceModal.svelte';
	import OutOfServiceBanner from '$lib/components/ui/OutOfServiceBanner.svelte';
	import { featureFlagsStore } from '$lib/stores/featureFlagsStore';
	import { outOfServiceUI } from '$lib/stores/uiStore';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();

	// Inicializar polling de feature flags
	onMount(() => {
		// Iniciar polling cada 5 minutos (300000ms)
		featureFlagsStore.startPolling(300000);
	});

	// CRÍTICO: Detener polling para prevenir memory leaks
	onDestroy(() => {
		featureFlagsStore.stopPolling();
	});

	// Valores reactivos desde el derived store
	let showModal = $derived($outOfServiceUI.showModal);
	let showBanner = $derived($outOfServiceUI.showBanner);
</script>

<div class="min-h-screen flex flex-col">
	<Navbar />

	{#if showBanner}
		<OutOfServiceBanner />
	{/if}

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />
</div>

{#if showModal}
	<OutOfServiceModal />
{/if}

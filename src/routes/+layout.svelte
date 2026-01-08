<script lang="ts">
	/**
	 * Layout principal de la aplicación
	 */

	import { onMount } from 'svelte';
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import OutOfServiceModal from '$lib/components/ui/OutOfServiceModal.svelte';
	import OutOfServiceBanner from '$lib/components/ui/OutOfServiceBanner.svelte';
	import { uiStore } from '$lib/stores/uiStore';
	import { isOutOfServiceEnabled } from '$lib/config/outOfServiceConfig';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();

	// Inicializa el estado de notificación desde localStorage
	onMount(() => {
		if (isOutOfServiceEnabled()) {
			uiStore.initOutOfServiceState();
		}
	});

	// Valores reactivos derivados
	let showModal = $derived(isOutOfServiceEnabled() && $uiStore.showOutOfServiceModal);

	let showBanner = $derived(isOutOfServiceEnabled() && $uiStore.showOutOfServiceBanner);
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

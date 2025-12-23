<script lang="ts">
	/**
	 * Layout principal de la aplicación
	 */

	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	interface Props {
		children?: any;
	}

	let { children }: Props = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Navbar />

	<main class="flex-1">
		{@render children?.()}
	</main>

	<Footer />
</div>

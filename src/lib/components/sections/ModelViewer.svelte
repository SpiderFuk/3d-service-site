<script lang="ts">
	/**
	 * Sección del visor de modelos 3D
	 */

	import { onMount } from 'svelte';
	import { MessageCircle } from 'lucide-svelte';
	import ThreeCanvas from '../viewer/ThreeCanvas.svelte';
	import FileUploader from '../viewer/FileUploader.svelte';
	import ModelInfo from '../viewer/ModelInfo.svelte';
	import ModelThumbnails from '../viewer/ModelThumbnails.svelte';
	import Button from '../ui/Button.svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { loadPlaceholder } from '$lib/three/placeholderLoader';

	// Modelos de ejemplo
	const exampleModels = [
		{
			id: 'santa',
			name: 'Santa borracho',
			description: 'Navidad',
			file: '/models/DrunkSanta.stl'
		},
		{
			id: 'mini',
			name: 'Miniatura',
			description: 'Mini para juegos de mesa',
			file: '/models/mini.stl'
		},
		{
			id: 'vase',
			name: 'Jarrón',
			description: 'Decorativo',
			file: '/models/FlowerVase.stl'
		},
		{
			id: 'dice-tower',
			name: 'Dice Tower',
			description: 'Modelo grande',
			file: '/models/DiceTower.stl'
		},
	];

	let modelInfo = $derived($modelStore.modelInfo);

	function handleQuote() {
		openWhatsApp({ modelInfo: modelInfo || undefined });
	}

	onMount(() => {
		loadPlaceholder();
	});
</script>

<section id="viewer" class="py-20 bg-background">
	<div class="container mx-auto px-4 md:px-16">
		<div class="text-center mb-12">
			<p class="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-secondary mb-3">
				Visor 3D
			</p>
			<h2 class="text-3xl md:text-5xl text-text mb-4">Mirá tu modelo en 3D</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Cargá tu modelo o seleccioná uno de ejemplo para visualizarlo en 3D
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<!-- Canvas 3D (ocupa 2 columnas) -->
			<div class="lg:col-span-2 relative">
				<div class="bg-crema border-2 border-tinta rounded-brand-xl overflow-hidden h-[500px] lg:h-[600px]">
					<ThreeCanvas autoRotate={$modelStore.fileName === null} />
				</div>

				<!-- Mensaje indicativo para placeholder -->
				{#if $modelStore.fileName === null && !$modelStore.isLoading}
					<div class="absolute inset-x-0 top-8 flex justify-center pointer-events-none">
						<div class="bg-white border-2 border-tinta px-5 py-2 rounded-full">
							<p class="text-sm font-medium text-tinta text-center">
								Cargá tu modelo o seleccioná uno de ejemplo
							</p>
						</div>
					</div>
				{/if}
			</div>

			<!-- Controles (1 columna) -->
			<div class="space-y-6">
				<FileUploader />

				{#if modelInfo}
					<ModelInfo />

					<Button
						variant="whatsapp"
						size="lg"
						fullWidth
						onclick={handleQuote}
					>
						<MessageCircle size={20} />
						Cotizar este modelo
					</Button>
				{/if}
			</div>
		</div>

		<!-- Miniaturas de modelos -->
		<ModelThumbnails models={exampleModels} />
	</div>
</section>

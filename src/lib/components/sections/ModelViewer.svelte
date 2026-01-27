<script lang="ts">
	/**
	 * Sección del visor de modelos 3D
	 */

	import { onMount } from 'svelte';
	import { MessageCircle } from 'lucide-svelte';
	import { Mesh } from 'three';
	import ThreeCanvas from '../viewer/ThreeCanvas.svelte';
	import FileUploader from '../viewer/FileUploader.svelte';
	import ModelInfo from '../viewer/ModelInfo.svelte';
	import ModelThumbnails from '../viewer/ModelThumbnails.svelte';
	import Button from '../ui/Button.svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { OBJLoaderAdapter } from '$lib/loaders/OBJLoaderAdapter';
	import type { Object3D } from 'three';

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

	/**
	 * Mejora materiales para mejor visualización
	 * Aumenta emisión y ajusta propiedades para colores más vibrantes
	 */
	function enhanceMaterials(object: Object3D) {
		object.traverse((child) => {
			if (child instanceof Mesh) {
				const materials = Array.isArray(child.material) ? child.material : [child.material];
				materials.forEach((material: any) => {
					if (material.color && material.emissive !== undefined) {
						const color = material.color.clone();
						const brightness = (color.r + color.g + color.b) / 3;

						// Emisión más fuerte para colores claros (blancos y grises claros)
						material.emissive = color.clone();

						// Aumentar intensidad emisiva especialmente para colores claros
						// Colores con brightness > 0.5 reciben boost adicional
						if (brightness > 0.5) {
							material.emissiveIntensity = 0.6 + (brightness * 0.4); // 0.6-1.0 para claros
						} else {
							material.emissiveIntensity = brightness * 0.5; // 0-0.5 para oscuros
						}

						material.metalness = 0.1;
						material.roughness = 0.4;
					}
				});
			}
		});
	}

	/**
	 * Carga el logo como placeholder inicial
	 */
	async function loadPlaceholder() {
		try {
			modelStore.setLoading(true);

			const loader = new OBJLoaderAdapter();
			const logoModel = await loader.loadFromURL('/logo/logo.obj', '/logo/logo.mtl');

			// Mejorar materiales para mejor visualización
			enhanceMaterials(logoModel);

			modelStore.setPlaceholder(logoModel);
			loader.dispose();
		} catch (err) {
			console.warn('No se pudo cargar placeholder:', err);
			// No mostrar error al usuario, el canvas quedará vacío
		} finally {
			modelStore.setLoading(false);
		}
	}

	onMount(() => {
		loadPlaceholder();
	});
</script>

<section id="viewer" class="py-20 bg-background">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
				Visor 3D Interactivo
			</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Cargá tu modelo o seleccioná uno de ejemplo para visualizarlo en 3D
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
			<!-- Canvas 3D (ocupa 2 columnas) -->
			<div class="lg:col-span-2 relative">
				<div class="bg-background-secondary rounded-lg overflow-hidden shadow-lg h-[500px] lg:h-[600px]">
					<ThreeCanvas autoRotate={$modelStore.fileName === null} />
				</div>

				<!-- Mensaje indicativo para placeholder -->
				{#if $modelStore.fileName === null && !$modelStore.isLoading}
					<div class="absolute inset-x-0 top-8 flex justify-center pointer-events-none">
						<div class="bg-background/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
							<p class="text-sm text-text-secondary text-center">
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
						Cotizar este Modelo
					</Button>
				{/if}
			</div>
		</div>

		<!-- Miniaturas de modelos -->
		<ModelThumbnails models={exampleModels} />
	</div>
</section>

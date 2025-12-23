<script lang="ts">
	/**
	 * Miniaturas de modelos predefinidos
	 */

	import { onMount } from 'svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { ModelLoaderFactory } from '$lib/loaders/ModelLoaderFactory';
	import Card from '../ui/Card.svelte';
	import ModelThumbnailPreview from './ModelThumbnailPreview.svelte';

	interface PreloadedModel {
		id: string;
		name: string;
		description: string;
		file: string;
		thumbnail?: string;
	}

	interface Props {
		models: PreloadedModel[];
	}

	let { models }: Props = $props();
	let selectedId = $state<string | null>(null);
	let loadedPreviews = $state<Record<string, any>>({});
	let isLoadingPreviews = $state(true);

	// Precargar modelos para previsualizaciones
	onMount(async () => {
		const loadPromises = models.map(async (model) => {
			try {
				const response = await fetch(model.file);
				if (!response.ok) {
					console.warn(`No se pudo obtener ${model.file}`);
					return null;
				}

				const blob = await response.blob();
				const file = new File([blob], model.file.split('/').pop() || 'model.stl');

				const loader = ModelLoaderFactory.getLoader(file.name);
				const object3D = await loader.load(file);

				return { id: model.id, object3D };
			} catch (err) {
				console.warn(`No se pudo precargar el modelo ${model.name}:`, err);
				return null;
			}
		});

		const results = await Promise.all(loadPromises);

		// Actualizar el estado con todos los modelos cargados
		const newPreviews: Record<string, any> = {};
		results.forEach((result) => {
			if (result) {
				newPreviews[result.id] = result.object3D;
			}
		});

		loadedPreviews = newPreviews;
		isLoadingPreviews = false;
	});

	async function loadModel(model: PreloadedModel) {
		modelStore.setLoading(true);
		modelStore.clearError();
		selectedId = model.id;

		try {
			// Si ya tenemos el modelo precargado, clonar y usar
			if (loadedPreviews[model.id]) {
				const loader = ModelLoaderFactory.getLoader(model.file.split('/').pop() || 'model.stl');
				const clonedModel = loadedPreviews[model.id].clone(true); // Deep clone
				const info = loader.getModelInfo(clonedModel);
				modelStore.setModel(clonedModel, info, model.name);
				return;
			}

			// Si no, cargar el archivo desde static
			const response = await fetch(model.file);
			if (!response.ok) throw new Error('No se pudo cargar el modelo');

			const blob = await response.blob();
			const file = new File([blob], model.file.split('/').pop() || 'model.stl');

			// Usar factory para cargar
			const loader = ModelLoaderFactory.getLoader(file.name);
			const object3D = await loader.load(file);
			const info = loader.getModelInfo(object3D);

			modelStore.setModel(object3D, info, model.name);
			loader.dispose();
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Error al cargar el modelo';
			modelStore.setError(errorMessage);
			selectedId = null;
		} finally {
			modelStore.setLoading(false);
		}
	}
</script>

<div class="space-y-3">
	<h3 class="font-bold text-lg text-text">Modelos de Ejemplo</h3>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
		{#each models as model}
			<button
				onclick={() => loadModel(model)}
				class="group"
				disabled={$modelStore.isLoading}
			>
				<Card
					padding="sm"
					shadow={true}
					hover={true}
					class="transition-all {selectedId === model.id
						? 'ring-2 ring-primary'
						: 'group-hover:ring-2 group-hover:ring-primary/50'}"
				>
					<div class="aspect-square bg-background-secondary rounded-lg mb-2 flex items-center justify-center overflow-hidden">
						{#if loadedPreviews[model.id]}
							<ModelThumbnailPreview
								model={loadedPreviews[model.id]}
								class="w-full h-full"
							/>
						{:else if model.thumbnail}
							<img
								src={model.thumbnail}
								alt={model.name}
								class="w-full h-full object-cover rounded-lg"
							/>
						{:else}
							<div class="text-4xl text-text-secondary animate-pulse">3D</div>
						{/if}
					</div>
					<p class="text-sm font-medium text-text truncate">{model.name}</p>
					<p class="text-xs text-text-secondary truncate">{model.description}</p>
				</Card>
			</button>
		{/each}
	</div>
</div>

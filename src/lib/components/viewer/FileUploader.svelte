<script lang="ts">
	/**
	 * Componente para subir archivos 3D
	 */

	import { Upload, X, AlertCircle } from 'lucide-svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { ModelLoaderFactory } from '$lib/loaders/ModelLoaderFactory';
	import { validateFile } from '$lib/utils/fileValidation';
	import { loadPlaceholder } from '$lib/three/placeholderLoader';
	import Button from '../ui/Button.svelte';
	import Card from '../ui/Card.svelte';

	let fileInput: HTMLInputElement | undefined = $state(undefined);
	let isDragging = $state(false);
	let error = $derived($modelStore.error);
	let isLoading = $derived($modelStore.isLoading);

	async function handleFile(file: File) {
		modelStore.clearError();

		// Validar archivo
		const validation = validateFile(file);
		if (!validation.valid) {
			modelStore.setError(validation.error || 'Error de validación');
			return;
		}

		modelStore.setLoading(true);

		try {
			// Cargar modelo usando Factory
			const loader = ModelLoaderFactory.getLoader(file.name);
			const model = await loader.load(file);
			const info = loader.getModelInfo(model);

			// Actualizar store
			modelStore.setModel(model, info, file.name);

			// Limpiar loader
			loader.dispose();
		} catch (err) {
			console.error('Error al cargar archivo 3D:', err);
			const errorMessage = err instanceof Error ? err.message : 'Error al cargar el archivo';
			modelStore.setError(errorMessage);
		} finally {
			modelStore.setLoading(false);
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			handleFile(file);
		}
		// Reset input
		target.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	async function clearModel() {
		modelStore.clearModel();
		modelStore.clearError();

		// Restaurar placeholder
		await loadPlaceholder();
	}

	function openFilePicker() {
		fileInput?.click();
	}
</script>

<Card padding="md">
	{#if $modelStore.fileName}
		<!-- Modelo cargado -->
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-text">Modelo cargado</p>
				<p class="text-xs text-text-secondary truncate">{$modelStore.fileName}</p>
			</div>
			<button
				onclick={clearModel}
				class="w-11 h-11 flex items-center justify-center hover:bg-crema rounded-full transition-colors"
				title="Quitar modelo"
				aria-label="Quitar modelo"
			>
				<X size={20} class="text-text-secondary" />
			</button>
		</div>
	{:else}
		<!-- Zona de carga -->
		<div
			role="region"
			aria-label="Zona de carga de archivos 3D"
			class="border-2 border-dashed rounded-brand-lg p-8 text-center transition-colors {isDragging
				? 'border-primary bg-crema'
				: 'border-tinta-suave'}"
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
		>
			<input
				bind:this={fileInput}
				type="file"
				accept=".stl,.3mf"
				class="hidden"
				onchange={handleFileSelect}
				disabled={isLoading}
			/>

			<div class="flex flex-col items-center gap-4">
				<div class="p-4 bg-mantequilla rounded-full">
					<Upload size={32} class="text-tinta" />
				</div>

				<div>
					<p class="text-text font-medium mb-1">
						{#if isLoading}
							Cargando modelo...
						{:else}
							Arrastrá tu archivo acá
						{/if}
					</p>
					<p class="text-sm text-text-secondary">o</p>
				</div>

				<Button variant="primary" onclick={openFilePicker} disabled={isLoading}>
					Elegir archivo
				</Button>

				<p class="text-xs text-text-secondary">Formato recomendado: STL • También acepta 3MF • Máximo: 50MB</p>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-brand flex items-start gap-2">
			<AlertCircle size={20} class="text-red-600 flex-shrink-0 mt-0.5" />
			<p class="text-sm text-red-800">{error}</p>
		</div>
	{/if}
</Card>

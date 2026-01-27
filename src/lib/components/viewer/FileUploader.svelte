<script lang="ts">
	/**
	 * Componente para subir archivos 3D
	 */

	import { Upload, X, AlertCircle } from 'lucide-svelte';
	import { Mesh } from 'three';
	import { modelStore } from '$lib/stores/modelStore';
	import { ModelLoaderFactory } from '$lib/loaders/ModelLoaderFactory';
	import { OBJLoaderAdapter } from '$lib/loaders/OBJLoaderAdapter';
	import { validateFile, formatFileSize } from '$lib/utils/fileValidation';
	import Button from '../ui/Button.svelte';
	import Card from '../ui/Card.svelte';
	import type { Object3D } from 'three';

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

	/**
	 * Mejora materiales para mejor visualización del logo
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

	async function clearModel() {
		modelStore.clearModel();
		modelStore.clearError();

		// Restaurar placeholder
		try {
			modelStore.setLoading(true);
			const loader = new OBJLoaderAdapter();
			const logoModel = await loader.loadFromURL('/logo/logo.obj', '/logo/logo.mtl');

			// Mejorar materiales para mejor visualización
			enhanceMaterials(logoModel);

			modelStore.setPlaceholder(logoModel);
			loader.dispose();
		} catch (err) {
			console.warn('No se pudo restaurar placeholder:', err);
		} finally {
			modelStore.setLoading(false);
		}
	}

	function openFilePicker() {
		fileInput?.click();
	}
</script>

<Card padding="md" shadow={true}>
	{#if $modelStore.fileName}
		<!-- Modelo cargado -->
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-text">Modelo cargado</p>
				<p class="text-xs text-text-secondary truncate">{$modelStore.fileName}</p>
			</div>
			<button
				onclick={clearModel}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				title="Quitar modelo"
			>
				<X size={20} class="text-text-secondary" />
			</button>
		</div>
	{:else}
		<!-- Zona de carga -->
		<div
			role="region"
			aria-label="Zona de carga de archivos 3D"
			class="border-2 border-dashed rounded-lg p-8 text-center transition-colors {isDragging
				? 'border-primary bg-primary/5'
				: 'border-gray-300'}"
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
				<div class="p-4 bg-primary/10 rounded-full">
					<Upload size={32} class="text-primary" />
				</div>

				<div>
					<p class="text-text font-medium mb-1">
						{#if isLoading}
							Cargando modelo...
						{:else}
							Arrastra tu archivo aquí
						{/if}
					</p>
					<p class="text-sm text-text-secondary">o</p>
				</div>

				<Button variant="primary" onclick={openFilePicker} disabled={isLoading}>
					Seleccionar Archivo
				</Button>

				<p class="text-xs text-text-secondary">Formato recomendado: STL • También acepta 3MF • Máximo: 50MB</p>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
			<AlertCircle size={20} class="text-red-600 flex-shrink-0 mt-0.5" />
			<p class="text-sm text-red-800">{error}</p>
		</div>
	{/if}
</Card>

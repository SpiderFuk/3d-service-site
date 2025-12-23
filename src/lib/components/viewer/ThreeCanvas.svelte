<script lang="ts">
	/**
	 * Canvas de Three.js para renderizar modelos 3D
	 */

	import { onMount, onDestroy } from 'svelte';
	import { modelStore } from '$lib/stores/modelStore';
	import { createScene } from '$lib/three/sceneSetup';
	import type { SceneContext } from '$lib/three/sceneSetup';

	interface Props {
		autoRotate?: boolean;
		enableShadows?: boolean;
		class?: string;
	}

	let { autoRotate = false, enableShadows = true, class: className = '' }: Props = $props();

	let container: HTMLElement;
	let sceneContext: SceneContext | null = null;

	$effect(() => {
		const model = $modelStore.currentModel;

		if (sceneContext && model) {
			// Limpiar modelo anterior
			sceneContext.clearModels();

			// Agregar nuevo modelo
			sceneContext.addModel(model);

			// Calcular bounding box del modelo
			import('three').then(({ Box3, Vector3 }) => {
				const box = new Box3().setFromObject(model);
				const size = box.getSize(new Vector3());
				const center = box.getCenter(new Vector3());

				// Calcular la diagonal del bounding box
				const maxDim = Math.max(size.x, size.y, size.z);
				const diagonal = Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);

				// Calcular distancia de la cámara basada en el FOV y el tamaño del modelo
				// Usamos el diagonal para asegurar que todo el modelo sea visible
				const fov = sceneContext.camera.fov * (Math.PI / 180);
				const cameraDistance = diagonal / (2 * Math.tan(fov / 2)) * 1.5; // 1.5 para dar margen

				// Posicionar cámara en vista frontal-superior inclinada (mantiene el estilo original)
				const cameraX = cameraDistance * 0.3;
				const cameraY = cameraDistance * 0.5;
				const cameraZ = cameraDistance;

				sceneContext.camera.position.set(cameraX, cameraY, cameraZ);
				sceneContext.controls.target.copy(center);
				sceneContext.controls.update();
			});
		} else if (sceneContext && !model) {
			sceneContext.clearModels();
		}
	});

	onMount(() => {
		if (container) {
			sceneContext = createScene({
				container,
				enableShadows,
				autoRotate
			});
		}
	});

	onDestroy(() => {
		sceneContext?.dispose();
	});
</script>

<div bind:this={container} class="w-full h-full {className}"></div>

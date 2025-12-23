<script lang="ts">
	/**
	 * Mini visor 3D para previsualizaciones de thumbnails
	 */

	import { onMount, onDestroy } from 'svelte';
	import { createScene } from '$lib/three/sceneSetup';
	import type { SceneContext } from '$lib/three/sceneSetup';
	import type { Object3D } from 'three';

	interface Props {
		model: Object3D;
		class?: string;
	}

	let { model, class: className = '' }: Props = $props();

	let container: HTMLElement;
	let sceneContext: SceneContext | null = null;
	let isVisible = $state(false);
	let observer: IntersectionObserver | null = null;

	onMount(() => {
		// Usar IntersectionObserver para renderizar solo cuando es visible
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					isVisible = entry.isIntersecting;

					if (isVisible && !sceneContext && container) {
						// Inicializar escena cuando se hace visible
						sceneContext = createScene({
							container,
							enableShadows: false,
							autoRotate: true,
							autoRotateSpeed: 3.0
						});

						if (model) {
							const clonedModel = model.clone(true); // Deep clone para evitar compartir geometrías
							sceneContext.addModel(clonedModel);

							// Corregir rotación del modelo para mostrar la cara frontal
							// Los modelos vienen rotados 90° en X (transversal) y 90° en Z (frontal)
							// Aplicamos rotación inversa para mostrar la vista frontal correcta
							clonedModel.rotation.x = -Math.PI / 2; // -90° en X (antihorario)
							clonedModel.rotation.z = -Math.PI / 2; // -90° en Z (antihorario)

							// Recalcular normales para iluminación correcta después de rotar
							import('three').then(({ Mesh }) => {
								clonedModel.traverse((child) => {
									if (child instanceof Mesh && child.geometry) {
										child.geometry.computeVertexNormals();
									}
								});
							});

							// Ajustar cámara al modelo
							import('three').then(({ Box3, Vector3 }) => {
								const box = new Box3().setFromObject(clonedModel);
								const size = box.getSize(new Vector3());
								const center = box.getCenter(new Vector3());

								const maxDim = Math.max(size.x, size.y, size.z);
								const distance = maxDim * 2;

								sceneContext!.camera.position.set(distance * 0.5, distance * 0.5, distance);
								sceneContext!.controls.target.copy(center);
								sceneContext!.controls.update();
							});
						}
					} else if (!isVisible && sceneContext) {
						// Limpiar escena cuando ya no es visible (opcional, para ahorrar recursos)
						// sceneContext.dispose();
						// sceneContext = null;
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (container) {
			observer.observe(container);
		}
	});

	onDestroy(() => {
		observer?.disconnect();
		sceneContext?.dispose();
	});
</script>

<div bind:this={container} class="w-full h-full {className}"></div>

/**
 * Adapter para 3MFLoader de Three.js
 */

import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { Box3, Vector3, Mesh } from 'three';
import type { IModelLoader, ModelInfo } from './types';
import type { Object3D } from 'three';

export class ThreeMFLoaderAdapter implements IModelLoader {
	private loader: ThreeMFLoader;
	private loadedObjects: Object3D[] = [];

	constructor() {
		this.loader = new ThreeMFLoader();
	}

	async load(file: File): Promise<Object3D> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				try {
					const contents = event.target?.result;
					if (!contents) {
						throw new Error('No se pudo leer el archivo');
					}

					const object = this.loader.parse(contents as ArrayBuffer);
					this.loadedObjects.push(object);

					// Centrar objeto
					const box = new Box3().setFromObject(object);
					const center = new Vector3();
					box.getCenter(center);
					object.position.sub(center);

					resolve(object);
				} catch (error) {
					console.error('Error al parsear archivo 3MF:', error);
					// El visualizador web no soporta todos los archivos 3MF (ej: Production Extension).
					// El archivo SÍ puede abrirse en slicers como Bambu Studio, PrusaSlicer o Cura.
					reject(
						new Error(
							'Este archivo 3MF usa características no soportadas por el visualizador web. ' +
								'El archivo funciona correctamente en slicers (Bambu Studio, PrusaSlicer, Cura). ' +
								'Para previsualizarlo aquí, expórtalo como STL.'
						)
					);
				}
			};

			reader.onerror = () => reject(new Error('Error al leer el archivo'));
			reader.readAsArrayBuffer(file);
		});
	}

	getModelInfo(object: Object3D): ModelInfo {
		const box = new Box3().setFromObject(object);
		const size = new Vector3();
		box.getSize(size);

		// Convertir de unidades de Three.js a mm
		const dimensions = {
			x: Math.round(size.x * 100) / 100,
			y: Math.round(size.y * 100) / 100,
			z: Math.round(size.z * 100) / 100
		};

		// Volumen aproximado del bounding box en cm³
		const volume = Math.round((size.x * size.y * size.z) / 1000 * 100) / 100;

		// Contar triángulos
		let triangles = 0;
		object.traverse((child) => {
			if (child instanceof Mesh && child.geometry) {
				const positions = child.geometry.attributes.position;
				if (positions) {
					triangles += positions.count / 3;
				}
			}
		});

		return {
			dimensions,
			volume,
			triangles: Math.round(triangles),
			filename: ''
		};
	}

	dispose(): void {
		this.loadedObjects.forEach((obj) => {
			obj.traverse((child) => {
				if (child instanceof Mesh) {
					child.geometry?.dispose();
					if (Array.isArray(child.material)) {
						child.material.forEach((mat) => mat.dispose());
					} else {
						child.material?.dispose();
					}
				}
			});
		});
		this.loadedObjects = [];
	}
}

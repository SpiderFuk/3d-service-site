/**
 * Adapter para STLLoader de Three.js
 */

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { Mesh, MeshStandardMaterial, Box3, Vector3 } from 'three';
import type { IModelLoader, ModelInfo } from './types';
import type { Object3D, BufferGeometry } from 'three';

export class STLLoaderAdapter implements IModelLoader {
	private loader: STLLoader;
	private loadedGeometries: BufferGeometry[] = [];

	constructor() {
		this.loader = new STLLoader();
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

					const geometry = this.loader.parse(contents as ArrayBuffer);
					this.loadedGeometries.push(geometry);

					// Centrar geometría
					geometry.computeBoundingBox();
					const center = new Vector3();
					geometry.boundingBox?.getCenter(center);
					geometry.translate(-center.x, -center.y, -center.z);

					// Crear mesh con material estándar
					const material = new MeshStandardMaterial({
						color: 0x3b82f6,
						metalness: 0.3,
						roughness: 0.6
					});

					const mesh = new Mesh(geometry, material);
					resolve(mesh);
				} catch (error) {
					reject(new Error(`Error al parsear STL: ${error}`));
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

		// Convertir de unidades de Three.js a mm (asumiendo que el modelo está en mm)
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
		this.loadedGeometries.forEach((geometry) => geometry.dispose());
		this.loadedGeometries = [];
	}
}

/**
 * Adapter para OBJLoader de Three.js con soporte para materiales MTL
 */

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { Box3, Vector3, Mesh } from 'three';
import type { IModelLoader, ModelInfo } from './types';
import type { Object3D } from 'three';

export class OBJLoaderAdapter implements IModelLoader {
	private objLoader: OBJLoader;
	private mtlLoader: MTLLoader;
	private loadedObjects: Object3D[] = [];

	constructor() {
		this.objLoader = new OBJLoader();
		this.mtlLoader = new MTLLoader();
	}

	/**
	 * Carga un archivo OBJ desde un File object
	 */
	async load(file: File): Promise<Object3D> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				try {
					const contents = event.target?.result;
					if (!contents) {
						throw new Error('No se pudo leer el archivo');
					}

					const object = this.objLoader.parse(contents as string);
					this.loadedObjects.push(object);

					// Centrar objeto
					this.centerObject(object);

					resolve(object);
				} catch (error) {
					reject(new Error(`Error al parsear OBJ: ${error}`));
				}
			};

			reader.onerror = () => reject(new Error('Error al leer el archivo'));
			reader.readAsText(file);
		});
	}

	/**
	 * Carga un modelo OBJ desde URLs (para assets estáticos)
	 * @param objPath Ruta al archivo .obj
	 * @param mtlPath Ruta opcional al archivo .mtl (materiales)
	 */
	async loadFromURL(objPath: string, mtlPath?: string): Promise<Object3D> {
		try {
			// Si hay archivo MTL, cargarlo primero
			if (mtlPath) {
				try {
					const materials = await this.mtlLoader.loadAsync(mtlPath);
					materials.preload();
					this.objLoader.setMaterials(materials);
				} catch (mtlError) {
					console.warn('No se pudo cargar el archivo MTL, usando material default:', mtlError);
				}
			}

			// Cargar el archivo OBJ
			const object = await this.objLoader.loadAsync(objPath);
			this.loadedObjects.push(object);

			// Centrar objeto
			this.centerObject(object);

			return object;
		} catch (error) {
			throw new Error(`Error al cargar modelo OBJ desde ${objPath}: ${error}`);
		}
	}

	/**
	 * Centra el objeto en el origen usando su bounding box
	 */
	private centerObject(object: Object3D): void {
		const box = new Box3().setFromObject(object);
		const center = new Vector3();
		box.getCenter(center);
		object.position.sub(center);
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
		this.loadedObjects.forEach((obj) => {
			obj.traverse((child) => {
				if (child instanceof Mesh) {
					// Limpiar geometría
					child.geometry?.dispose();

					// Limpiar materiales (puede ser array o material único)
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

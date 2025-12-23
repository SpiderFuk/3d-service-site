/**
 * Interfaces y tipos para el sistema de carga de modelos 3D
 */

import type { Object3D } from 'three';

/**
 * Información del modelo 3D calculada
 */
export interface ModelInfo {
	dimensions: {
		x: number;
		y: number;
		z: number;
	};
	volume: number; // cm³ (aproximado desde bounding box)
	triangles: number;
	filename: string;
}

/**
 * Interfaz que define el contrato para todos los loaders de modelos 3D
 */
export interface IModelLoader {
	/**
	 * Carga un archivo y retorna un Object3D de Three.js
	 */
	load(file: File): Promise<Object3D>;

	/**
	 * Obtiene información del modelo cargado
	 */
	getModelInfo(object: Object3D): ModelInfo;

	/**
	 * Limpia recursos del loader
	 */
	dispose(): void;
}

/**
 * Extensiones soportadas
 */
export const SUPPORTED_EXTENSIONS = ['.stl', '.3mf'] as const;
export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

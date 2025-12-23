/**
 * Factory para crear loaders de modelos 3D según la extensión del archivo
 */

import { STLLoaderAdapter } from './STLLoaderAdapter';
import { ThreeMFLoaderAdapter } from './ThreeMFLoaderAdapter';
import type { IModelLoader } from './types';

export class ModelLoaderFactory {
	/**
	 * Retorna el loader apropiado según la extensión del archivo
	 */
	static getLoader(filename: string): IModelLoader {
		const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));

		switch (extension) {
			case '.stl':
				return new STLLoaderAdapter();
			case '.3mf':
				return new ThreeMFLoaderAdapter();
			default:
				throw new Error(
					`Formato de archivo no soportado: ${extension}. Usa .stl o .3mf`
				);
		}
	}

	/**
	 * Verifica si una extensión es soportada
	 */
	static isSupportedExtension(filename: string): boolean {
		const extension = filename.toLowerCase().slice(filename.lastIndexOf('.'));
		return ['.stl', '.3mf'].includes(extension);
	}
}

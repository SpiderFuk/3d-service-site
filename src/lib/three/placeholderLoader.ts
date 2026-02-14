/**
 * Carga el logo como placeholder para el visor 3D
 */

import { OBJLoaderAdapter } from '$lib/loaders/OBJLoaderAdapter';
import { modelStore } from '$lib/stores/modelStore';
import { enhanceMaterials } from './materialEnhancement';

/**
 * Carga el logo OBJ como placeholder inicial del visor
 */
export async function loadPlaceholder() {
	try {
		modelStore.setLoading(true);

		const loader = new OBJLoaderAdapter();
		const logoModel = await loader.loadFromURL('/logo/logo.obj', '/logo/logo.mtl');

		// Mejorar materiales para mejor visualización
		enhanceMaterials(logoModel);

		modelStore.setPlaceholder(logoModel);
		loader.dispose();
	} catch (err) {
		console.warn('No se pudo cargar placeholder:', err);
	} finally {
		modelStore.setLoading(false);
	}
}

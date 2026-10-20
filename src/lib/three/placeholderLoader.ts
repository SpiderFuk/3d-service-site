/**
 * Carga el logo como placeholder para el visor 3D
 */

import { modelStore } from '$lib/stores/modelStore';
import { createPrintoLogo } from './printoLogo';

/**
 * Muestra la p de printo en 3D como placeholder inicial del visor
 * Se mantiene async para no cambiar la interfaz de quienes lo llaman
 */
export async function loadPlaceholder() {
	try {
		modelStore.setLoading(true);
		modelStore.setPlaceholder(createPrintoLogo());
	} catch (err) {
		console.warn('No se pudo cargar placeholder:', err);
	} finally {
		modelStore.setLoading(false);
	}
}

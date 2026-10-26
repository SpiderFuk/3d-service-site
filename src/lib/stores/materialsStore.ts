/**
 * Stock de filamento (materiales y colores)
 *
 * Único lugar: static/content/data/materials.json. Se incluye en el bundle para
 * mostrarlo al instante y se vuelve a pedir en runtime por si cambió después del deploy.
 */

import { writable } from 'svelte/store';
import { fetchContent } from '$lib/services/contentService';
import type { MaterialsContent, MaterialStock } from '$lib/types/content';
import stockLocal from '../../../static/content/data/materials.json';

const local: MaterialsContent = stockLocal;

interface MaterialsState {
	materials: MaterialsContent['materials'];
	isLoading: boolean;
	isRemote: boolean;
}

const { subscribe, update } = writable<MaterialsState>({
	materials: local.materials,
	isLoading: true,
	isRemote: false
});

export const materialsStore = { subscribe };

function esMaterialValido(m: unknown): m is MaterialStock {
	if (typeof m !== 'object' || m === null) return false;
	const { nombre, disponible, colores } = m as Record<string, unknown>;
	return (
		typeof nombre === 'string' &&
		typeof disponible === 'boolean' &&
		Array.isArray(colores) &&
		colores.every(
			(c) =>
				typeof c?.id === 'string' &&
				typeof c?.nombre === 'string' &&
				typeof c?.hex === 'string' &&
				typeof c?.agotado === 'boolean'
		)
	);
}

/** Valida el JSON (puede venir de otra versión o del futuro admin) antes de usarlo */
export function esStockValido(data: unknown): data is MaterialsContent {
	if (typeof data !== 'object' || data === null) return false;
	const materials = (data as { materials?: Record<string, unknown> }).materials;
	return !!materials && esMaterialValido(materials.pla) && esMaterialValido(materials.petg);
}

export async function loadMaterials(): Promise<void> {
	const content = await fetchContent<unknown>('materials', local);
	const isRemote = content !== local && esStockValido(content);

	update((state) => ({
		...state,
		materials: isRemote ? (content as MaterialsContent).materials : local.materials,
		isLoading: false,
		isRemote
	}));
}

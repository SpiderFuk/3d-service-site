/**
 * Piezas de Trabajos
 *
 * Único lugar: static/content/data/gallery.json. Se incluye en el bundle para
 * mostrar la grilla al instante y se vuelve a pedir en runtime por si cambió
 * después del deploy. La copia remota se usa solo si pasa esGaleriaValida;
 * si no, o si el pedido falla, queda la del bundle.
 */

import { writable } from 'svelte/store';
import { fetchContent } from '$lib/services/contentService';
import { PIEZAS_GALERIA } from '$lib/utils/galeria';
import type { GalleryContent, Trabajo } from '$lib/types/content';
// static/content/data/gallery.json, vía el plugin de vite.config.ts (en dev no se puede importar de static/)
import galeriaLocal from '$contenido/gallery.json';

export const galeriaBundle: GalleryContent = galeriaLocal;

interface TrabajosState {
	trabajos: Trabajo[];
	isLoading: boolean;
	isRemote: boolean;
}

const { subscribe, update } = writable<TrabajosState>({
	trabajos: galeriaBundle.items,
	isLoading: true,
	isRemote: false
});

export const trabajosStore = { subscribe };

const CAMPOS: (keyof Trabajo)[] = ['id', 'categoria', 'titulo', 'linea', 'foto', 'alt'];

function esTrabajoValido(t: unknown): t is Trabajo {
	if (typeof t !== 'object' || t === null) return false;
	const r = t as Record<string, unknown>;
	return CAMPOS.every((campo) => typeof r[campo] === 'string' && r[campo] !== '');
}

/**
 * Valida el JSON (puede venir de otra versión o del futuro admin) antes de usarlo.
 * Exige al menos PIEZAS_GALERIA piezas válidas con ids únicos, así la grilla
 * nunca queda con huecos.
 */
export function esGaleriaValida(data: unknown): data is GalleryContent {
	if (typeof data !== 'object' || data === null) return false;
	const items = (data as { items?: unknown }).items;
	if (!Array.isArray(items) || items.length < PIEZAS_GALERIA) return false;
	if (!items.every(esTrabajoValido)) return false;
	return new Set(items.map((t) => t.id)).size === items.length;
}

export async function loadTrabajos(): Promise<void> {
	const content = await fetchContent<unknown>('gallery', galeriaBundle);
	const isRemote = content !== galeriaBundle && esGaleriaValida(content);

	update((state) => ({
		...state,
		trabajos: isRemote ? (content as GalleryContent).items : galeriaBundle.items,
		isLoading: false,
		isRemote
	}));
}

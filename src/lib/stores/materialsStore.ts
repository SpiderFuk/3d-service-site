import { writable, derived } from 'svelte/store';
import { materiales as localMaterials, type Material } from '$lib/config/filamentColors';
import { fetchContent } from '$lib/services/contentService';
import type { MaterialsContent } from '$lib/types/content';

interface MaterialsState {
	materials: Record<string, Material>;
	isLoading: boolean;
	isRemote: boolean;
}

const initialState: MaterialsState = {
	materials: localMaterials,
	isLoading: true,
	isRemote: false
};

const { subscribe, set, update } = writable<MaterialsState>(initialState);

export const materialsStore = { subscribe };

export async function loadMaterials(): Promise<void> {
	const fallback: MaterialsContent = {
		materials: localMaterials,
		updatedAt: ''
	};

	const content = await fetchContent<MaterialsContent>('materials', fallback);
	const isRemote = content.updatedAt !== '';

	update((state) => ({
		...state,
		materials: content.materials,
		isLoading: false,
		isRemote
	}));
}

export const availableMaterials = derived(materialsStore, ($store) =>
	Object.entries($store.materials)
		.filter(([, material]) => material.disponible)
		.map(([id, material]) => ({ id, ...material }))
);

export const materialsCount = derived(availableMaterials, ($materials) => $materials.length);

export const colorsCount = derived(availableMaterials, ($materials) => {
	const uniqueColors = new Set<string>();
	$materials.forEach((material) => {
		Object.entries(material.colores).forEach(([colorId, color]) => {
			if (color.disponible) {
				uniqueColors.add(colorId);
			}
		});
	});
	return uniqueColors.size;
});

export function getColoresForMaterial(
	materials: Record<string, Material>,
	materialId: string
): Array<{ id: string; nombre: string; hex: string; disponible: boolean }> {
	const material = materials[materialId];
	if (!material) return [];
	return Object.entries(material.colores).map(([id, color]) => ({ id, ...color }));
}

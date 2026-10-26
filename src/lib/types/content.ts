/**
 * Stock de filamento: static/content/data/materials.json (único lugar).
 * Los hex son los oficiales de Bambu Lab; los translúcidos llevan alfa (#RRGGBBAA).
 */
export interface ColorStock {
	id: string;
	nombre: string;
	hex: string;
	agotado: boolean;
	translucido?: boolean;
}

export interface MaterialStock {
	nombre: string;
	disponible: boolean;
	colores: ColorStock[];
}

export type MaterialId = 'pla' | 'petg';

export interface MaterialsContent {
	materials: Record<MaterialId, MaterialStock>;
	updatedAt: string;
}

export interface GalleryItem {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	createdAt: string;
	instagramPostId?: string;
}

export interface GalleryContent {
	items: GalleryItem[];
	updatedAt: string;
}

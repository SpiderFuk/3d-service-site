import type { Material } from '$lib/config/filamentColors';

export interface MaterialsContent {
	materials: Record<string, Material>;
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

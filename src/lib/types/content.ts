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

/**
 * Piezas de Trabajos: static/content/data/gallery.json (único lugar).
 * Para sumar o cambiar una pieza se edita el JSON y se reemplaza la foto.
 */
export interface Trabajo {
	/** Identificador estable (mantiene la pieza destacada si llega una copia nueva del JSON) */
	id: string;
	/** Etiqueta de categoría, p. ej. "Mascotas" */
	categoria: string;
	titulo: string;
	/** Una línea bajo el título (solo en la pieza destacada) */
	linea: string;
	/** Ruta de la foto cuadrada, p. ej. /images/trabajos/gato.jpg */
	foto: string;
	/** Texto alternativo de la foto */
	alt: string;
}

export interface GalleryContent {
	items: Trabajo[];
	updatedAt: string;
}

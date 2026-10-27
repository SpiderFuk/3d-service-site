/**
 * Modelos de ejemplo del Visor 3D (BUILD.md, sección 08)
 *
 * Los archivos viven en static/models/. "Cuadro en relieve" no tiene archivo todavía:
 * lo provee la dueña (ver "Still open" en BUILD.md).
 */

export type EjemploId = 'santa' | 'miniatura' | 'jarron' | 'cuadro';

export interface EjemploVisor {
	id: EjemploId;
	/** Nombre visible en la tarjeta y en el visor */
	nombre: string;
	/** Nombre con artículo, para el mensaje de WhatsApp ("el Santa borracho") */
	conArticulo: string;
	/** Archivo en static/models/, o null si todavía no existe */
	archivo: string | null;
}

export const ejemplosVisor: readonly EjemploVisor[] = [
	{
		id: 'santa',
		nombre: 'Santa borracho',
		conArticulo: 'el Santa borracho',
		archivo: 'DrunkSanta.stl'
	},
	{ id: 'miniatura', nombre: 'Miniatura', conArticulo: 'la Miniatura', archivo: 'mini.stl' },
	{ id: 'jarron', nombre: 'Jarrón', conArticulo: 'el Jarrón', archivo: 'FlowerVase.stl' },
	{
		id: 'cuadro',
		nombre: 'Cuadro en relieve',
		conArticulo: 'el Cuadro en relieve',
		archivo: null
	}
];

export function getEjemplo(id: EjemploId): EjemploVisor {
	const ejemplo = ejemplosVisor.find((e) => e.id === id);
	if (!ejemplo) throw new Error(`Ejemplo desconocido: ${id}`);
	return ejemplo;
}

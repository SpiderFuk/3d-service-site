/**
 * Configuración local de colores de filamento y materiales disponibles
 *
 * Cada material tiene sus propios colores con disponibilidad independiente.
 * Un color puede estar disponible en PLA pero no en TPU, por ejemplo.
 *
 * Este archivo sirve como fallback cuando el JSON remoto
 * (/content/data/materials.json) no está disponible.
 */

// ============================================
// TIPOS
// ============================================

export interface Color {
	nombre: string;
	hex: string;
	disponible: boolean;
}

export interface Material {
	nombre: string;
	descripcion: string;
	propiedades: string[];
	disponible: boolean;
	colores: Record<string, Color>;
}

// ============================================
// COLORES BASE (actualizados desde my-spools.json)
// ============================================

const COLORES_HEX = {
	negro: '#000000',
	blanco: '#FFFFFF',
	rojo: '#FF0000',
	cyan: '#0086D6',
	gris: '#8E9089',
	amarillo: '#FFD834',
	beige: '#F7E6DE',
	plateado: '#C8C8C8',
	azulHielo: '#B8CDE9',
	azulPetg: '#001489',
	grisTranslucido: '#8E8E8E',
	// Temporalmente agotados
	azul: '#3B82F6',
	verde: '#10B981',
	violeta: '#A855F7'
} as const;

// ============================================
// DICCIONARIO DE MATERIALES CON SUS COLORES
// Agregá o modificá materiales y colores aquí
// ============================================

export const materiales: Record<string, Material> = {
	pla: {
		nombre: 'PLA',
		descripcion: 'Material versátil y fácil de usar, ideal para la mayoría de aplicaciones',
		propiedades: ['Biodegradable', 'Bajo olor', 'Buena calidad superficial', 'No flexible'],
		disponible: true,
		colores: {
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: true },
			blanco: { nombre: 'Blanco', hex: COLORES_HEX.blanco, disponible: true },
			rojo: { nombre: 'Rojo', hex: COLORES_HEX.rojo, disponible: true },
			cyan: { nombre: 'Cyan', hex: COLORES_HEX.cyan, disponible: true },
			gris: { nombre: 'Gris', hex: COLORES_HEX.gris, disponible: true },
			amarillo: { nombre: 'Amarillo', hex: COLORES_HEX.amarillo, disponible: true },
			beige: { nombre: 'Beige', hex: COLORES_HEX.beige, disponible: true },
			plateado: { nombre: 'Plateado', hex: COLORES_HEX.plateado, disponible: true },
			azulHieloTranslucido: { nombre: 'Azul Hielo translúcido', hex: COLORES_HEX.azulHielo, disponible: true },
			// Temporalmente agotados
			azul: { nombre: 'Azul', hex: COLORES_HEX.azul, disponible: false },
			verde: { nombre: 'Verde', hex: COLORES_HEX.verde, disponible: false },
			violeta: { nombre: 'Violeta', hex: COLORES_HEX.violeta, disponible: false }
		}
	},
	petg: {
		nombre: 'PETG',
		descripcion: 'Mayor resistencia y durabilidad que PLA, resistente a impactos',
		propiedades: ['Resistente', 'Flexible', 'Resistente a químicos', 'Uso alimentario'],
		disponible: true,
		colores: {
			azul: { nombre: 'Azul', hex: COLORES_HEX.azulPetg, disponible: true },
			grisTranslucido: { nombre: 'Gris translúcido', hex: COLORES_HEX.grisTranslucido, disponible: true },
			// Temporalmente agotado
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: false }
		}
	}
};

// ============================================
// FUNCIONES HELPER
// ============================================

/** Obtiene lista de materiales con su ID incluido */
export function getMaterialesList() {
	return Object.entries(materiales).map(([id, material]) => ({
		id,
		...material
	}));
}

/** Obtiene solo los materiales disponibles */
export function getMaterialesDisponibles() {
	return getMaterialesList().filter((m) => m.disponible);
}

/** Obtiene los colores de un material específico como lista */
export function getColoresByMaterial(materialId: string) {
	const material = materiales[materialId];
	if (!material) return [];

	return Object.entries(material.colores).map(([id, color]) => ({
		id,
		...color
	}));
}

/** Obtiene solo los colores disponibles de un material */
export function getColoresDisponiblesByMaterial(materialId: string) {
	return getColoresByMaterial(materialId).filter((c) => c.disponible);
}

/** Obtiene todos los colores únicos de todos los materiales */
export function getTodosLosColores() {
	const coloresMap = new Map<string, Color & { id: string }>();

	Object.values(materiales).forEach((material) => {
		Object.entries(material.colores).forEach(([id, color]) => {
			if (!coloresMap.has(id)) {
				coloresMap.set(id, { id, ...color });
			}
		});
	});

	return Array.from(coloresMap.values());
}


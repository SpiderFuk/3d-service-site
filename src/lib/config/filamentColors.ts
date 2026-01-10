/**
 * Configuración local de colores de filamento y materiales disponibles
 *
 * Cada material tiene sus propios colores con disponibilidad independiente.
 * Un color puede estar disponible en PLA pero no en TPU, por ejemplo.
 *
 * IMPORTANTE: Cuando el feature flag 'materials-visibility' está enabled en AWS AppConfig,
 * la disponibilidad de materiales es REEMPLAZADA por la del servidor. Esta configuración
 * local se usa como fallback cuando:
 * - El flag no existe o está disabled (enabled: false)
 * - AWS AppConfig no está disponible
 *
 * Nota: El control es a nivel de material (pla, petg, abs, tpu), no por color individual.
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
// COLORES BASE (para referencia de hex)
// Podés usar estos valores o definir colores únicos por material
// ============================================

const COLORES_HEX = {
	blanco: '#FFFFFF',
	negro: '#000000',
	rojo: '#EF4444',
	azul: '#3B82F6',
	verde: '#10B981',
	amarillo: '#FBBF24',
	naranja: '#F97316',
	violeta: '#A855F7',
	rosa: '#EC4899',
	gris: '#6B7280',
	plateado: '#D1D5DB',
	dorado: '#F59E0B'
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
			blanco: { nombre: 'Blanco', hex: COLORES_HEX.blanco, disponible: true },
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: true },
			rojo: { nombre: 'Rojo', hex: COLORES_HEX.rojo, disponible: true },
			azul: { nombre: 'Azul', hex: COLORES_HEX.azul, disponible: false },
			verde: { nombre: 'Verde', hex: COLORES_HEX.verde, disponible: false },
			amarillo: { nombre: 'Amarillo', hex: COLORES_HEX.amarillo, disponible: false },
			naranja: { nombre: 'Naranja', hex: COLORES_HEX.naranja, disponible: false },
			violeta: { nombre: 'Violeta', hex: COLORES_HEX.violeta, disponible: false },
			rosa: { nombre: 'Rosa', hex: COLORES_HEX.rosa, disponible: false },
			gris: { nombre: 'Gris', hex: COLORES_HEX.gris, disponible: false },
			plateado: { nombre: 'Plateado', hex: COLORES_HEX.plateado, disponible: true },
			dorado: { nombre: 'Dorado', hex: COLORES_HEX.dorado, disponible: false }
		}
	},
	petg: {
		nombre: 'PETG',
		descripcion: 'Mayor resistencia y durabilidad que PLA, resistente a impactos',
		propiedades: ['Resistente', 'Flexible', 'Resistente a químicos', 'Uso alimentario'],
		disponible: true,
		colores: {
			blanco: { nombre: 'Blanco', hex: COLORES_HEX.blanco, disponible: false },
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: false },
			rojo: { nombre: 'Rojo', hex: COLORES_HEX.rojo, disponible: false },
			azul: { nombre: 'Azul', hex: COLORES_HEX.azul, disponible: true },
			verde: { nombre: 'Verde', hex: COLORES_HEX.verde, disponible: false },
			gris: { nombre: 'Gris', hex: COLORES_HEX.gris, disponible: true }
		}
	},
	abs: {
		nombre: 'ABS',
		descripcion: 'Alta resistencia mecánica y térmica, ideal para piezas funcionales',
		propiedades: ['Muy resistente', 'Resistente al calor', 'Mecanizable', 'Más fuerte que PLA'],
		disponible: false,
		colores: {
			blanco: { nombre: 'Blanco', hex: COLORES_HEX.blanco, disponible: true },
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: true },
			rojo: { nombre: 'Rojo', hex: COLORES_HEX.rojo, disponible: true },
			gris: { nombre: 'Gris', hex: COLORES_HEX.gris, disponible: true }
		}
	},
	tpu: {
		nombre: 'TPU',
		descripcion: 'Material flexible tipo goma, ideal para piezas que requieren elasticidad',
		propiedades: ['Muy flexible', 'Resistente a abrasión', 'Absorbe impactos', 'Elástico'],
		disponible: false,
		colores: {
			blanco: { nombre: 'Blanco', hex: COLORES_HEX.blanco, disponible: true },
			negro: { nombre: 'Negro', hex: COLORES_HEX.negro, disponible: true },
			rojo: { nombre: 'Rojo', hex: COLORES_HEX.rojo, disponible: true },
			azul: { nombre: 'Azul', hex: COLORES_HEX.azul, disponible: true }
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

// ============================================
// EXPORTS LEGACY (compatibilidad)
// ============================================

export interface FilamentColor {
	id: string;
	name: string;
	hex: string;
	available: boolean;
}

export interface MaterialLegacy {
	id: string;
	name: string;
	description: string;
	properties: string[];
}

/** @deprecated Usá getColoresByMaterial() en su lugar */
export const filamentColors: FilamentColor[] = getColoresByMaterial('pla').map((c) => ({
	id: c.id,
	name: c.nombre,
	hex: c.hex,
	available: c.disponible
}));

/** @deprecated Usá getMaterialesList() en su lugar */
export const materials: MaterialLegacy[] = getMaterialesList().map((m) => ({
	id: m.id,
	name: m.nombre,
	description: m.descripcion,
	properties: m.propiedades
}));

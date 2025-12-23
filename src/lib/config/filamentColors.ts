/**
 * Configuración de colores de filamento y materiales disponibles
 */

export interface FilamentColor {
	id: string;
	name: string;
	hex: string;
	available: boolean;
}

export interface Material {
	id: string;
	name: string;
	description: string;
	properties: string[];
}

export const filamentColors: FilamentColor[] = [
	{ id: 'white', name: 'Blanco', hex: '#FFFFFF', available: true },
	{ id: 'black', name: 'Negro', hex: '#000000', available: true },
	{ id: 'red', name: 'Rojo', hex: '#EF4444', available: true },
	{ id: 'blue', name: 'Azul', hex: '#3B82F6', available: true },
	{ id: 'green', name: 'Verde', hex: '#10B981', available: true },
	{ id: 'yellow', name: 'Amarillo', hex: '#FBBF24', available: true },
	{ id: 'orange', name: 'Naranja', hex: '#F97316', available: true },
	{ id: 'purple', name: 'Violeta', hex: '#A855F7', available: true },
	{ id: 'pink', name: 'Rosa', hex: '#EC4899', available: false },
	{ id: 'gray', name: 'Gris', hex: '#6B7280', available: true },
	{ id: 'silver', name: 'Plateado', hex: '#D1D5DB', available: true },
	{ id: 'gold', name: 'Dorado', hex: '#F59E0B', available: false }
];

export const materials: Material[] = [
	{
		id: 'pla',
		name: 'PLA',
		description: 'Material versátil y fácil de usar, ideal para la mayoría de aplicaciones',
		properties: ['Biodegradable', 'Bajo olor', 'Buena calidad superficial', 'No flexible']
	},
	{
		id: 'petg',
		name: 'PETG',
		description: 'Mayor resistencia y durabilidad que PLA, resistente a impactos',
		properties: ['Resistente', 'Flexible', 'Resistente a químicos', 'Uso alimentario']
	},
	{
		id: 'abs',
		name: 'ABS',
		description: 'Alta resistencia mecánica y térmica, ideal para piezas funcionales',
		properties: ['Muy resistente', 'Resistente al calor', 'Mecanizable', 'Más fuerte que PLA']
	},
	{
		id: 'tpu',
		name: 'TPU',
		description: 'Material flexible tipo goma, ideal para piezas que requieren elasticidad',
		properties: ['Muy flexible', 'Resistente a abrasión', 'Absorbe impactos', 'Elástico']
	}
];

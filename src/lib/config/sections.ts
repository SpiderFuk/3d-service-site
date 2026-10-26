/**
 * Configuración local de secciones de la página
 *
 * Permite activar/desactivar secciones de forma modular.
 * Cambiá el valor `habilitada` a true/false para mostrar u ocultar cada sección.
 *
 * IMPORTANTE: Cuando el feature flag 'sections-visibility' está enabled en AWS AppConfig,
 * esta configuración es REEMPLAZADA por la del servidor. Esta configuración local se usa
 * como fallback cuando:
 * - El flag no existe o está disabled (enabled: false)
 * - AWS AppConfig no está disponible
 */

// ============================================
// TIPOS
// ============================================

export interface SeccionConfig {
	/** Nombre interno de la sección (usado como ID) */
	id: string;
	/** Nombre descriptivo para referencia */
	nombre: string;
	/** Si la sección está habilitada y visible */
	habilitada: boolean;
	/** Descripción o notas sobre la sección */
	descripcion?: string;
}

// ============================================
// CONFIGURACIÓN DE SECCIONES
// ============================================

export const secciones = {
	navegacion: {
		id: 'navegacion',
		nombre: 'Navegación',
		habilitada: true,
		descripcion: 'Barra fija con el logo, el menú y "Pedir presupuesto"'
	},
	hero: {
		id: 'inicio',
		nombre: 'Hero',
		habilitada: true,
		descripcion: 'Titular según el horario, botón de presupuesto y datos clave'
	},
	tresCaminos: {
		id: 'que-imprimimos',
		nombre: 'Tres caminos',
		habilitada: true,
		descripcion: 'Imagen, idea o archivo: cada camino lleva a WhatsApp'
	},
	trabajos: {
		id: 'trabajos',
		nombre: 'Trabajos',
		habilitada: true,
		descripcion: 'Galería de cuadros en relieve'
	},
	comoFunciona: {
		id: 'como-funciona',
		nombre: 'Cómo funciona',
		habilitada: true,
		descripcion: 'Tres pasos y la tarjeta "¿Lo imprimimos?"'
	},
	materiales: {
		id: 'materiales',
		nombre: 'Materiales y colores',
		habilitada: true,
		descripcion: 'PLA y PETG con los colores en stock'
	},
	precios: {
		id: 'precios',
		nombre: 'Precio y plazos',
		habilitada: true,
		descripcion: 'Qué mueve el precio, plazo y entrega'
	},
	visor: {
		id: 'visor',
		nombre: 'Visor 3D',
		habilitada: true,
		descripcion: 'Visor para abrir un STL o 3MF en el navegador'
	},
	preguntas: {
		id: 'preguntas',
		nombre: 'Preguntas',
		habilitada: true,
		descripcion: 'Preguntas frecuentes'
	},
	contacto: {
		id: 'contacto',
		nombre: 'Contacto',
		habilitada: true,
		descripcion: 'WhatsApp, horario y canales'
	},
	pie: {
		id: 'pie',
		nombre: 'Pie',
		habilitada: true,
		descripcion: 'Logo, menú, canales y línea legal'
	}
} as const satisfies Record<string, SeccionConfig>;

export type SeccionKey = keyof typeof secciones;

// ============================================
// FUNCIONES HELPER
// ============================================

/** Verifica si una sección está habilitada */
export function isSeccionHabilitada(seccionKey: SeccionKey): boolean {
	return secciones[seccionKey].habilitada;
}

/** Obtiene la lista de secciones habilitadas */
export function getSeccionesHabilitadas() {
	return Object.values(secciones).filter((s) => s.habilitada);
}

/** Obtiene la lista de secciones deshabilitadas */
export function getSeccionesDeshabilitadas() {
	return Object.values(secciones).filter((s) => !s.habilitada);
}

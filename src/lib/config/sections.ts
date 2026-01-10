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
	hero: {
		id: 'hero',
		nombre: 'Hero',
		habilitada: true,
		descripcion: 'Banner principal con título y llamada a la acción'
	},
	services: {
		id: 'services',
		nombre: 'Servicios',
		habilitada: true,
		descripcion: 'Listado de servicios ofrecidos'
	},
	modelViewer: {
		id: 'model-viewer',
		nombre: 'Visor de Modelos',
		habilitada: true,
		descripcion: 'Visor 3D interactivo para subir y visualizar modelos'
	},
	filamentColors: {
		id: 'filament-colors',
		nombre: 'Colores de Filamento',
		habilitada: true,
		descripcion: 'Selector de materiales y colores disponibles'
	},
	gallery: {
		id: 'gallery',
		nombre: 'Galería de Proyectos',
		habilitada: false, // Deshabilitada hasta tener proyectos para mostrar
		descripcion: 'Galería con trabajos realizados'
	},
	contact: {
		id: 'contact',
		nombre: 'Contacto WhatsApp',
		habilitada: true,
		descripcion: 'Sección de contacto con enlace a WhatsApp'
	}
} as const satisfies Record<string, SeccionConfig>;

// ============================================
// FUNCIONES HELPER
// ============================================

/** Verifica si una sección está habilitada */
export function isSeccionHabilitada(seccionKey: keyof typeof secciones): boolean {
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

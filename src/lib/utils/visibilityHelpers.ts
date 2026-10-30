/**
 * Helper functions para determinar visibilidad con override de feature flags
 *
 * IMPORTANTE: Estos helpers implementan la lógica de override:
 * - Si el flag está enabled: usa configuración de AppConfig (override completo)
 * - Si el flag está disabled o no existe: usa configuración local (sections.ts, services.ts, filamentColors.ts)
 */

import type {
	SectionsVisibilityFlag,
	ServicesVisibilityFlag
} from '$lib/types/featureFlags';
import { secciones, type SeccionKey } from '$lib/config/sections';
import { services, type Service } from '$lib/config/services';
import { sectionsVisibilityDefaults } from '$lib/config/sectionsVisibilityDefaults';
import { servicesVisibilityDefaults } from '$lib/config/servicesVisibilityDefaults';

// ============================================
// SECTIONS
// ============================================

/**
 * Determina si una sección está visible
 * Override mode: Si el flag está enabled, usa AppConfig; si no, usa sections.ts
 */
export function isSeccionVisible(
	sectionKey: SeccionKey,
	flag?: SectionsVisibilityFlag
): boolean {
	if (!flag) {
		// No hay flag: usar configuración local
		return secciones[sectionKey].habilitada;
	}

	if (!flag.enabled) {
		// Flag existe pero está disabled: usar configuración local
		return secciones[sectionKey].habilitada;
	}

	// Flag enabled: usar configuración de AppConfig (override)
	const configValue = flag.config?.[sectionKey];
	return configValue ?? sectionsVisibilityDefaults[sectionKey];
}

/**
 * Obtiene todas las secciones con su estado de visibilidad
 */
export function getSeccionesWithVisibility(flag?: SectionsVisibilityFlag) {
	return Object.entries(secciones).map(([key, section]) => ({
		...section,
		visible: isSeccionVisible(key as SeccionKey, flag)
	}));
}

// ============================================
// SERVICES
// ============================================

/**
 * Determina si un servicio está visible
 * Override mode: Si el flag está enabled, usa AppConfig; si no, muestra todos
 */
export function isServiceVisible(
	serviceId: string,
	flag?: ServicesVisibilityFlag
): boolean {
	if (!flag) {
		// No hay flag: mostrar todos los servicios
		return true;
	}

	if (!flag.enabled) {
		// Flag existe pero está disabled: mostrar todos
		return true;
	}

	// Flag enabled: usar configuración de AppConfig (override)
	const configValue = flag.config?.[serviceId as keyof typeof flag.config];
	return (
		configValue ??
		servicesVisibilityDefaults[serviceId as keyof typeof servicesVisibilityDefaults] ??
		true
	);
}

/**
 * Filtra servicios por visibilidad
 */
export function getVisibleServices(flag?: ServicesVisibilityFlag): Service[] {
	return services.filter((service) => isServiceVisible(service.id, flag));
}

// ============================================
// NAVIGATION
// ============================================

/**
 * Item de navegación con su sección asociada
 */
export interface NavItem {
	label: string;
	/** Nombre accesible cuando difiere del texto visible */
	ariaLabel?: string;
	href: string;
	sectionKey: SeccionKey;
}

/**
 * Todos los items de navegación con sus secciones correspondientes
 */
const navItems: NavItem[] = [
	{ label: 'Qué imprimimos', href: '#que-imprimimos', sectionKey: 'tresCaminos' },
	{ label: 'Trabajos', href: '#trabajos', sectionKey: 'trabajos' },
	{ label: 'Precios', ariaLabel: 'Precios y plazos', href: '#precios', sectionKey: 'precios' },
	{ label: 'Contacto', href: '#contacto', sectionKey: 'contacto' }
];

/**
 * Obtiene los items de navegación visibles según el flag de sections-visibility
 * Override mode: Si el flag está enabled, usa AppConfig; si no, usa sections.ts
 */
export function getVisibleNavItems(flag?: SectionsVisibilityFlag): NavItem[] {
	return navItems.filter((item) => isSeccionVisible(item.sectionKey, flag));
}

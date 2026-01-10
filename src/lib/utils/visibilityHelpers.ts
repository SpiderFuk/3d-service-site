/**
 * Helper functions para determinar visibilidad con override de feature flags
 *
 * IMPORTANTE: Estos helpers implementan la lógica de override:
 * - Si el flag está enabled: usa configuración de AppConfig (override completo)
 * - Si el flag está disabled o no existe: usa configuración local (sections.ts, services.ts, filamentColors.ts)
 */

import type {
	SectionsVisibilityFlag,
	ServicesVisibilityFlag,
	MaterialsVisibilityFlag
} from '$lib/types/featureFlags';
import { secciones } from '$lib/config/sections';
import { services, type Service } from '$lib/config/services';
import { materiales, type Material } from '$lib/config/filamentColors';
import { sectionsVisibilityDefaults } from '$lib/config/sectionsVisibilityDefaults';
import { servicesVisibilityDefaults } from '$lib/config/servicesVisibilityDefaults';
import { materialsVisibilityDefaults } from '$lib/config/materialsVisibilityDefaults';

// ============================================
// SECTIONS
// ============================================

/**
 * Determina si una sección está visible
 * Override mode: Si el flag está enabled, usa AppConfig; si no, usa sections.ts
 */
export function isSeccionVisible(
	sectionKey: keyof typeof secciones,
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
		visible: isSeccionVisible(key as keyof typeof secciones, flag)
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
// MATERIALS
// ============================================

/**
 * Determina si un material está disponible
 * Override mode: Si el flag está enabled, usa AppConfig; si no, usa filamentColors.ts
 */
export function isMaterialAvailable(
	materialId: string,
	flag?: MaterialsVisibilityFlag
): boolean {
	const material = materiales[materialId];

	if (!material) {
		return false;
	}

	if (!flag) {
		// No hay flag: usar configuración local
		return material.disponible;
	}

	if (!flag.enabled) {
		// Flag existe pero está disabled: usar configuración local
		return material.disponible;
	}

	// Flag enabled: usar configuración de AppConfig (override)
	const configValue = flag.config?.[materialId as keyof typeof flag.config];
	return (
		configValue ??
		materialsVisibilityDefaults[materialId as keyof typeof materialsVisibilityDefaults] ??
		false
	);
}

/**
 * Filtra materiales por disponibilidad
 */
export function getAvailableMaterials(flag?: MaterialsVisibilityFlag) {
	return Object.entries(materiales)
		.filter(([id]) => isMaterialAvailable(id, flag))
		.map(([id, material]) => ({ id, ...material }));
}

/**
 * Crea un objeto materiales modificado con disponibilidad actualizada
 * Útil para mantener compatibilidad con código existente
 */
export function getMaterialesWithFlagOverride(
	flag?: MaterialsVisibilityFlag
): Record<string, Material> {
	if (!flag || !flag.enabled) {
		// Sin override: devolver original
		return materiales;
	}

	// Con override: clonar y actualizar disponible
	const result: Record<string, Material> = {};

	for (const [id, material] of Object.entries(materiales)) {
		result[id] = {
			...material,
			disponible: isMaterialAvailable(id, flag)
		};
	}

	return result;
}

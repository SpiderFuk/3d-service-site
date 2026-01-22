/**
 * Valores por defecto para el flag sections-visibility
 * Se usan cuando AWS AppConfig no provee configuración o falla el fetch
 *
 * IMPORTANTE: Este archivo solo provee fallbacks.
 * Cuando el flag está enabled=true en AppConfig, estos valores son REEMPLAZADOS.
 */

export interface SectionsVisibilityConfig {
	hero: boolean;
	services: boolean;
	modelViewer: boolean;
	filamentColors: boolean;
	gallery: boolean;
	contact: boolean;
}

export const sectionsVisibilityDefaults: SectionsVisibilityConfig = {
	hero: true,
	services: true,
	modelViewer: true,
	filamentColors: true,
	gallery: true,
	contact: true
};

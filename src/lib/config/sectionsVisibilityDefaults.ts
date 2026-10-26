/**
 * Valores por defecto para el flag sections-visibility
 * Se usan cuando AWS AppConfig no provee configuración o falla el fetch
 *
 * IMPORTANTE: Este archivo solo provee fallbacks.
 * Cuando el flag está enabled=true en AppConfig, estos valores son REEMPLAZADOS.
 * Las claves son las de src/lib/config/sections.ts.
 */

import type { SeccionKey } from './sections';

export type SectionsVisibilityConfig = Record<SeccionKey, boolean>;

export const sectionsVisibilityDefaults: SectionsVisibilityConfig = {
	navegacion: true,
	hero: true,
	tresCaminos: true,
	trabajos: true,
	comoFunciona: true,
	materiales: true,
	precios: true,
	visor: true,
	preguntas: true,
	contacto: true,
	pie: true
};

/**
 * Valores por defecto para el flag materials-visibility
 * Se usan cuando AWS AppConfig no provee configuración o falla el fetch
 *
 * IMPORTANTE: Este archivo solo provee fallbacks.
 * Cuando el flag está enabled=true en AppConfig, estos valores son REEMPLAZADOS.
 */

export interface MaterialsVisibilityConfig {
	pla: boolean;
	petg: boolean;
	abs: boolean;
	tpu: boolean;
}

export const materialsVisibilityDefaults: MaterialsVisibilityConfig = {
	pla: true,
	petg: true,
	abs: false, // Matches current filamentColors.ts
	tpu: false
};

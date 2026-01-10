/**
 * Valores por defecto para el flag services-visibility
 * Se usan cuando AWS AppConfig no provee configuración o falla el fetch
 *
 * IMPORTANTE: Este archivo solo provee fallbacks.
 * Cuando el flag está enabled=true en AppConfig, estos valores son REEMPLAZADOS.
 */

export interface ServicesVisibilityConfig {
	printing: boolean;
	prototyping: boolean;
	custom: boolean;
}

export const servicesVisibilityDefaults: ServicesVisibilityConfig = {
	printing: true,
	prototyping: true,
	custom: true
};

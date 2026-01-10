/**
 * Tipos TypeScript para el sistema de Feature Flags con AWS AppConfig
 *
 * Este archivo define la estructura de todos los feature flags de la aplicación.
 * Para agregar un nuevo flag, crear una nueva interface que extienda BaseFeatureFlag
 * y agregarla al union type FeatureFlag.
 */

/**
 * Interface base genérica para todos los feature flags
 * @template T - El nombre único del flag (e.g., 'out-of-service')
 * @template C - El tipo de configuración específica del flag
 */
export interface BaseFeatureFlag<T extends string, C = unknown> {
	/** Nombre único del flag */
	type: T;
	/** Si el flag está habilitado o no */
	enabled: boolean;
	/** Configuración adicional específica del flag */
	config?: C;
}

/**
 * Configuración del flag out-of-service
 * Controla la visualización de modal y banner de servicio no disponible
 */
export interface OutOfServiceFlag extends BaseFeatureFlag<'out-of-service'> {
	config?: {
		modal?: {
			title?: string;
			message?: string;
			buttonText?: string;
		};
		banner?: {
			message?: string;
			icon?: 'alert-circle' | 'alert-triangle' | 'info';
			dismissible?: boolean;
		};
	};
}

/**
 * Configuración del flag sections-visibility
 * Controla qué secciones de la página están visibles
 */
export interface SectionsVisibilityFlag extends BaseFeatureFlag<'sections-visibility'> {
	config?: {
		hero?: boolean;
		services?: boolean;
		modelViewer?: boolean;
		filamentColors?: boolean;
		gallery?: boolean;
		contact?: boolean;
	};
}

/**
 * Configuración del flag services-visibility
 * Controla qué servicios individuales están visibles
 */
export interface ServicesVisibilityFlag extends BaseFeatureFlag<'services-visibility'> {
	config?: {
		printing?: boolean;
		prototyping?: boolean;
		custom?: boolean;
	};
}

/**
 * Configuración del flag materials-visibility
 * Controla qué materiales están disponibles (control a nivel de material, no por color)
 */
export interface MaterialsVisibilityFlag extends BaseFeatureFlag<'materials-visibility'> {
	config?: {
		pla?: boolean;
		petg?: boolean;
		abs?: boolean;
		tpu?: boolean;
	};
}

/**
 * Union type de todos los feature flags disponibles
 * Agregar nuevos tipos de flags aquí para soporte completo de TypeScript
 */
export type FeatureFlag =
	| OutOfServiceFlag
	| SectionsVisibilityFlag
	| ServicesVisibilityFlag
	| MaterialsVisibilityFlag;

/**
 * Estado completo del store de feature flags
 */
export interface FeatureFlagsState {
	/** Mapa de flags por tipo */
	flags: Record<string, FeatureFlag>;
	/** Timestamp del último fetch exitoso (null si nunca se fetcheó) */
	lastFetch: number | null;
	/** Indica si hay un fetch en progreso */
	isLoading: boolean;
	/** Mensaje de error del último fetch (null si no hay error) */
	error: string | null;
}

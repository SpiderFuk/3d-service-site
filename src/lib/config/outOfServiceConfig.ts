/**
 * Configuración por defecto del sistema de notificación de servicio
 *
 * IMPORTANTE: Este archivo ahora solo provee valores por defecto.
 * El estado real (enabled/disabled) es controlado por AWS AppConfig.
 * Los textos aquí se usan como fallback si AWS no especifica valores.
 */

export interface OutOfServiceConfig {
	enabled: boolean;
	modal: {
		title: string;
		message: string;
		buttonText: string;
	};
	banner: {
		message: string;
		icon: 'alert-circle' | 'alert-triangle' | 'info';
		dismissible: boolean;
	};
}

/**
 * Valores por defecto para el flag out-of-service
 * Se usan cuando AWS AppConfig no provee configuración o falla el fetch
 */
export const outOfServiceDefaults: OutOfServiceConfig = {
	// Default: deshabilitado (AWS AppConfig controla el estado real)
	enabled: false,

	modal: {
		title: '¡Hola!',
		message:
			'Por ahora no estamos aceptando nuevos pedidos. ' +
			'Gracias por tu paciencia, volvemos pronto.',
		buttonText: 'Entendido'
	},

	banner: {
		message: 'Temporalmente sin recibir pedidos',
		icon: 'alert-triangle',
		dismissible: true
	}
};

/**
 * Tipo para configuración del servidor con propiedades opcionales anidadas
 */
export type PartialOutOfServiceConfig = {
	enabled?: boolean;
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

/**
 * Mergea la configuración del servidor con los defaults locales
 * Garantiza que siempre haya valores para todos los campos
 *
 * @param serverConfig - Configuración parcial desde AWS AppConfig
 * @returns Configuración completa con defaults aplicados
 */
export function mergeWithDefaults(
	serverConfig?: PartialOutOfServiceConfig
): OutOfServiceConfig {
	return {
		enabled: serverConfig?.enabled ?? outOfServiceDefaults.enabled,
		modal: {
			title: serverConfig?.modal?.title ?? outOfServiceDefaults.modal.title,
			message: serverConfig?.modal?.message ?? outOfServiceDefaults.modal.message,
			buttonText: serverConfig?.modal?.buttonText ?? outOfServiceDefaults.modal.buttonText
		},
		banner: {
			message: serverConfig?.banner?.message ?? outOfServiceDefaults.banner.message,
			icon: serverConfig?.banner?.icon ?? outOfServiceDefaults.banner.icon,
			dismissible: serverConfig?.banner?.dismissible ?? outOfServiceDefaults.banner.dismissible
		}
	};
}

/**
 * Configuración del sistema de notificación de servicio
 *
 * Para activar/desactivar la notificación, cambia `enabled` a true/false
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

export const outOfServiceConfig: OutOfServiceConfig = {
	// Toggle maestro - cambiar a false para desactivar completamente
	enabled: true,

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
 * Helper para verificar si el sistema de notificación está habilitado
 */
export function isOutOfServiceEnabled(): boolean {
	return outOfServiceConfig.enabled;
}

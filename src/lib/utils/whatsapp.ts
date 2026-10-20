/**
 * Utilidades para integración con WhatsApp
 */

import { contactInfo } from '$lib/config/contact';
import type { ModelInfo } from '$lib/loaders/types';

export interface WhatsAppMessageOptions {
	modelInfo?: ModelInfo;
	customMessage?: string;
}

/**
 * Genera el mensaje para WhatsApp
 */
function generateMessage(options: WhatsAppMessageOptions = {}): string {
	const { modelInfo, customMessage } = options;

	if (customMessage) {
		return customMessage;
	}

	let message = '¡Hola! Me gustaría solicitar una cotización para impresión 3D.';

	if (modelInfo) {
		message += '\n\nInformación del modelo:';
		message += `\n• Archivo: ${modelInfo.filename}`;
		message += `\n• Dimensiones: ${modelInfo.dimensions.x} × ${modelInfo.dimensions.y} × ${modelInfo.dimensions.z} mm`;
		message += `\n• Volumen aproximado: ${modelInfo.volume} cm³`;
		message += `\n• Complejidad: ${modelInfo.triangles.toLocaleString('es-AR')} triángulos`;
	}

	return message;
}

/**
 * Genera la URL de WhatsApp con el mensaje
 */
export function generateWhatsAppURL(options: WhatsAppMessageOptions = {}): string {
	const message = generateMessage(options);
	const encodedMessage = encodeURIComponent(message);
	return `https://wa.me/${contactInfo.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Abre WhatsApp en una nueva ventana
 */
export function openWhatsApp(options: WhatsAppMessageOptions = {}): void {
	const url = generateWhatsAppURL(options);
	window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copia el mensaje al portapapeles
 */
export async function copyMessageToClipboard(options: WhatsAppMessageOptions = {}): Promise<boolean> {
	const message = generateMessage(options);
	try {
		await navigator.clipboard.writeText(message);
		return true;
	} catch (error) {
		console.error('Error al copiar al portapapeles:', error);
		return false;
	}
}

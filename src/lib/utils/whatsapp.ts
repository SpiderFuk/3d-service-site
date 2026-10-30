/**
 * Utilidades para integración con WhatsApp
 *
 * Los textos viven en $lib/config/whatsappMessages; el número en $lib/config/contact.
 */

import { contactInfo } from '$lib/config/contact';

/**
 * Link wa.me con el mensaje ya escrito.
 * Usar en un <a target="_blank" rel="noopener"> (ver ui/Button con href).
 */
export function whatsappUrl(mensaje: string): string {
	return `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
}

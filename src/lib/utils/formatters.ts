/**
 * Utilidades de formateo
 */

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(value: number, locale: string = 'es-AR'): string {
	return value.toLocaleString(locale);
}

/**
 * Formatea dimensiones en mm
 */
export function formatDimensions(x: number, y: number, z: number): string {
	return `${x.toFixed(1)} × ${y.toFixed(1)} × ${z.toFixed(1)} mm`;
}

/**
 * Formatea volumen en cm³
 */
export function formatVolume(volume: number): string {
	return `${volume.toFixed(2)} cm³`;
}

/**
 * Formatea precio en pesos argentinos (opcional, si se implementa cálculo)
 */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat('es-AR', {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: 0
	}).format(price);
}

/**
 * Trunca texto largo agregando "..."
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + '...';
}

/**
 * Convierte slug a título legible
 */
export function slugToTitle(slug: string): string {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

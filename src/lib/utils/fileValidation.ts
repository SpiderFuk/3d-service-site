/**
 * Utilidades para validación de archivos 3D
 */

import { SUPPORTED_EXTENSIONS } from '$lib/loaders/types';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Valida un archivo antes de cargarlo
 */
export function validateFile(file: File): ValidationResult {
	// Validar que existe el archivo
	if (!file) {
		return { valid: false, error: 'No se seleccionó ningún archivo' };
	}

	// Validar tamaño
	if (file.size > MAX_FILE_SIZE) {
		const sizeMB = Math.round(file.size / (1024 * 1024));
		return {
			valid: false,
			error: `El archivo es demasiado grande (${sizeMB}MB). Máximo permitido: 50MB`
		};
	}

	// Validar extensión
	const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
	if (!SUPPORTED_EXTENSIONS.includes(extension as any)) {
		return {
			valid: false,
			error: `Formato no soportado. Usa archivos ${SUPPORTED_EXTENSIONS.join(' o ')}`
		};
	}

	return { valid: true };
}

/**
 * Formatea el tamaño de archivo a una cadena legible
 */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return bytes + ' B';
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
	return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

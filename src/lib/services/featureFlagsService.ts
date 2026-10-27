/**
 * Servicio para comunicarse con AWS AppConfig
 *
 * Este servicio es responsable de:
 * - Fetch de feature flags desde el endpoint AWS
 * - Parsing y validación de la respuesta
 * - Merge con configuraciones por defecto
 * - Error handling robusto
 */

import type {
	FeatureFlag,
	SectionsVisibilityFlag,
	ServicesVisibilityFlag
} from '$lib/types/featureFlags';
import { sectionsVisibilityDefaults } from '$lib/config/sectionsVisibilityDefaults';
import type { SeccionKey } from '$lib/config/sections';
import { servicesVisibilityDefaults } from '$lib/config/servicesVisibilityDefaults';

/**
 * Endpoint de AWS API Gateway que conecta con Lambda + AppConfig
 */
const API_ENDPOINT = 'https://i5g5q5flt8.execute-api.us-east-2.amazonaws.com/config';

/**
 * Timeout para el request (10 segundos)
 */
const REQUEST_TIMEOUT = 10000;

/**
 * Obtiene los feature flags por defecto cuando el API falla
 * Retorna un array vacío (todos los flags deshabilitados) para degradación segura
 */
function getDefaultFlags(): FeatureFlag[] {
	return [];
}

/**
 * Parsea la respuesta del API de AWS AppConfig y la transforma a un array de FeatureFlag tipados
 *
 * La respuesta esperada tiene el formato:
 * {
 *   "sections-visibility": {
 *     "enabled": true,
 *     "hero": true,
 *     "visor": false
 *   }
 * }
 *
 * Las claves desconocidas (p. ej. un "out-of-service" que siga en AppConfig) se ignoran.
 *
 * @param data - Respuesta JSON del API
 * @returns Array de feature flags tipados con defaults mergeados
 */
function parseAPIResponse(data: unknown): FeatureFlag[] {
	if (!data || typeof data !== 'object') {
		return getDefaultFlags();
	}

	const flags: FeatureFlag[] = [];

	// Iterar sobre cada flag en la respuesta
	for (const [key, value] of Object.entries(data)) {
		try {
			if (key === 'sections-visibility') {
				// Parsear sections-visibility flag
				const rawFlag = value as Record<string, unknown>;
				const enabled = rawFlag.enabled === true;

				const flag: SectionsVisibilityFlag = {
					type: 'sections-visibility',
					enabled,
					config: Object.fromEntries(
						(Object.keys(sectionsVisibilityDefaults) as SeccionKey[]).map((seccion) => [
							seccion,
							typeof rawFlag[seccion] === 'boolean'
								? (rawFlag[seccion] as boolean)
								: sectionsVisibilityDefaults[seccion]
						])
					)
				};

				flags.push(flag);
			}

			if (key === 'services-visibility') {
				// Parsear services-visibility flag
				const rawFlag = value as Record<string, unknown>;
				const enabled = rawFlag.enabled === true;

				const flag: ServicesVisibilityFlag = {
					type: 'services-visibility',
					enabled,
					config: {
						printing: (rawFlag.printing as boolean) ?? servicesVisibilityDefaults.printing,
						prototyping:
							(rawFlag.prototyping as boolean) ?? servicesVisibilityDefaults.prototyping,
						custom: (rawFlag.custom as boolean) ?? servicesVisibilityDefaults.custom
					}
				};

				flags.push(flag);
			}

		} catch (error) {
			// Silently continue with the next flag if one fails
		}
	}

	return flags;
}

/**
 * Fetcha los feature flags desde AWS AppConfig
 *
 * Esta función:
 * - Hace un GET request al endpoint de AWS
 * - Aplica un timeout de 10 segundos
 * - Parsea la respuesta JSON
 * - Retorna flags tipados con defaults mergeados
 * - En caso de error, retorna defaults seguros (todo deshabilitado)
 *
 * @returns Promise que resuelve a un array de FeatureFlag
 */
export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
	try {
		const response = await fetch(API_ENDPOINT, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT)
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		const flags = parseAPIResponse(data);

		return flags;
	} catch (error) {
		// Silently return defaults on error (todo deshabilitado)
		return getDefaultFlags();
	}
}

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
	OutOfServiceFlag,
	SectionsVisibilityFlag,
	ServicesVisibilityFlag,
	MaterialsVisibilityFlag
} from '$lib/types/featureFlags';
import { outOfServiceDefaults } from '$lib/config/outOfServiceConfig';
import { sectionsVisibilityDefaults } from '$lib/config/sectionsVisibilityDefaults';
import { servicesVisibilityDefaults } from '$lib/config/servicesVisibilityDefaults';
import { materialsVisibilityDefaults } from '$lib/config/materialsVisibilityDefaults';

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
 *   "out-of-service": {
 *     "enabled": true,
 *     "modal": { "title": "...", ... },
 *     "banner": { "message": "...", ... }
 *   }
 * }
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
			if (key === 'out-of-service') {
				// Parsear out-of-service flag
				const rawFlag = value as Record<string, unknown>;
				const enabled = rawFlag.enabled === true;

				const flag: OutOfServiceFlag = {
					type: 'out-of-service',
					enabled,
					config: {
						modal: {
							title:
								(rawFlag.modal as { title?: string })?.title ||
								outOfServiceDefaults.modal.title,
							message:
								(rawFlag.modal as { message?: string })?.message ||
								outOfServiceDefaults.modal.message,
							buttonText:
								(rawFlag.modal as { buttonText?: string })?.buttonText ||
								outOfServiceDefaults.modal.buttonText
						},
						banner: {
							message:
								(rawFlag.banner as { message?: string })?.message ||
								outOfServiceDefaults.banner.message,
							icon:
								((rawFlag.banner as { icon?: string })?.icon as
									| 'alert-circle'
									| 'alert-triangle'
									| 'info') || outOfServiceDefaults.banner.icon,
							dismissible:
								(rawFlag.banner as { dismissible?: boolean })?.dismissible ??
								outOfServiceDefaults.banner.dismissible
						}
					}
				};

				flags.push(flag);
			}

			if (key === 'sections-visibility') {
				// Parsear sections-visibility flag
				const rawFlag = value as Record<string, unknown>;
				const enabled = rawFlag.enabled === true;

				const flag: SectionsVisibilityFlag = {
					type: 'sections-visibility',
					enabled,
					config: {
						hero: (rawFlag.hero as boolean) ?? sectionsVisibilityDefaults.hero,
						services: (rawFlag.services as boolean) ?? sectionsVisibilityDefaults.services,
						modelViewer:
							(rawFlag.modelViewer as boolean) ?? sectionsVisibilityDefaults.modelViewer,
						filamentColors:
							(rawFlag.filamentColors as boolean) ?? sectionsVisibilityDefaults.filamentColors,
						gallery: (rawFlag.gallery as boolean) ?? sectionsVisibilityDefaults.gallery,
						contact: (rawFlag.contact as boolean) ?? sectionsVisibilityDefaults.contact
					}
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

			if (key === 'materials-visibility') {
				// Parsear materials-visibility flag
				const rawFlag = value as Record<string, unknown>;
				const enabled = rawFlag.enabled === true;

				const flag: MaterialsVisibilityFlag = {
					type: 'materials-visibility',
					enabled,
					config: {
						pla: (rawFlag.pla as boolean) ?? materialsVisibilityDefaults.pla,
						petg: (rawFlag.petg as boolean) ?? materialsVisibilityDefaults.petg,
						abs: (rawFlag.abs as boolean) ?? materialsVisibilityDefaults.abs,
						tpu: (rawFlag.tpu as boolean) ?? materialsVisibilityDefaults.tpu
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

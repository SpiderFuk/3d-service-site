/**
 * Store de Svelte para Feature Flags
 *
 * Este store es responsable de:
 * - Gestionar el estado reactivo de los feature flags
 * - Controlar el lifecycle del polling (start/stop)
 * - Proveer getters convenientes para acceder a flags específicos
 * - Optimizar re-renders actualizando solo cuando los flags cambian
 */

import { writable, derived, get } from 'svelte/store';
import type {
	FeatureFlag,
	FeatureFlagsState,
	OutOfServiceFlag,
	SectionsVisibilityFlag,
	ServicesVisibilityFlag,
	MaterialsVisibilityFlag
} from '$lib/types/featureFlags';
import { fetchFeatureFlags } from '$lib/services/featureFlagsService';

/**
 * Estado inicial del store
 */
const initialState: FeatureFlagsState = {
	flags: {},
	lastFetch: null,
	isLoading: false,
	error: null
};

/**
 * Intervalo de polling (default: 5 minutos)
 */
let pollingInterval: number | undefined;

/**
 * Promise pendiente para evitar múltiples fetches simultáneos
 */
let pendingFetch: Promise<void> | null = null;

/**
 * Compara dos objetos de flags para determinar si son iguales
 * Esto previene actualizaciones innecesarias del store
 */
function deepEqual(obj1: Record<string, FeatureFlag>, obj2: Record<string, FeatureFlag>): boolean {
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		const val1 = obj1[key];
		const val2 = obj2[key];

		if (!val2) return false;

		// Comparar enabled y config
		if (val1.enabled !== val2.enabled) return false;

		// Comparar config usando JSON (simple pero efectivo)
		if (JSON.stringify(val1.config) !== JSON.stringify(val2.config)) {
			return false;
		}
	}

	return true;
}

/**
 * Convierte un array de flags a un objeto Record indexado por tipo
 */
function arrayToRecord(flags: FeatureFlag[]): Record<string, FeatureFlag> {
	const record: Record<string, FeatureFlag> = {};
	for (const flag of flags) {
		record[flag.type] = flag;
	}
	return record;
}

/**
 * Crea el store de feature flags
 */
function createFeatureFlagsStore() {
	const { subscribe, set, update } = writable<FeatureFlagsState>(initialState);

	/**
	 * Fetcha los flags del API y actualiza el store
	 * Solo actualiza si los flags realmente cambiaron
	 */
	async function fetchFlags(): Promise<void> {
		// Evitar múltiples fetches simultáneos
		if (pendingFetch) {
			return pendingFetch;
		}

		pendingFetch = (async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				const flags = await fetchFeatureFlags();
				const flagsRecord = arrayToRecord(flags);

				update((state) => {
					// Solo actualizar si los flags cambiaron
					if (deepEqual(state.flags, flagsRecord)) {
						return { ...state, isLoading: false };
					}

					return {
						flags: flagsRecord,
						lastFetch: Date.now(),
						isLoading: false,
						error: null
					};
				});
			} catch (error) {
				update((state) => ({
					...state,
					isLoading: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}));
			} finally {
				pendingFetch = null;
			}
		})();

		return pendingFetch;
	}

	/**
	 * Inicia el polling de feature flags
	 *
	 * @param intervalMs - Intervalo en milisegundos (default: 5 minutos)
	 */
	function startPolling(intervalMs: number = 300000): void {
		// Si ya hay polling activo, detenerlo primero
		if (pollingInterval) {
			stopPolling();
		}

		// Fetch inmediato
		fetchFlags();

		// Polling periódico
		pollingInterval = setInterval(() => {
			fetchFlags();
		}, intervalMs) as unknown as number;
	}

	/**
	 * Detiene el polling de feature flags
	 * CRÍTICO: Llamar en onDestroy para prevenir memory leaks
	 */
	function stopPolling(): void {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			pollingInterval = undefined;
		}
	}

	/**
	 * Obtiene un flag específico por su tipo
	 */
	function getFlag(type: string): FeatureFlag | undefined {
		const state = get({ subscribe });
		return state.flags[type];
	}

	/**
	 * Verifica si un flag está habilitado
	 */
	function isEnabled(type: string): boolean {
		const flag = getFlag(type);
		return flag?.enabled ?? false;
	}

	/**
	 * Resetea el store al estado inicial
	 * Útil para testing
	 */
	function reset(): void {
		stopPolling();
		set(initialState);
	}

	return {
		subscribe,
		startPolling,
		stopPolling,
		fetchFlags,
		getFlag,
		isEnabled,
		reset
	};
}

/**
 * Store principal de feature flags
 */
export const featureFlagsStore = createFeatureFlagsStore();

/**
 * Derived store para el flag out-of-service
 * Provee acceso conveniente y tipado al flag específico
 */
export const outOfServiceFlag = derived(
	featureFlagsStore,
	($flags) => $flags.flags['out-of-service'] as OutOfServiceFlag | undefined
);

/**
 * Derived store para el flag sections-visibility
 * Provee acceso conveniente y tipado al flag específico
 */
export const sectionsVisibilityFlag = derived(
	featureFlagsStore,
	($flags) => $flags.flags['sections-visibility'] as SectionsVisibilityFlag | undefined
);

/**
 * Derived store para el flag services-visibility
 * Provee acceso conveniente y tipado al flag específico
 */
export const servicesVisibilityFlag = derived(
	featureFlagsStore,
	($flags) => $flags.flags['services-visibility'] as ServicesVisibilityFlag | undefined
);

/**
 * Derived store para el flag materials-visibility
 * Provee acceso conveniente y tipado al flag específico
 */
export const materialsVisibilityFlag = derived(
	featureFlagsStore,
	($flags) => $flags.flags['materials-visibility'] as MaterialsVisibilityFlag | undefined
);

/**
 * Development helpers
 * Expone funciones útiles para debugging en modo desarrollo
 */
if (import.meta.env.DEV) {
	(window as any).__featureFlags = {
		store: featureFlagsStore,
		forceRefresh: () => {
			return featureFlagsStore.fetchFlags();
		},
		resetDismissal: () => {
			localStorage.removeItem('outOfServiceModalDismissed');
			localStorage.removeItem('outOfServiceFlagVersion');
		},
		getState: () => get(featureFlagsStore),
		stopPolling: () => {
			featureFlagsStore.stopPolling();
		},
		startPolling: (intervalMs?: number) => {
			featureFlagsStore.startPolling(intervalMs);
		}
	};
}

/**
 * Store para gestionar el estado de la UI
 *
 * NOTA: La lógica de out-of-service fue migrada a un derived store
 * que consume el featureFlagsStore. Ver outOfServiceUI más abajo.
 */

import { writable, derived } from 'svelte/store';
import { featureFlagsStore } from './featureFlagsStore';
import { mergeWithDefaults } from '$lib/config/outOfServiceConfig';
import type { OutOfServiceFlag } from '$lib/types/featureFlags';

export interface UIState {
	isMobileMenuOpen: boolean;
	activeSection: string | null;
	showUploadModal: boolean;
}

const initialState: UIState = {
	isMobileMenuOpen: false,
	activeSection: null,
	showUploadModal: false
};

function createUIStore() {
	const { subscribe, set, update } = writable<UIState>(initialState);

	return {
		subscribe,

		/**
		 * Toggle del menú móvil
		 */
		toggleMobileMenu: () => {
			update((state) => ({ ...state, isMobileMenuOpen: !state.isMobileMenuOpen }));
		},

		/**
		 * Cierra el menú móvil
		 */
		closeMobileMenu: () => {
			update((state) => ({ ...state, isMobileMenuOpen: false }));
		},

		/**
		 * Establece la sección activa
		 */
		setActiveSection: (section: string | null) => {
			update((state) => ({ ...state, activeSection: section }));
		},

		/**
		 * Toggle del modal de carga
		 */
		toggleUploadModal: () => {
			update((state) => ({ ...state, showUploadModal: !state.showUploadModal }));
		},

		/**
		 * Abre el modal de carga
		 */
		openUploadModal: () => {
			update((state) => ({ ...state, showUploadModal: true }));
		},

		/**
		 * Cierra el modal de carga
		 */
		closeUploadModal: () => {
			update((state) => ({ ...state, showUploadModal: false }));
		},

		/**
		 * Resetea el store
		 */
		reset: () => set(initialState)
	};
}

export const uiStore = createUIStore();

/**
 * Claves de localStorage para el sistema de dismissal
 */
const STORAGE_KEY_MODAL = 'outOfServiceModalDismissed';
const STORAGE_KEY_VERSION = 'outOfServiceFlagVersion';

/**
 * Derived store que combina los feature flags con el estado de dismissal en localStorage
 * Controla cuándo mostrar el modal y el banner de out-of-service
 */
export const outOfServiceUI = derived(featureFlagsStore, ($flags) => {
	const flag = $flags.flags['out-of-service'] as OutOfServiceFlag | undefined;

	// Si el flag no existe o está deshabilitado, no mostrar nada
	if (!flag?.enabled) {
		return {
			showModal: false,
			showBanner: false,
			config: mergeWithDefaults({})
		};
	}

	// Verificar si el usuario ya cerró el modal
	const currentVersion = `v${flag.enabled}`;
	const storedVersion = localStorage.getItem(STORAGE_KEY_VERSION);
	const modalDismissed = localStorage.getItem(STORAGE_KEY_MODAL) === 'true';

	// Si el flag se toggleó off->on, resetear el dismissal
	if (storedVersion !== currentVersion) {
		localStorage.removeItem(STORAGE_KEY_MODAL);
		localStorage.setItem(STORAGE_KEY_VERSION, currentVersion);
		return {
			showModal: true,
			showBanner: false,
			config: mergeWithDefaults(flag.config)
		};
	}

	// Flujo normal: modal → dismiss → banner
	return {
		showModal: !modalDismissed,
		showBanner: modalDismissed,
		config: mergeWithDefaults(flag.config)
	};
});

/**
 * Helper para cerrar el modal de out-of-service
 * Guarda el estado en localStorage y el derived store se actualizará automáticamente
 */
export function dismissOutOfServiceModal(): void {
	localStorage.setItem(STORAGE_KEY_MODAL, 'true');
	const currentVersion = localStorage.getItem(STORAGE_KEY_VERSION) || 'v1';
	localStorage.setItem(STORAGE_KEY_VERSION, currentVersion);
}

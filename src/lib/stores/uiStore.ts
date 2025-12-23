/**
 * Store para gestionar el estado de la UI
 */

import { writable } from 'svelte/store';

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

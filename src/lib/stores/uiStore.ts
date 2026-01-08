/**
 * Store para gestionar el estado de la UI
 */

import { writable } from 'svelte/store';

export interface UIState {
	isMobileMenuOpen: boolean;
	activeSection: string | null;
	showUploadModal: boolean;
	showOutOfServiceModal: boolean;
	showOutOfServiceBanner: boolean;
	outOfServiceModalDismissed: boolean;
	outOfServiceBannerDismissed: boolean;
}

const initialState: UIState = {
	isMobileMenuOpen: false,
	activeSection: null,
	showUploadModal: false,
	showOutOfServiceModal: false,
	showOutOfServiceBanner: false,
	outOfServiceModalDismissed: false,
	outOfServiceBannerDismissed: false
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
		 * Inicializa el estado del sistema de notificación desde localStorage
		 * Se llama en onMount del layout
		 */
		initOutOfServiceState: () => {
			const modalDismissed = localStorage.getItem('outOfServiceModalDismissed') === 'true';

			update((state) => ({
				...state,
				outOfServiceModalDismissed: modalDismissed,
				outOfServiceBannerDismissed: false,
				showOutOfServiceModal: !modalDismissed,
				showOutOfServiceBanner: modalDismissed // Banner siempre aparece si el modal fue cerrado
			}));
		},

		/**
		 * Cierra el modal y muestra el banner
		 */
		dismissOutOfServiceModal: () => {
			localStorage.setItem('outOfServiceModalDismissed', 'true');
			localStorage.setItem('outOfServiceModalDismissedAt', new Date().toISOString());

			update((state) => ({
				...state,
				showOutOfServiceModal: false,
				outOfServiceModalDismissed: true,
				showOutOfServiceBanner: true
			}));
		},

		/**
		 * Cierra el banner (solo si es dismissible)
		 * El banner reaparecerá en el próximo reload
		 */
		dismissOutOfServiceBanner: () => {
			update((state) => ({
				...state,
				showOutOfServiceBanner: false,
				outOfServiceBannerDismissed: true
			}));
		},

		/**
		 * Resetea el sistema de notificación (para testing/admin)
		 */
		resetOutOfServiceNotifications: () => {
			localStorage.removeItem('outOfServiceModalDismissed');
			localStorage.removeItem('outOfServiceModalDismissedAt');

			update((state) => ({
				...state,
				showOutOfServiceModal: true,
				showOutOfServiceBanner: false,
				outOfServiceModalDismissed: false,
				outOfServiceBannerDismissed: false
			}));
		},

		/**
		 * Resetea el store
		 */
		reset: () => set(initialState)
	};
}

export const uiStore = createUIStore();

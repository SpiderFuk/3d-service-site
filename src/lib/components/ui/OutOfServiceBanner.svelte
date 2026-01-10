<script lang="ts">
	/**
	 * Banner sticky de notificación de servicio fuera de línea
	 * Aparece después de cerrar el modal
	 * Configuración controlada dinámicamente por AWS AppConfig
	 */

	import { AlertTriangle, AlertCircle, Info, X } from 'lucide-svelte';
	import { outOfServiceUI } from '$lib/stores/uiStore';

	// Configuración reactiva desde el derived store
	const config = $derived($outOfServiceUI.config);

	// Mapea el nombre del ícono al componente
	const iconMap = {
		'alert-triangle': AlertTriangle,
		'alert-circle': AlertCircle,
		info: Info
	};

	const IconComponent = $derived(iconMap[config.banner.icon]);

	// Estado local para controlar visibilidad del banner
	let isVisible = $state(true);

	/**
	 * Cierra el banner si es dismissible
	 * El dismissal es temporal (solo para la sesión actual)
	 */
	function handleDismiss() {
		if (config.banner.dismissible) {
			isVisible = false;
		}
	}
</script>

{#if isVisible}
	<div
		class="sticky top-16 left-0 right-0 z-[40] bg-amber-100 border-b-2 border-amber-400 shadow-sm"
		role="alert"
		aria-live="polite"
	>
		<div class="container mx-auto px-4 py-3">
			<div class="flex items-center justify-center gap-3 relative">
				<!-- Ícono -->
				<IconComponent size={20} class="text-amber-600 flex-shrink-0" />

				<!-- Mensaje -->
				<p class="text-sm md:text-base font-medium text-amber-800 text-center">
					{config.banner.message}
				</p>

				<!-- Botón cerrar (solo si es dismissible) -->
				{#if config.banner.dismissible}
					<button
						onclick={handleDismiss}
						class="absolute right-0 p-1 hover:bg-amber-200 rounded-lg transition-colors"
						aria-label="Cerrar banner"
					>
						<X size={18} class="text-amber-700" />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}

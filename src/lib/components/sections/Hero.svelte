<script lang="ts">
	/**
	 * Sección Hero principal
	 */

	import { ArrowRight, Sparkles } from 'lucide-svelte';
	import { contactInfo } from '$lib/config/contact';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { scrollToSection } from '$lib/utils/scroll';
	import Button from '../ui/Button.svelte';
	import { materialsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { countAvailableMaterials, countAvailableColors } from '$lib/utils/visibilityHelpers';

	function handleCTA() {
		openWhatsApp();
	}

	function handleViewerClick() {
		scrollToSection('viewer');
	}

	// Contadores dinámicos basados en feature flags
	const materialsCount = $derived(countAvailableMaterials($materialsVisibilityFlag));
	const colorsCount = $derived(countAvailableColors($materialsVisibilityFlag));
</script>

<section id="hero" class="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background-secondary to-primary/5">
	<div class="container mx-auto px-4 py-20">
		<div class="max-w-4xl mx-auto">
			<!-- Contenido -->
			<div class="space-y-6 text-center">
				<div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mx-auto">
					<Sparkles size={16} />
					<span>Servicio profesional en {contactInfo.city}</span>
				</div>

				<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight">
					Dale vida a tus ideas con
					<span class="text-primary">Impresión 3D</span>
				</h1>

				<p class="text-lg md:text-xl text-text-secondary">
					Transformamos tus diseños en realidad. Calidad profesional, entrega rápida y
					atención personalizada para cada proyecto.
				</p>

				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<Button variant="whatsapp" size="lg" onclick={handleCTA}>
						Cotizar Ahora
						<ArrowRight size={20} />
					</Button>

					<Button variant="outline" size="lg" onclick={handleViewerClick}>
						Ver Visor 3D
					</Button>
				</div>

				<!-- Características rápidas -->
				<div class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 max-w-md mx-auto">
					<div>
						<p class="text-2xl font-bold text-primary">24-48h</p>
						<p class="text-sm text-text-secondary">Entrega rápida</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary">{materialsCount}+</p>
						<p class="text-sm text-text-secondary">Materiales</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary">{colorsCount}+</p>
						<p class="text-sm text-text-secondary">Colores</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

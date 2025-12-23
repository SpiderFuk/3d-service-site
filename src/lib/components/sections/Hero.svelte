<script lang="ts">
	/**
	 * Sección Hero principal
	 */

	import { ArrowRight, Sparkles } from 'lucide-svelte';
	import { contactInfo } from '$lib/config/contact';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { scrollToSection } from '$lib/utils/scroll';
	import Button from '../ui/Button.svelte';

	function handleCTA() {
		openWhatsApp();
	}

	function handleViewerClick() {
		scrollToSection('viewer');
	}
</script>

<section id="hero" class="relative min-h-screen flex items-center bg-gradient-to-br from-background via-background-secondary to-primary/5">
	<div class="container mx-auto px-4 py-20">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
			<!-- Contenido -->
			<div class="space-y-6">
				<div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
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

				<div class="flex flex-col sm:flex-row gap-4">
					<Button variant="whatsapp" size="lg" onclick={handleCTA}>
						Cotizar Ahora
						<ArrowRight size={20} />
					</Button>

					<Button variant="outline" size="lg" onclick={handleViewerClick}>
						Ver Visor 3D
					</Button>
				</div>

				<!-- Características rápidas -->
				<div class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
					<div>
						<p class="text-2xl font-bold text-primary">24-48h</p>
						<p class="text-sm text-text-secondary">Entrega rápida</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary">4+</p>
						<p class="text-sm text-text-secondary">Materiales</p>
					</div>
					<div>
						<p class="text-2xl font-bold text-primary">12+</p>
						<p class="text-sm text-text-secondary">Colores</p>
					</div>
				</div>
			</div>

			<!-- Imagen/Ilustración -->
			<div class="relative">
				<div class="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
					<div class="text-center">
						<div class="text-9xl text-primary/30 font-bold">3D</div>
						<p class="text-text-secondary mt-4">Visualiza tus modelos en el visor 3D ↓</p>
					</div>
				</div>

				<!-- Elementos decorativos -->
				<div class="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
				<div class="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
			</div>
		</div>
	</div>
</section>

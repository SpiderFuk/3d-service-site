<script lang="ts">
	/**
	 * Sección de contacto con WhatsApp
	 */

	import { MessageCircle, Clock, MapPin } from 'lucide-svelte';
	import { contactInfo, businessHours } from '$lib/config/contact';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import Button from '../ui/Button.svelte';
	import Card from '../ui/Card.svelte';

	function handleContact() {
		openWhatsApp({ customMessage: '¡Hola! Quisiera consultar sobre sus servicios de impresión 3D.' });
	}
</script>

<section id="contact" class="py-20 bg-background">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-text mb-4">
				¿Tenés un proyecto en mente?
			</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Contactanos por WhatsApp y recibí una cotización personalizada
			</p>
		</div>

		<div class="max-w-4xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<!-- Tarjeta WhatsApp -->
				<Card padding="lg" shadow={true}>
					<div class="flex items-start gap-4">
						<div class="p-3 bg-whatsapp/10 rounded-lg">
							<MessageCircle size={24} class="text-whatsapp" />
						</div>
						<div>
							<h3 class="font-bold text-lg text-text mb-1">WhatsApp</h3>
							<a
								href="https://wa.me/{contactInfo.whatsappNumber}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary hover:underline"
							>
								{contactInfo.whatsappDisplayNumber}
							</a>
							<p class="text-sm text-text-secondary mt-2">
								Respuesta rápida, cotización inmediata
							</p>
						</div>
					</div>
				</Card>

				<!-- Tarjeta Ubicación -->
				<Card padding="lg" shadow={true}>
					<div class="flex items-start gap-4">
						<div class="p-3 bg-primary/10 rounded-lg">
							<MapPin size={24} class="text-primary" />
						</div>
						<div>
							<h3 class="font-bold text-lg text-text mb-1">Ubicación</h3>
							<p class="text-text-secondary">{contactInfo.city}, Argentina</p>
							<p class="text-sm text-text-secondary mt-2">
								Consultar disponibilidad de retiro en persona
							</p>
						</div>
					</div>
				</Card>
			</div>

			<!-- Horarios -->
			<Card padding="lg" shadow={true} class="mb-8">
				<div class="flex items-start gap-4">
					<div class="p-3 bg-primary/10 rounded-lg">
						<Clock size={24} class="text-primary" />
					</div>
					<div class="flex-1">
						<h3 class="font-bold text-lg text-text mb-3">Horarios de Atención</h3>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<p class="text-sm font-medium text-text">Lunes a Viernes</p>
								<p class="text-sm text-text-secondary">9:00 - 18:00</p>
							</div>
							<div>
								<p class="text-sm font-medium text-text">Sábados</p>
								<p class="text-sm text-text-secondary">10:00 - 14:00</p>
							</div>
							<div>
								<p class="text-sm font-medium text-text">Domingos</p>
								<p class="text-sm text-text-secondary">Cerrado</p>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<!-- CTA Principal -->
			<div class="text-center">
				<Button variant="whatsapp" size="lg" onclick={handleContact}>
					<MessageCircle size={24} />
					Iniciar Conversación
				</Button>
				<p class="text-sm text-text-secondary mt-4">
					Te respondemos en minutos y te enviamos tu cotización personalizada
				</p>
			</div>
		</div>
	</div>
</section>

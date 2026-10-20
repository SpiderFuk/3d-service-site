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

<section id="contact" class="py-20 bg-white">
	<div class="container mx-auto px-4 md:px-16">
		<div class="text-center mb-12">
			<p class="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-secondary mb-3">
				Contacto
			</p>
			<h2 class="text-3xl md:text-5xl text-text mb-4">¿Tenés un proyecto en mente?</h2>
			<p class="text-lg text-text-secondary max-w-2xl mx-auto">
				Contactanos por WhatsApp y recibí una cotización personalizada
			</p>
		</div>

		<div class="max-w-4xl mx-auto">
			<!-- gap-10: deja lugar a la extrusion de la tarjeta de WhatsApp (30px) -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
				<!-- Tarjeta WhatsApp (la unica con extrusion en esta vista) -->
				<Card padding="lg" extrude>
					<div class="flex items-start gap-4">
						<div class="p-3 bg-whatsapp rounded-full">
							<MessageCircle size={24} class="text-tinta" />
						</div>
						<div>
							<h3 class="text-lg text-text mb-1">WhatsApp</h3>
							<a
								href="https://wa.me/{contactInfo.whatsappNumber}"
								target="_blank"
								rel="noopener noreferrer"
								class="font-semibold text-primary hover:underline"
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
				<Card padding="lg">
					<div class="flex items-start gap-4">
						<div class="p-3 bg-menta rounded-full">
							<MapPin size={24} class="text-tinta" />
						</div>
						<div>
							<h3 class="text-lg text-text mb-1">Ubicación</h3>
							<p class="text-text-secondary">{contactInfo.city}, Uruguay</p>
							<p class="text-sm text-text-secondary mt-2">
								Consultar disponibilidad de retiro en persona
							</p>
						</div>
					</div>
				</Card>
			</div>

			<!-- Horarios -->
			<Card padding="lg" class="mb-8">
				<div class="flex items-start gap-4">
					<div class="p-3 bg-mantequilla rounded-full">
						<Clock size={24} class="text-tinta" />
					</div>
					<div class="flex-1">
						<h3 class="text-lg text-text mb-3">Horarios de atención</h3>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{#each businessHours as franja (franja.dias)}
								<div>
									<p class="text-sm font-medium text-text">{franja.dias}</p>
									<p class="text-sm text-text-secondary">{franja.horario}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</Card>

			<!-- CTA Principal -->
			<div class="text-center">
				<Button variant="whatsapp" size="lg" onclick={handleContact}>
					<MessageCircle size={24} />
					Escribinos por WhatsApp
				</Button>
				<p class="text-sm text-text-secondary mt-4">
					Te respondemos en minutos y te enviamos tu cotización personalizada
				</p>
			</div>
		</div>
	</div>
</section>

<script lang="ts">
	/**
	 * Footer del sitio
	 */

	import { MessageCircle, Mail, Instagram, Facebook } from 'lucide-svelte';
	import { contactInfo } from '$lib/config/contact';
	import { scrollToSection } from '$lib/utils/scroll';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';

	const currentYear = new Date().getFullYear();

	let quickLinks = $derived(getVisibleNavItems($sectionsVisibilityFlag));

	const socialLinks = [
		{
			name: 'WhatsApp',
			url: `https://wa.me/${contactInfo.whatsappNumber}`,
			icon: MessageCircle
		},
		{
			name: 'Instagram',
			url: contactInfo.socialMedia.instagram,
			icon: Instagram,
			show: !!contactInfo.socialMedia.instagram
		},
		{
			name: 'Facebook',
			url: contactInfo.socialMedia.facebook,
			icon: Facebook,
			show: !!contactInfo.socialMedia.facebook
		}
	];

	// Foco visible sobre fondo tinta (el contorno tinta global no se veria)
	const focusRing =
		'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema';

	function handleLinkClick(event: MouseEvent, href: string) {
		if (href.startsWith('#')) {
			event.preventDefault();
			const sectionId = href.replace('#', '');
			scrollToSection(sectionId);
		}
	}
</script>

<footer class="bg-tinta text-crema">
	<div class="container mx-auto px-4 md:px-16 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Columna 1: Marca -->
			<div>
				<img
					src="/brand/logo/svg/printo-wordmark-crema.svg"
					alt={contactInfo.businessName}
					class="h-10 w-auto mb-4"
				/>
				<p class="text-crema/75 mb-4">
					Servicios profesionales de impresión 3D en {contactInfo.city}. Calidad, rapidez y
					atención personalizada.
				</p>
				<!-- Redes Sociales -->
				<div class="flex gap-3">
					{#each socialLinks as social (social.name)}
						{#if social.show !== false}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="w-11 h-11 rounded-full border-2 border-crema hover:bg-crema hover:text-tinta flex items-center justify-center transition-colors {focusRing}"
								aria-label={social.name}
							>
								<social.icon size={20} />
							</a>
						{/if}
					{/each}
				</div>
			</div>

			<!-- Columna 2: Enlaces Rápidos -->
			<div>
				<h3 class="text-lg mb-4">Enlaces rápidos</h3>
				<ul class="space-y-2">
					{#each quickLinks as link (link.href)}
						<li>
							<a
								href={link.href}
								class="text-crema/75 hover:text-crema hover:underline transition-colors rounded {focusRing}"
								onclick={(e) => handleLinkClick(e, link.href)}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Columna 3: Contacto -->
			<div>
				<h3 class="text-lg mb-4">Contacto</h3>
				<ul class="space-y-3">
					<li class="flex items-start gap-2">
						<MessageCircle size={20} class="mt-0.5 text-whatsapp flex-shrink-0" />
						<div>
							<p class="text-crema/75 text-sm">WhatsApp</p>
							<a
								href="https://wa.me/{contactInfo.whatsappNumber}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-crema hover:underline rounded {focusRing}"
							>
								{contactInfo.whatsappDisplayNumber}
							</a>
						</div>
					</li>
					<li class="flex items-start gap-2">
						<Instagram size={20} class="mt-0.5 text-crema flex-shrink-0" />
						<div>
							<p class="text-crema/75 text-sm">Instagram</p>
							<a
								href={contactInfo.socialMedia.instagram}
								target="_blank"
								rel="noopener noreferrer"
								class="text-crema hover:underline rounded {focusRing}"
							>
								@printo.uy
							</a>
						</div>
					</li>
					<li class="flex items-start gap-2">
						<Mail size={20} class="mt-0.5 text-crema flex-shrink-0" />
						<div>
							<p class="text-crema/75 text-sm">Email</p>
							<a
								href="mailto:{contactInfo.email}"
								class="text-crema hover:underline rounded {focusRing}"
							>
								{contactInfo.email}
							</a>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- Separador -->
		<div class="border-t border-crema/20 mt-8 pt-8 text-center text-crema/75 text-sm">
			<p>&copy; {currentYear} {contactInfo.businessName}. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>

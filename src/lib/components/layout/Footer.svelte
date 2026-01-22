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

	function handleLinkClick(event: MouseEvent, href: string) {
		if (href.startsWith('#')) {
			event.preventDefault();
			const sectionId = href.replace('#', '');
			scrollToSection(sectionId);
		}
	}
</script>

<footer class="bg-text text-white">
	<div class="container mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Columna 1: Marca -->
			<div>
				<div class="flex items-center gap-2 mb-4">
					<img src="/images/logo-with-no-bg.png" alt="Logo" class="w-10 h-10 object-contain" />
					<span class="font-bold text-xl">{contactInfo.businessName}</span>
				</div>
				<p class="text-gray-400 mb-4">
					Servicios profesionales de impresión 3D en {contactInfo.city}. Calidad, rapidez y
					atención personalizada.
				</p>
				<!-- Redes Sociales -->
				<div class="flex gap-3">
					{#each socialLinks as social}
						{#if social.show !== false}
							<a
								href={social.url}
								target="_blank"
								rel="noopener noreferrer"
								class="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-colors"
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
				<h3 class="font-bold text-lg mb-4">Enlaces Rápidos</h3>
				<ul class="space-y-2">
					{#each quickLinks as link}
						<li>
							<a
								href={link.href}
								class="text-gray-400 hover:text-primary transition-colors"
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
				<h3 class="font-bold text-lg mb-4">Contacto</h3>
				<ul class="space-y-3">
					<li class="flex items-start gap-2">
						<MessageCircle size={20} class="mt-0.5 text-whatsapp flex-shrink-0" />
						<div>
							<p class="text-gray-400 text-sm">WhatsApp</p>
							<a
								href="https://wa.me/{contactInfo.whatsappNumber}"
								target="_blank"
								rel="noopener noreferrer"
								class="text-white hover:text-primary transition-colors"
							>
								{contactInfo.whatsappDisplayNumber}
							</a>
						</div>
					</li>
					<li class="flex items-start gap-2">
						<Instagram size={20} class="mt-0.5 text-primary flex-shrink-0" />
						<div>
							<p class="text-gray-400 text-sm">Instagram</p>
							<a
								href={contactInfo.socialMedia.instagram}
								target="_blank"
								rel="noopener noreferrer"
								class="text-white hover:text-primary transition-colors"
							>
								@printo.uy
							</a>
						</div>
					</li>
					<li class="flex items-start gap-2">
						<Mail size={20} class="mt-0.5 text-primary flex-shrink-0" />
						<div>
							<p class="text-gray-400 text-sm">Email</p>
							<a
								href="mailto:{contactInfo.email}"
								class="text-white hover:text-primary transition-colors"
							>
								{contactInfo.email}
							</a>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- Separador -->
		<div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
			<p>&copy; {currentYear} {contactInfo.businessName}. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>

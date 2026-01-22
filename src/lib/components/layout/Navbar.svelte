<script lang="ts">
	/**
	 * Barra de navegación principal
	 */

	import { Menu, X } from 'lucide-svelte';
	import { uiStore } from '$lib/stores/uiStore';
	import { contactInfo } from '$lib/config/contact';
	import { scrollToSection } from '$lib/utils/scroll';
	import { openWhatsApp } from '$lib/utils/whatsapp';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';
	import Button from '../ui/Button.svelte';

	let isMobileMenuOpen = $derived($uiStore.isMobileMenuOpen);
	let logoError = $state(false);

	let menuItems = $derived(getVisibleNavItems($sectionsVisibilityFlag));

	function handleNavClick(event: MouseEvent, href: string) {
		event.preventDefault();
		const sectionId = href.replace('#', '');
		scrollToSection(sectionId);
		uiStore.closeMobileMenu();
	}

	function toggleMenu() {
		uiStore.toggleMobileMenu();
	}

	function handleCTA() {
		openWhatsApp();
	}
</script>

<nav class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="#hero" class="flex items-center gap-3" onclick={(e) => handleNavClick(e, '#hero')}>
				{#if !logoError}
					<img
						src="/images/logo animado.gif"
						alt={contactInfo.businessName}
						class="h-12 w-auto object-contain"
						onerror={() => (logoError = true)}
					/>
				{:else}
					<img
						src="/images/logo nombre H recortado.png"
						alt={contactInfo.businessName}
						class="h-12 w-auto object-contain"
					/>
				{/if}
				<span class="font-bold text-xl text-text hidden sm:block">
					{contactInfo.businessName}
				</span>
			</a>

			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center gap-6">
				{#each menuItems as item}
					<a
						href={item.href}
						class="text-text-secondary hover:text-primary font-medium transition-colors"
						onclick={(e) => handleNavClick(e, item.href)}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- CTA Button Desktop -->
			<div class="hidden md:block">
				<Button variant="whatsapp" size="md" onclick={handleCTA}>Cotizar Ahora</Button>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden p-2 text-text hover:text-primary transition-colors"
				onclick={toggleMenu}
				aria-label="Toggle menu"
			>
				{#if isMobileMenuOpen}
					<X size={24} />
				{:else}
					<Menu size={24} />
				{/if}
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMobileMenuOpen}
			<div class="md:hidden py-4 border-t border-gray-200">
				<div class="flex flex-col gap-3">
					{#each menuItems as item}
						<a
							href={item.href}
							class="px-4 py-2 text-text-secondary hover:text-primary hover:bg-background-secondary rounded-lg font-medium transition-colors"
							onclick={(e) => handleNavClick(e, item.href)}
						>
							{item.label}
						</a>
					{/each}
					<div class="px-4 pt-2">
						<Button variant="whatsapp" size="md" fullWidth onclick={handleCTA}>Cotizar Ahora</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

<!-- Spacer para compensar el navbar fixed -->
<div class="h-16"></div>

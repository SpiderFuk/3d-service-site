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

<nav class="fixed top-0 left-0 right-0 bg-background border-b-2 border-tinta z-50">
	<div class="container mx-auto px-4 md:px-16">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="#hero" class="flex items-center min-h-11" onclick={(e) => handleNavClick(e, '#hero')}>
				<img
					src="/brand/logo/svg/printo-wordmark-cobalto.svg"
					alt={contactInfo.businessName}
					class="h-9 sm:h-10 w-auto"
				/>
			</a>

			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center gap-1">
				{#each menuItems as item (item.href)}
					<a
						href={item.href}
						class="px-4 py-2 rounded-full text-text-secondary hover:text-tinta hover:bg-white font-medium transition-colors"
						onclick={(e) => handleNavClick(e, item.href)}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<!-- CTA Button Desktop -->
			<div class="hidden md:block">
				<Button variant="whatsapp" size="md" onclick={handleCTA}>Pedir presupuesto</Button>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden w-11 h-11 flex items-center justify-center rounded-full text-text hover:text-primary transition-colors"
				onclick={toggleMenu}
				aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				aria-expanded={isMobileMenuOpen}
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
			<div class="md:hidden py-4 border-t-2 border-tinta">
				<div class="flex flex-col gap-3">
					{#each menuItems as item (item.href)}
						<a
							href={item.href}
							class="min-h-11 flex items-center px-4 text-text-secondary hover:text-tinta hover:bg-white rounded-full font-medium transition-colors"
							onclick={(e) => handleNavClick(e, item.href)}
						>
							{item.label}
						</a>
					{/each}
					<div class="px-4 pt-2">
						<Button variant="whatsapp" size="md" fullWidth onclick={handleCTA}>Pedir presupuesto</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

<!-- Spacer para compensar el navbar fixed -->
<div class="h-16"></div>

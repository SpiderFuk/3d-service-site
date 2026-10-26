<script lang="ts">
	/**
	 * Barra de navegación fija. Placeholder: menú de teléfono, link actual y botón
	 * "Pedir presupuesto" se construyen en el track rebrand-nav-hero.
	 */
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';

	const items = $derived(getVisibleNavItems($sectionsVisibilityFlag));
</script>

<header class="sticky top-0 z-20 border-b bg-crema">
	<nav
		aria-label="Principal"
		class="mx-auto flex max-w-[1440px] items-center justify-between gap-7 px-gutter py-3.5"
	>
		<a href="#inicio" aria-label="printo, ir al inicio" class="flex min-h-tap items-center">
			<img src="/brand/printo-wordmark-cobalto.svg" alt="" class="block h-auto w-28 max-desk:w-24" />
		</a>
		<ul class="m-0 flex list-none items-center gap-8 p-0 max-desk:hidden">
			{#each items as item (item.href)}
				<li>
					<a
						href={item.href}
						aria-label={item.ariaLabel}
						class="inline-flex min-h-tap items-center font-medium no-underline">{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

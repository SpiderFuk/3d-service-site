<script lang="ts">
	/**
	 * Barra de navegación fija (01 Navegación, BUILD.md)
	 *
	 * Desktop: logo (112 px, a #inicio) y los cuatro links del menú.
	 * Queda dentro de <header>: el Hero mide su alto para saber si la barra tapa su botón.
	 *
	 * Link actual: un IntersectionObserver sobre las secciones con ancla escribe
	 * uiStore.activeSection; solo los cuatro destinos del menú marcan un link.
	 */
	import { tick } from 'svelte';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { uiStore } from '$lib/stores/uiStore';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';
	import { observarSeccionActual } from '$lib/utils/scroll';

	const items = $derived(getVisibleNavItems($sectionsVisibilityFlag));
	const seccionActual = $derived($uiStore.activeSection);

	// Se vuelve a observar cuando los flags muestran u ocultan secciones
	$effect(() => {
		void $sectionsVisibilityFlag;
		let activo = true;
		let desconectar = () => {};

		tick().then(() => {
			if (!activo) return;
			const secciones = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'));
			desconectar = observarSeccionActual(secciones, (id) => uiStore.setActiveSection(id));
		});

		return () => {
			activo = false;
			desconectar();
		};
	});
</script>

<header class="barra">
	<nav aria-label="Principal" class="barra-nav">
		<a href="#inicio" aria-label="printo, ir al inicio" class="barra-logo">
			<img src="/brand/printo-wordmark-cobalto.svg" alt="" />
		</a>

		<ul class="barra-enlaces">
			{#each items as item (item.href)}
				{@const actual = seccionActual === item.href.slice(1)}
				<li>
					<a
						href={item.href}
						aria-label={item.ariaLabel}
						aria-current={actual ? 'location' : undefined}
						class="barra-enlace"
						class:actual>{item.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.barra {
		position: sticky;
		top: 0;
		z-index: 20;
		border-bottom: var(--border);
		background: var(--color-crema);
	}

	.barra-nav {
		max-width: 1440px;
		margin: 0 auto;
		padding: 14px var(--gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px 28px;
	}

	.barra-logo {
		display: flex;
		align-items: center;
		min-height: var(--tap-min);
	}

	.barra-logo img {
		display: block;
		width: 112px;
		height: auto;
	}

	.barra-enlaces {
		display: flex;
		align-items: center;
		gap: 4px 32px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.barra-enlace {
		position: relative;
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		color: var(--color-tinta);
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
	}

	.barra-enlace:hover {
		color: var(--color-cobalto);
	}

	/* Link de la sección en vista: 600 y barra cobalto de 4 px debajo */
	.barra-enlace.actual {
		font-weight: 600;
	}

	.barra-enlace.actual::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 4px;
		height: 4px;
		border-radius: var(--radius-pill);
		background: var(--color-cobalto);
	}

	/* Teléfono: solo CSS, sin display en línea que pise la media query */
	@media (max-width: 959px) {
		.barra-logo img {
			width: 96px;
		}

		.barra-enlaces {
			display: none;
		}
	}
</style>

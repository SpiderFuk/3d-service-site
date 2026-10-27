<script lang="ts">
	/**
	 * Barra de navegación fija (01 Navegación, BUILD.md)
	 *
	 * Desktop: logo (112 px, a #inicio) y los cuatro links del menú.
	 * Teléfono (hasta 959 px): barra de 64 px, logo de 96 px, píldora "Presupuesto"
	 * (misma regla que el botón de la barra) y botón redondo de menú. El menú abre un panel
	 * con los links (filas de 56 px, el actual en mantequilla), Instagram, el email y
	 * "Pedir presupuesto" a todo el ancho.
	 * Queda dentro de <header>: el Hero mide su alto para saber si la barra tapa su botón.
	 *
	 * "Pedir presupuesto" (cobalto) aparece solo cuando el botón del Hero salió de vista
	 * (heroCtaVisible). Su lugar está reservado siempre: la barra no cambia de tamaño
	 * al aparecer el botón, así el margen del observer del Hero sigue siendo correcto.
	 *
	 * Link actual: un IntersectionObserver sobre las secciones con ancla escribe
	 * uiStore.activeSection; solo los cuatro destinos del menú marcan un link.
	 */
	import { onDestroy, tick } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import CarreteChico from './CarreteChico.svelte';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { uiStore, heroCtaVisible } from '$lib/stores/uiStore';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { contactInfo } from '$lib/config/contact';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';
	import { observarSeccionActual } from '$lib/utils/scroll';

	const items = $derived(getVisibleNavItems($sectionsVisibilityFlag));
	const seccionActual = $derived($uiStore.activeSection);
	const menuAbierto = $derived($uiStore.isMobileMenuOpen);

	let barra: HTMLElement;
	let menuBoton: HTMLButtonElement;
	let panel: HTMLDivElement;

	/** Cierra el menú; por defecto devuelve el foco al botón de menú */
	function cerrarMenu(devolverFoco = true) {
		if (!menuAbierto) return;
		uiStore.closeMobileMenu();
		if (devolverFoco) menuBoton?.focus({ preventScroll: true });
	}

	/** Abre el menú y lleva el foco al primer link */
	async function abrirMenu() {
		uiStore.toggleMobileMenu();
		await tick();
		panel?.querySelector<HTMLElement>('a')?.focus();
	}

	function alternarMenu() {
		if (menuAbierto) cerrarMenu();
		else abrirMenu();
	}

	/**
	 * Tocar cualquier link del panel (ancla, Instagram, email, WhatsApp) cierra el menú.
	 * Con los links externos el foco vuelve al botón de menú; con las anclas lo maneja
	 * el navegador (el siguiente Tab sigue desde la sección destino).
	 */
	function alTocarPanel(evento: MouseEvent) {
		const link = (evento.target as HTMLElement).closest('a');
		if (link) cerrarMenu(!link.getAttribute('href')?.startsWith('#'));
	}

	/** Si el foco sale de la barra con Tab (p. ej. después del último link), se cierra */
	function alSalirFoco(evento: FocusEvent) {
		const destino = evento.relatedTarget as Node | null;
		if (menuAbierto && destino && !barra.contains(destino)) cerrarMenu(false);
	}

	// Mientras el menú está abierto: bloquear el scroll del body, Escape cierra y
	// pasar a desktop (más de 959 px) cierra. La limpieza corre al cerrar por cualquier
	// camino y al destruir el componente, así el bloqueo siempre se libera.
	$effect(() => {
		if (!menuAbierto) return;

		const overflowPrevio = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const alTeclear = (evento: KeyboardEvent) => {
			if (evento.key === 'Escape') {
				evento.preventDefault();
				cerrarMenu();
			}
		};
		const escritorio = window.matchMedia('(min-width: 960px)');
		const alCambiarAncho = () => {
			if (escritorio.matches) cerrarMenu(false);
		};

		window.addEventListener('keydown', alTeclear);
		escritorio.addEventListener('change', alCambiarAncho);

		return () => {
			document.body.style.overflow = overflowPrevio;
			window.removeEventListener('keydown', alTeclear);
			escritorio.removeEventListener('change', alCambiarAncho);
		};
	});

	// Si la barra se desmonta (p. ej. por flags), el menú no queda abierto en el store
	onDestroy(() => uiStore.closeMobileMenu());

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

<header class="barra" bind:this={barra} onfocusout={alSalirFoco}>
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

		<div class="barra-cta">
			{#if !$heroCtaVisible}
				<Button
					variant="quote"
					href={whatsappUrl(mensajes.presupuesto)}
					class="barra-cta-boton"
					aria-label="Pedir presupuesto por WhatsApp"
				>
					<CarreteChico />
					Pedir presupuesto
				</Button>
			{/if}
		</div>

		<!-- Solo teléfono. Está siempre en el DOM (vacío en desktop): así el espacio entre
		     los links queda como en la referencia. -->
		<div class="barra-movil">
			{#if !$heroCtaVisible}
				<Button
					variant="quote"
					href={whatsappUrl(mensajes.presupuesto)}
					class="barra-pildora"
					aria-label="Presupuesto por WhatsApp"
				>
					<CarreteChico tamano="sm" class="pildora-carrete" />
					Presupuesto
				</Button>
			{/if}
			<button
				type="button"
				id="menu-boton"
				bind:this={menuBoton}
				class="barra-menu"
				class:abierto={menuAbierto}
				aria-controls="menu-movil"
				aria-expanded={menuAbierto}
				aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
				onclick={alternarMenu}
			>
				<span class="barra-menu-rayas" aria-hidden="true"><span></span><span></span><span></span></span>
			</button>
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<!-- El clic se delega a los links del panel (que ya son interactivos con teclado) -->
		<div
			id="menu-movil"
			class="panel"
			hidden={!menuAbierto}
			bind:this={panel}
			onclick={alTocarPanel}
		>
			<ul class="panel-enlaces">
				{#each items as item (item.href)}
					{@const actual = seccionActual === item.href.slice(1)}
					<li>
						<a
							href={item.href}
							aria-label={item.ariaLabel}
							aria-current={actual ? 'location' : undefined}
							class="panel-enlace"
							class:actual>{item.label}</a
						>
					</li>
				{/each}
			</ul>

			<div class="panel-canales">
				<a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener">Instagram</a>
				<a href="mailto:{contactInfo.email}">{contactInfo.email}</a>
			</div>

			<Button
				variant="quote"
				size="lg"
				full
				href={whatsappUrl(mensajes.presupuesto)}
				aria-label="Pedir presupuesto por WhatsApp"
			>
				<CarreteChico />
				Pedir presupuesto
			</Button>
		</div>
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

	/* Lugar fijo del botón: mismo ancho y alto con o sin botón (sin saltos de la barra) */
	.barra-cta {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		min-width: 236px;
		min-height: var(--tap-min);
	}

	/* 44 px de alto, como los links: la barra mide lo mismo que sin botón */
	.barra-cta :global(.barra-cta-boton) {
		height: var(--tap-min);
		/* Menos aire a la izquierda: el carrete ya ocupa ese lugar */
		padding-left: 12px;
		animation: aparecer 0.15s ease-out;
	}

	@keyframes aparecer {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.barra-cta :global(.barra-cta-boton),
		.barra-movil :global(.barra-pildora) {
			animation: none;
		}

		.barra-menu-rayas span {
			transition: none;
		}
	}

	.barra-movil {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Píldora y botón de menú: solo en el teléfono */
	.barra-movil :global(.barra-pildora),
	.barra-menu {
		display: none;
	}

	/* Botón redondo de menú con tres rayas dibujadas con CSS (cruz cuando está abierto) */
	.barra-menu {
		align-items: center;
		justify-content: center;
		width: var(--tap-min);
		height: var(--tap-min);
		padding: 0;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-blanco);
		cursor: pointer;
	}

	.barra-menu-rayas {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.barra-menu-rayas span {
		width: 18px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-tinta);
		transition: transform 0.15s ease, opacity 0.15s ease;
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(2) {
		opacity: 0;
	}

	.barra-menu.abierto .barra-menu-rayas span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	/* Panel del menú: debajo de la barra (64 px + 2 px de borde), ocupa el resto de la pantalla */
	.panel {
		display: none;
		position: fixed;
		top: 66px;
		right: 0;
		bottom: 0;
		left: 0;
		flex-direction: column;
		gap: 20px;
		padding: 16px var(--gutter) 24px;
		overflow-y: auto;
		overscroll-behavior: contain;
		background: var(--color-crema);
	}

	.panel-enlaces {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.panel-enlace {
		display: flex;
		align-items: center;
		min-height: 56px;
		padding: 0 20px;
		border: var(--border);
		border-radius: var(--radius-md);
		background: var(--color-blanco);
		color: var(--color-tinta);
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-decoration: none;
	}

	.panel-enlace:hover {
		color: var(--color-tinta);
	}

	.panel-enlace.actual {
		background: var(--color-mantequilla);
	}

	.panel-canales {
		display: flex;
		flex-wrap: wrap;
		gap: 0 24px;
	}

	.panel-canales a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-weight: 600;
	}

	/* Teléfono: solo CSS, sin display en línea que pise la media query */
	@media (max-width: 959px) {
		.barra-nav {
			height: 64px;
			padding: 0 var(--gutter);
		}

		.barra-logo img {
			width: 96px;
		}

		.barra-menu {
			display: flex;
		}

		/* El panel se muestra solo en el teléfono y solo abierto (sin el atributo hidden) */
		.panel:not([hidden]) {
			display: flex;
		}

		/* Píldora chica "Presupuesto": 44 px de alto para el dedo */
		.barra-movil :global(.barra-pildora) {
			display: inline-flex;
			height: var(--tap-min);
			gap: 8px;
			padding: 0 16px 0 10px;
			font-size: 15px;
			animation: aparecer 0.15s ease-out;
		}

		.barra-enlaces,
		.barra-cta {
			display: none;
		}
	}

	/* Bajo 360 px la píldora pierde el carrete para que entre todo */
	@media (max-width: 359px) {
		.barra-movil :global(.pildora-carrete) {
			display: none;
		}

		.barra-movil :global(.barra-pildora) {
			padding: 0 14px;
		}
	}
</style>

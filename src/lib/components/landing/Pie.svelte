<script lang="ts">
	/**
	 * Pie de página: sección 11 de BUILD.md
	 *
	 * Arriba, el wordmark (68 % del ancho, 60 % en teléfono) y a su derecha, alineada
	 * abajo, la frase. La frase queda siempre a la derecha del logo: la fila no
	 * envuelve y la frase se achica (min-width: 0) en vez de bajar.
	 *
	 * Después, una línea tinta de 2 px, el menú (nav "Pie", con los mismos items
	 * visibles que la barra) y los canales. Cada link tiene 44 px de alto de toque.
	 */
	import { contactInfo } from '$lib/config/contact';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { sectionsVisibilityFlag } from '$lib/stores/featureFlagsStore';
	import { getVisibleNavItems } from '$lib/utils/visibilityHelpers';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	const items = $derived(getVisibleNavItems($sectionsVisibilityFlag));
	const anio = new Date().getFullYear();
</script>

<footer class="pie">
	<div class="pie-arriba">
		<a href="#inicio" class="pie-logo" aria-label="printo, volver al inicio">
			<!-- width/height: proporción del viewBox, para reservar el alto antes de cargar -->
			<img src="/brand/printo-wordmark-cobalto.svg" alt="" width="2813" height="927" />
		</a>
		<p class="pie-frase">Impresión 3D hecha en Uruguay.</p>
	</div>

	<div class="pie-links">
		<nav class="pie-fila" aria-label="Pie">
			{#each items as item (item.href)}
				<a href={item.href} aria-label={item.ariaLabel}>{item.label}</a>
			{/each}
		</nav>
		<div class="pie-fila">
			<a href={whatsappUrl(mensajes.contacto)} target="_blank" rel="noopener">WhatsApp</a>
			<a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener">Instagram</a>
			<a href="mailto:{contactInfo.email}">{contactInfo.email}</a>
		</div>
	</div>

	<p class="m-0 text-sm text-tinta-suave">© {anio} printo · Montevideo y Las Piedras, Uruguay</p>
</footer>

<style>
	.pie {
		display: flex;
		flex-direction: column;
		gap: 36px;
		max-width: var(--page-max);
		margin: 0 auto;
		padding: 72px var(--gutter) 40px;
	}

	.pie-arriba {
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px;
	}

	.pie-logo {
		display: block;
		flex: 0 0 68%;
		min-width: 0;
	}

	.pie-logo img {
		display: block;
		width: 100%;
		height: auto;
	}

	.pie-frase {
		flex: 1 1 auto;
		min-width: 0;
		margin: 0;
		font-family: var(--font-display);
		font-size: 32px;
		font-weight: 700;
		line-height: 1.05;
		letter-spacing: -0.01em;
		text-align: right;
	}

	/* Menú a la izquierda, canales a la derecha */
	.pie-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 16px 32px;
		padding-top: 24px;
		border-top: var(--border);
	}

	.pie-fila {
		display: flex;
		flex-wrap: wrap;
		gap: 0 24px;
		font-size: 16px;
	}

	.pie-fila a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		font-weight: 600;
	}

	@media (max-width: 959px) {
		.pie {
			gap: 16px;
			padding: 32px var(--gutter) 28px;
		}

		.pie-arriba {
			gap: 12px;
		}

		.pie-logo {
			flex-basis: 60%;
		}

		.pie-frase {
			font-size: 15px;
			line-height: 1.15;
		}

		/* Teléfono: las dos filas centradas, una debajo de la otra */
		.pie-links {
			flex-direction: column;
			gap: 0;
			padding-top: 8px;
		}

		.pie-fila {
			justify-content: center;
			gap: 0 16px;
			font-size: 14px;
		}
	}

	@media (max-width: 359px) {
		.pie-frase {
			font-size: 13px;
		}
	}
</style>

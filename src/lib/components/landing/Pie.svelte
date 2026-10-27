<script lang="ts">
	/**
	 * Pie de página: sección 11 de BUILD.md
	 *
	 * Arriba, el wordmark (68 % del ancho, 60 % en teléfono) y a su derecha, alineada
	 * abajo, la frase. La frase queda siempre a la derecha del logo: la fila no
	 * envuelve y la frase se achica (min-width: 0) en vez de bajar.
	 */
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
	}

	@media (max-width: 359px) {
		.pie-frase {
			font-size: 13px;
		}
	}
</style>

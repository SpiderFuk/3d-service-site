<script lang="ts">
	/**
	 * Eyebrow + titular en dos frases (la segunda en color de acento)
	 *
	 * Como en la referencia, solo size="xl" fuerza el salto de línea entre frases.
	 *
	 * size="lg": 56 px desktop / 36 px teléfono (titulares de sección)
	 * size="xl": 72 px desktop / 44 px teléfono / 40 px bajo 360 px (Hero y Contacto)
	 * Para otro tamaño en teléfono, definir --headline-size-phone en el contenedor.
	 */

	interface Props {
		/** id del titular (lo usa aria-labelledby de la sección) */
		id: string;
		/** Se omite cuando la sección dibuja su propia etiqueta (Hero) */
		eyebrow?: string;
		primera: string;
		segunda: string;
		level?: 1 | 2;
		size?: 'lg' | 'xl';
		acento?: 'cobalto' | 'mantequilla';
	}

	let {
		id,
		eyebrow,
		primera,
		segunda,
		level = 2,
		size = 'lg',
		acento = 'cobalto'
	}: Props = $props();
</script>

{#if eyebrow}
	<p class="eyebrow">{eyebrow}</p>
{/if}
<svelte:element this={`h${level}`} {id} class="headline headline-{size}">
	<!-- xl corta la línea; lg deja que la segunda frase siga y se acomode (max-width 15em).
	     El espacio va en el mismo nodo de texto que la primera frase: un nodo con solo
	     un espacio lo descarta el árbol de accesibilidad y el nombre queda "Más simple,imposible." -->
	{size === 'xl' ? primera : `${primera} `}{#if size === 'xl'}<br />{/if}<span
		style:color="var(--color-{acento})">{segunda}</span
	>
</svelte:element>

<style>
	.headline {
		margin: 0;
		font-family: var(--font-display);
		font-weight: 800;
		line-height: 0.95;
		letter-spacing: -0.04em;
	}

	.headline-lg {
		max-width: 15em;
		font-size: 56px;
	}

	.headline-xl {
		font-size: 72px;
	}

	@media (max-width: 959px) {
		.headline-lg {
			font-size: var(--headline-size-phone, 36px);
		}

		.headline-xl {
			font-size: var(--headline-size-phone, 44px);
		}
	}

	@media (max-width: 359px) {
		.headline-xl {
			font-size: var(--headline-size-phone, 40px);
		}
	}
</style>

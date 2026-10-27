<script lang="ts" module>
	import { mensajes } from '$lib/config/whatsappMessages';

	/** Claves del catálogo cuyo mensaje es texto fijo (no función) */
	export type MensajeFijo = {
		[K in keyof typeof mensajes]: (typeof mensajes)[K] extends string ? K : never;
	}[keyof typeof mensajes];
</script>

<script lang="ts">
	/**
	 * Tarjeta de un camino (Tres caminos): foto sobre fondo de color, título h3,
	 * texto, caja de nota opcional, link opcional y botón a WhatsApp con su mensaje.
	 *
	 * La foto ocupa todo el recuadro (object-fit: cover); el color de fondo se ve
	 * mientras carga. Para cambiarla alcanza con reemplazar el archivo.
	 */
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { whatsappUrl } from '$lib/utils/whatsapp';

	interface Props {
		/** Color de apoyo detrás de la foto */
		fondo: 'mantequilla' | 'menta' | 'tomate';
		foto: { src: string; alt: string };
		titulo: string;
		texto: string;
		/** Caja crema bajo el texto */
		nota?: string;
		/** Link interno bajo el texto (p. ej. al visor) */
		enlace?: { href: string; texto: string };
		/** Texto visible del botón; el nombre accesible agrega "por WhatsApp" */
		boton: string;
		/** Clave del mensaje en $lib/config/whatsappMessages */
		mensaje: MensajeFijo;
	}

	let { fondo, foto, titulo, texto, nota, enlace, boton, mensaje }: Props = $props();
</script>

<Card as="li" radius="card" class="flex overflow-hidden">
	<div class="camino">
		<div class="foto" style:background="var(--color-{fondo})">
			<img src={foto.src} alt={foto.alt} width="1200" height="900" loading="lazy" />
		</div>
		<div class="cuerpo">
			<h3 class="titulo">{titulo}</h3>
			<p class="texto">{texto}</p>
			{#if nota}
				<p class="nota">{nota}</p>
			{/if}
			{#if enlace}
				<a class="enlace" href={enlace.href}>{enlace.texto}</a>
			{/if}
			<div class="acciones">
				<Button href={whatsappUrl(mensajes[mensaje])} aria-label="{boton} por WhatsApp">
					{boton}
				</Button>
			</div>
		</div>
	</div>
</Card>

<style>
	.camino {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.foto {
		position: relative;
		aspect-ratio: 4 / 3;
		border-bottom: var(--border);
	}

	.foto img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cuerpo {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 24px 24px 28px;
	}

	.titulo {
		margin: 0;
		font-family: var(--font-display);
		font-size: 30px;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	.texto {
		margin: 0;
		color: var(--color-tinta-suave);
	}

	.nota {
		margin: 0;
		padding: 10px 14px;
		border-radius: 16px;
		background: var(--color-crema);
		font-size: 14px;
		font-weight: 500;
	}

	.enlace {
		display: inline-flex;
		align-items: center;
		align-self: flex-start;
		min-height: var(--tap-min);
		font-weight: 600;
	}

	.acciones {
		margin-top: auto;
		padding-top: 8px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 20px;
	}

	/* Regla extra dentro del desktop chico: bajo 1100 px la foto va a la izquierda */
	@media (min-width: 960px) and (max-width: 1099px) {
		.camino {
			flex-direction: row;
		}

		.foto {
			flex: 0 0 40%;
			aspect-ratio: auto;
			border-bottom: 0;
			border-right: var(--border);
		}
	}

	/* Teléfono: foto 16:9 arriba, botón a todo el ancho */
	@media (max-width: 959px) {
		.foto {
			aspect-ratio: 16 / 9;
		}

		.cuerpo {
			padding: 16px 16px 20px;
		}

		.titulo {
			font-size: 24px;
		}

		.acciones {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>

<script lang="ts">
	/**
	 * Contacto (#contacto): sección 10 de BUILD.md
	 *
	 * La única sección cobalto. La clase global .on-cobalto (app.css) pasa los
	 * links a crema (hover mantequilla) y el anillo de foco a crema; no se
	 * redefinen acá.
	 */
	import Button from '$lib/components/ui/Button.svelte';
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import { contactInfo } from '$lib/config/contact';
	import { abiertoAhora } from '$lib/stores/hoursStore';
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
	import { horarioCorto, horarioFrase, horarioLargo } from '$lib/utils/hours';

	const [horarioSemana, horarioSabado] = horarioLargo();
</script>

<Section
	id="contacto"
	class="on-cobalto border-t bg-cobalto text-crema [--headline-size-phone:40px] max-desk:[--section-pb:40px]"
	contentClass="flex flex-col gap-14 max-desk:gap-5"
>
	<div class="contacto-arriba">
		<div class="contacto-titulo">
			<SectionHeading
				id="contacto-titulo"
				eyebrow="Contacto"
				primera="Tu próxima pieza"
				segunda="empieza con un hola."
				size="xl"
				acento="mantequilla"
			/>
		</div>

		<div class="contacto-acciones">
			<Button
				variant="butter"
				size="lg"
				href={whatsappUrl(mensajes.contacto)}
				class="contacto-whatsapp"
				aria-label="Escribinos por WhatsApp al {contactInfo.whatsappDisplayNumber}"
			>
				WhatsApp <span class="contacto-numero">{contactInfo.whatsappDisplayNumber}</span>
			</Button>

			<!-- Se actualiza sola al abrir o cerrar (abiertoAhora se recalcula cada minuto) -->
			<p class="contacto-estado">
				<span class="contacto-punto" class:abierto={$abiertoAhora} aria-hidden="true"></span>
				{$abiertoAhora ? 'Taller abierto ahora' : 'Cerrado ahora · te respondemos apenas abramos'}
			</p>
		</div>
	</div>

	<dl class="contacto-datos">
		<div>
			<dt>Instagram</dt>
			<dd>
				<a
					class="contacto-link"
					href={contactInfo.socialMedia.instagram}
					target="_blank"
					rel="noopener">{contactInfo.socialMedia.instagramHandle}</a
				>
			</dd>
		</div>
		<div>
			<dt>Email</dt>
			<dd><a class="contacto-link" href="mailto:{contactInfo.email}">{contactInfo.email}</a></dd>
		</div>
		<div>
			<dt>Horario</dt>
			<dd>
				<span class="horario-largo">{horarioSemana}<br />{horarioSabado}</span>
				<!-- Teléfono: versión corta a la vista, la completa para lectores de pantalla -->
				<span class="horario-corto" aria-hidden="true">{horarioCorto()}</span>
				<span class="horario-lector sr-only">{horarioFrase()}</span>
			</dd>
		</div>
		<div>
			<dt>Dónde</dt>
			<dd>{contactInfo.city}</dd>
		</div>
	</dl>
</Section>

<style>
	/* Titular a la izquierda; WhatsApp y la píldora a la derecha, alineados abajo */
	.contacto-arriba {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 32px 64px;
	}

	.contacto-titulo {
		display: flex;
		flex: 1 1 560px;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
	}

	.contacto-acciones {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
	}

	/* Button butter (lg) a 64 px de alto como pide BUILD.md */
	.contacto-acciones :global(.contacto-whatsapp) {
		height: 64px;
		padding: 0 30px;
	}

	/* Píldora crema "abierto ahora" con punto menta (abierto) o tomate (cerrado) */
	.contacto-estado {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		padding: 7px 14px;
		border: var(--border);
		border-radius: var(--radius-pill);
		background: var(--color-crema);
		color: var(--color-tinta);
		font-size: 14px;
		font-weight: 600;
		line-height: 1.5;
	}

	.contacto-punto {
		flex: none;
		width: 10px;
		height: 10px;
		border: var(--border);
		border-radius: 50%;
		background: var(--color-tomate);
	}

	.contacto-punto.abierto {
		background: var(--color-menta);
	}

	.contacto-numero {
		font-weight: 500;
		color: var(--color-tinta-suave);
	}

	/* Cuatro datos en columnas, cada uno bajo una línea crema de 2 px, sin cajas */
	.contacto-datos {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 32px;
		margin: 0;
	}

	.contacto-datos div {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
		padding-top: 18px;
		border-top: var(--border-width) solid var(--color-crema);
	}

	.contacto-datos dt {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.85;
	}

	.contacto-datos dd {
		margin: 0;
		font-size: 19px;
		font-weight: 600;
		line-height: var(--dato-linea);
	}

	.contacto-datos {
		--dato-linea: 1.35;
	}

	/*
	 * Área de toque de 44 px en los links (Instagram, Email). El margen negativo
	 * devuelve lo que sobra de la altura de línea, así la fila se ve igual que en
	 * la referencia y el valor queda centrado.
	 */
	.contacto-link {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap-min);
		margin-block: calc((var(--dato-linea) * 1em - var(--tap-min)) / 2);
	}

	.horario-corto,
	.horario-lector {
		display: none;
	}

	@media (max-width: 959px) {
		.contacto-arriba {
			gap: 14px;
		}

		.contacto-titulo {
			gap: 12px;
		}

		/* Teléfono: botón a todo el ancho (stretch) y la píldora debajo */
		.contacto-acciones {
			flex: 1 1 100%;
			align-items: stretch;
			gap: 12px;
		}

		.contacto-acciones :global(.contacto-whatsapp) {
			height: 56px;
			font-size: 17px;
		}

		.contacto-estado {
			align-self: flex-start;
			font-size: 13px;
		}

		/* Filas: etiqueta a la izquierda, valor a la derecha */
		.contacto-datos {
			grid-template-columns: 1fr;
			gap: 0;
		}

		.contacto-datos div {
			flex-direction: row;
			justify-content: space-between;
			align-items: baseline;
			gap: 12px;
			padding: 12px 0;
			border-top-color: color-mix(in srgb, var(--color-crema) 35%, transparent);
		}

		.contacto-datos dd {
			font-size: 14px;
			text-align: right;
		}

		.horario-largo {
			display: none;
		}

		.horario-corto {
			display: inline;
		}

		.horario-lector {
			display: block;
		}
	}
</style>

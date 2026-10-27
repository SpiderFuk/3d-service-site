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
	import { mensajes } from '$lib/config/whatsappMessages';
	import { whatsappUrl } from '$lib/utils/whatsapp';
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
		</div>
	</div>
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

	.contacto-numero {
		font-weight: 500;
		color: var(--color-tinta-suave);
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
	}
</style>

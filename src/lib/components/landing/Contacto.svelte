<script lang="ts">
	/**
	 * Contacto (#contacto): sección 10 de BUILD.md
	 *
	 * La única sección cobalto. La clase global .on-cobalto (app.css) pasa los
	 * links a crema (hover mantequilla) y el anillo de foco a crema; no se
	 * redefinen acá.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
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

	@media (max-width: 959px) {
		.contacto-arriba {
			gap: 14px;
		}

		.contacto-titulo {
			gap: 12px;
		}
	}
</style>

<script lang="ts">
	/**
	 * 05 Cómo funciona (#como-funciona)
	 *
	 * Tres pasos numerados. La numeración la da el <ol>; los círculos cobalto son
	 * decorativos (aria-hidden) para que el lector de pantalla no lea el número dos veces.
	 * Copy exacto de design/landing-v1/BUILD.md.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';

	const pasos = [
		{
			titulo: 'Mandanos lo que tenés',
			texto: 'Una foto, el link de un modelo o tu archivo STL o 3MF, por WhatsApp.'
		},
		{
			titulo: 'Te pasamos el precio',
			texto:
				'En minutos, en horario de atención. Material, color y plazo, todo claro antes de empezar.'
		},
		{
			titulo: 'Lo imprimimos',
			texto:
				'En 24 a 48 horas en la mayoría de los pedidos. Lo retirás en Montevideo o Las Piedras, coordinando antes.'
		}
	];
</script>

<Section id="como-funciona">
	<SectionHeading
		id="como-funciona-titulo"
		eyebrow="Cómo funciona"
		primera="Más simple,"
		segunda="imposible."
	/>

	<div class="envoltura">
		<!-- role="list": Safari/VoiceOver quita la semántica de lista con list-style: none -->
		<ol class="pasos" role="list">
			{#each pasos as paso, i (paso.titulo)}
				<li class="paso">
					<span class="numero" aria-hidden="true">{i + 1}</span>
					<div class="contenido">
						<h3 class="titulo">{paso.titulo}</h3>
						<p class="texto">{paso.texto}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</Section>

<style>
	.envoltura {
		margin-top: 28px;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
	}

	.pasos {
		grid-column: 1 / 4;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}

	.paso {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 28px 24px;
		border: var(--border);
		border-radius: var(--radius-lg);
		background: var(--color-blanco);
	}

	.numero {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: var(--color-cobalto);
		color: var(--color-crema);
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 800;
	}

	.contenido {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.titulo {
		margin: 0;
		font-family: var(--font-display);
		font-size: 26px;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	.texto {
		margin: 0;
		color: var(--color-tinta-suave);
	}
</style>

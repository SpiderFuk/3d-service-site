<script lang="ts">
	/**
	 * 03 Tres caminos (#que-imprimimos)
	 *
	 * Imagen, idea o archivo: cada camino lleva a WhatsApp con su propio mensaje.
	 * Copy exacto de design/landing-v1/BUILD.md.
	 *
	 * Fotos provisorias en static/images/placeholders/ (JPG 4:3, 1200 × 900): para
	 * poner las reales alcanza con reemplazar cada archivo manteniendo el nombre.
	 */
	import Section from '$lib/components/ui/Section.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import CaminoCard from './CaminoCard.svelte';
</script>

<Section id="que-imprimimos">
	<SectionHeading
		id="que-imprimimos-titulo"
		eyebrow="Qué imprimimos"
		primera="Una foto, una idea o un archivo."
		segunda="Elegí por dónde empezar."
	/>
	<p class="linea">Cada camino te lleva a WhatsApp con el mensaje listo.</p>

	<ul class="caminos">
		<CaminoCard
			fondo="mantequilla"
			foto={{
				src: '/images/placeholders/caminos-imagen-cuadro-en-relieve.jpg',
				alt: 'Cuadro en relieve en blanco y negro, sobre su soporte'
			}}
			titulo="Tengo una imagen"
			texto="Mandanos una foto y la convertimos en un cuadro en relieve, con su soporte."
			nota="Revisamos cada foto y te decimos si se puede imprimir."
			boton="Mandar mi foto"
			mensaje="caminosFoto"
		/>
		<CaminoCard
			fondo="menta"
			foto={{
				src: '/images/placeholders/caminos-idea-modelo-encontrado.jpg',
				alt: 'Pieza impresa a partir de un modelo encontrado online'
			}}
			titulo="Tengo una idea"
			texto="Contanos qué buscás y te ayudamos a encontrar el modelo en MakerWorld, Printables o Thingiverse. ¿Ya encontraste uno? Mandanos el link."
			boton="Contar mi idea"
			mensaje="caminosIdea"
		/>
		<CaminoCard
			fondo="tomate"
			foto={{
				src: '/images/placeholders/caminos-archivo-pieza-tecnica.jpg',
				alt: 'Pieza técnica impresa en 3D'
			}}
			titulo="Tengo un archivo"
			texto="Mandanos tu STL o 3MF y lo imprimimos en PLA o PETG."
			enlace={{ href: '#visor', texto: 'Ver tu modelo en 3D' }}
			boton="Mandar mi archivo"
			mensaje="caminosArchivo"
		/>
	</ul>
</Section>

<style>
	.linea {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--color-tinta-suave);
	}

	/* Desktop: tres columnas */
	.caminos {
		list-style: none;
		margin: 28px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 32px;
	}

	/* Desktop por debajo de 1100 px: una columna, tarjetas con la foto a la izquierda */
	@media (min-width: 960px) and (max-width: 1099px) {
		.caminos {
			grid-template-columns: 1fr;
		}
	}

	/* Teléfono: apiladas */
	@media (max-width: 959px) {
		.caminos {
			grid-template-columns: 1fr;
			gap: 14px;
			margin-top: 8px;
		}
	}
</style>

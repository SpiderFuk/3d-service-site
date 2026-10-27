/**
 * Datos estructurados FAQPage (schema.org) para la sección Preguntas
 *
 * Se arman desde la misma lista que el acordeón (config/faq.ts), así el texto
 * no puede diferir. El tag <script> se arma acá y no en el componente porque
 * un "</script>" literal dentro de un .svelte corta el bloque de script.
 */

import type { PreguntaFrecuente } from '$lib/config/faq';

export function faqJsonLd(preguntas: readonly PreguntaFrecuente[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: preguntas.map(({ pregunta, respuesta }) => ({
			'@type': 'Question',
			name: pregunta,
			acceptedAnswer: { '@type': 'Answer', text: respuesta }
		}))
	};
}

/** Tag listo para {@html} en <svelte:head>. Escapa "<" para que ningún texto cierre el script. */
export function faqJsonLdScript(preguntas: readonly PreguntaFrecuente[]): string {
	const json = JSON.stringify(faqJsonLd(preguntas)).replace(/</g, '\\u003c');
	return `<script type="application/ld+json">${json}</script>`;
}

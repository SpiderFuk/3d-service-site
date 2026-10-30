import { describe, expect, it } from 'vitest';
import { preguntasFrecuentes } from '$lib/config/faq';
import { faqJsonLd, faqJsonLdScript } from './faqJsonLd';

describe('faqJsonLd', () => {
	it('arma un FAQPage con las ocho preguntas y sus respuestas', () => {
		const datos = faqJsonLd(preguntasFrecuentes);
		expect(datos['@context']).toBe('https://schema.org');
		expect(datos['@type']).toBe('FAQPage');
		expect(datos.mainEntity).toHaveLength(8);
		datos.mainEntity.forEach((entrada, i) => {
			expect(entrada).toEqual({
				'@type': 'Question',
				name: preguntasFrecuentes[i].pregunta,
				acceptedAnswer: { '@type': 'Answer', text: preguntasFrecuentes[i].respuesta }
			});
		});
	});
});

describe('faqJsonLdScript', () => {
	it('envuelve el JSON en un script application/ld+json que se puede volver a leer', () => {
		const tag = faqJsonLdScript(preguntasFrecuentes);
		const match = tag.match(/^<script type="application\/ld\+json">(.*)<\/script>$/s);
		expect(match).not.toBeNull();
		expect(JSON.parse(match![1])).toEqual(faqJsonLd(preguntasFrecuentes));
	});

	it('escapa "<" para que un texto no pueda cerrar el script', () => {
		const tag = faqJsonLdScript([{ pregunta: '¿Y esto?', respuesta: '</script><b>hola</b>' }]);
		const interior = tag.slice(tag.indexOf('>') + 1, tag.lastIndexOf('</script>'));
		expect(interior).not.toContain('<');
		expect(JSON.parse(interior).mainEntity[0].acceptedAnswer.text).toBe('</script><b>hola</b>');
	});
});

/**
 * Preguntas frecuentes (sección 09 de BUILD.md)
 *
 * ÚNICA fuente: de acá salen el acordeón de Preguntas y el JSON-LD FAQPage,
 * así los textos no pueden diferir. La respuesta 8 se arma desde el horario
 * (config/hours.ts), no se escribe a mano.
 */

import { horarioFrase } from '$lib/utils/hours';

export interface PreguntaFrecuente {
	pregunta: string;
	respuesta: string;
}

export const preguntasFrecuentes: readonly PreguntaFrecuente[] = [
	{
		pregunta: '¿Qué archivo te mando?',
		respuesta:
			'STL o 3MF. Si no tenés uno, mandanos una foto o el link de un modelo de MakerWorld, Printables o Thingiverse y te ayudamos a encontrarlo.'
	},
	{
		pregunta: '¿Hacen el diseño o el modelo 3D?',
		respuesta:
			'No modelamos desde cero. Te ayudamos a encontrar un modelo que ya exista, o imprimimos el tuyo.'
	},
	{
		pregunta: '¿Qué tan grande puede ser?',
		respuesta: 'Hasta 25 cm de alto, ancho y largo.'
	},
	{
		pregunta: '¿Cuántos colores puede tener?',
		respuesta: 'Hasta 4 colores en una misma pieza.'
	},
	{
		pregunta: '¿Cuánto demora?',
		respuesta:
			'24 a 48 h en la mayoría de los pedidos. Si es grande, multicolor o en cantidad, te decimos el plazo junto con el precio.'
	},
	{
		pregunta: '¿Cómo lo recibo?',
		respuesta: 'Lo retirás en Montevideo o Las Piedras, o coordinamos el envío por WhatsApp.'
	},
	{
		pregunta: '¿Cómo pago?',
		respuesta: 'En efectivo o por transferencia bancaria.'
	},
	{
		pregunta: '¿Cuándo me responden?',
		respuesta: `En minutos, en horario de atención: ${horarioFrase()}.`
	}
];

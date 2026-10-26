/**
 * Mensajes de WhatsApp: ÚNICO catálogo (tabla "WhatsApp" de BUILD.md)
 *
 * Cada botón abre WhatsApp con su propio mensaje para saber desde dónde escribió
 * la persona. Hay una entrada por lugar aunque el texto se repita, así se puede
 * cambiar uno sin tocar componentes. Usar con whatsappUrl() de utils/whatsapp.
 */

export const mensajes = {
	/** Hero y barra, "Pedir presupuesto" */
	presupuesto: 'Hola printo, quiero pedir un presupuesto.',
	/** Tres caminos, "Mandar mi foto" */
	caminosFoto: 'Hola printo, quiero un cuadro en relieve con una foto.',
	/** Tres caminos, "Contar mi idea" */
	caminosIdea: 'Hola printo, busco imprimir algo y necesito ayuda para encontrar el modelo.',
	/** Tres caminos, "Mandar mi archivo" */
	caminosArchivo: 'Hola printo, tengo un archivo para imprimir.',
	/** Trabajos, "Quiero el mío" */
	trabajos: 'Hola printo, quiero un cuadro en relieve con una foto.',
	/** Cómo funciona, "Sí, escribamos" */
	comoFunciona: 'Hola printo, quiero pedir un presupuesto.',
	/** Precio y plazos, "Pedir el precio" */
	precios: 'Hola printo, quiero saber cuánto sale imprimir algo.',
	/** Visor 3D, archivo propio */
	visorArchivo: (nombreArchivo: string) =>
		`Hola printo, quiero saber cuánto sale imprimir ${nombreArchivo}. Te mando el archivo por acá.`,
	/** Visor 3D, ejemplo (con artículo: "el Santa borracho", "la Miniatura") */
	visorEjemplo: (ejemploConArticulo: string) =>
		`Hola printo, quiero saber cuánto sale imprimir ${ejemploConArticulo} del visor.`,
	/** Visor 3D, archivo de más de 50 MB */
	visorArchivoGrande: 'Hola printo, tengo un archivo de más de 50 MB para imprimir.',
	/** Preguntas, "Preguntanos por WhatsApp" */
	preguntas: 'Hola printo, tengo una pregunta.',
	/** Contacto y Pie, WhatsApp */
	contacto: 'Hola printo, quiero hacer un pedido.'
} as const;

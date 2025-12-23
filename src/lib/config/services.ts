/**
 * Configuración de servicios ofrecidos
 */

export interface Service {
	id: string;
	title: string;
	description: string;
	icon: string; // Nombre del icono de lucide-svelte
	features: string[];
}

export const services: Service[] = [
	{
		id: 'printing',
		title: 'Impresión 3D',
		description: 'Impresión de alta calidad en diversos materiales y colores',
		icon: 'Printer',
		features: [
			'Múltiples materiales (PLA, PETG, ABS, TPU)',
			'Amplia gama de colores',
			'Alta precisión y acabado',
			'Tamaños desde miniatura hasta 30cm'
		]
	},
	{
		id: 'design',
		title: 'Diseño 3D',
		description: 'Modelado profesional de tus ideas desde cero',
		icon: 'Pen',
		features: [
			'Diseño personalizado',
			'Optimización para impresión',
			'Modificación de modelos existentes',
			'Asesoramiento técnico'
		]
	},
	{
		id: 'prototyping',
		title: 'Prototipado Rápido',
		description: 'Convierte tus ideas en prototipos físicos rápidamente',
		icon: 'Zap',
		features: [
			'Entrega rápida',
			'Iteraciones veloces',
			'Validación de diseños',
			'Ahorro en desarrollo'
		]
	},
	{
		id: 'custom',
		title: 'Proyectos a Medida',
		description: 'Soluciones personalizadas para tus necesidades específicas',
		icon: 'Wrench',
		features: [
			'Consultoría personalizada',
			'Proyectos complejos',
			'Post-procesado disponible',
			'Soporte continuo'
		]
	}
];

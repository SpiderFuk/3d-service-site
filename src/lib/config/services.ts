/**
 * Configuración local de servicios ofrecidos
 *
 * IMPORTANTE: Cuando el feature flag 'services-visibility' está enabled en AWS AppConfig,
 * solo los servicios especificados en el flag serán visibles. Esta configuración local
 * se usa como fallback cuando:
 * - El flag no existe o está disabled (enabled: false)
 * - AWS AppConfig no está disponible
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
			'Múltiples materiales (PLA, PETG y mas en el futuro!)',
			'Amplia gama de colores',
			'Alta precisión y acabado',
			'Tamaños desde miniatura hasta 25cm'
		]
	},
	// {
	// 	id: 'design',
	// 	title: 'Diseño 3D',
	// 	description: 'Modelado profesional de tus ideas desde cero',
	// 	icon: 'Pen',
	// 	features: [
	// 		'Diseño personalizado',
	// 		'Optimización para impresión',
	// 		'Modificación de modelos existentes',
	// 		'Asesoramiento técnico'
	// 	]
	// },
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
	// {
	// 	id: 'custom',
	// 	title: 'Proyectos a Medida',
	// 	description: 'Soluciones personalizadas para tus necesidades específicas',
	// 	icon: 'Wrench',
	// 	features: [
	// 		'Consultoría personalizada',
	// 		'Proyectos complejos',
	// 		'Post-procesado disponible',
	// 		'Soporte continuo'
	// 	]
	// }
];

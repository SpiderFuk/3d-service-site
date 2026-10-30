/**
 * Tipos de los módulos `$contenido/*.json` (plugin contenidoEstatico en vite.config.ts)
 */

declare module '$contenido/materials.json' {
	const contenido: import('$lib/types/content').MaterialsContent;
	export default contenido;
}

declare module '$contenido/gallery.json' {
	const contenido: import('$lib/types/content').GalleryContent;
	export default contenido;
}

# Imágenes del Proyecto

Este directorio contiene todos los recursos visuales del sitio.

## Archivos Actualmente en Uso

### Logo
El logo actual vive en `static/brand/logo/` (ver `docs/brand.md`). No usar logos de esta carpeta.

### Otros Archivos Disponibles
- `background.png` - Puede usarse como fondo en secciones
- `imagen hero.png` - Imagen para la sección Hero
- `Íconos de Servicios.png` - Referencia de iconos
- `_old-logos/` - Logos anteriores al rebrand "Filamento" (cubo animado, variantes y el cubo 3D en `3d/`). Solo como archivo, sin referencias en el codigo

## Cómo Usar las Imágenes

### En componentes Svelte:
```svelte
<img src="/images/nombre-archivo.png" alt="Descripción" />
```

### En CSS:
```css
background-image: url('/images/nombre-archivo.png');
```

## Notas
- Las rutas son relativas a `static/`
- No incluir `static/` en la ruta (SvelteKit lo maneja automáticamente)
- Optimizar imágenes antes de usar en producción para mejor rendimiento

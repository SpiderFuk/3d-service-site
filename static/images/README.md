# Imágenes del Proyecto

Este directorio contiene todos los recursos visuales del sitio.

## Archivos Actualmente en Uso

### Logo (Navbar)
- **Principal**: `logo animado.gif` - Logo animado usado en el header/navbar
- **Fallback**: `logo nombre H recortado.png` - Se usa si el GIF falla al cargar

### Otros Archivos Disponibles
- `background.png` - Puede usarse como fondo en secciones
- `imagen hero.png` - Imagen para la sección Hero
- `Íconos de Servicios.png` - Referencia de iconos
- `logo.png`, `logo nombre 1.png`, `logo nombre 2.jpeg`, `logo nombre H.png` - Variantes del logo

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

# 3D Service Site

SPA profesional para servicios de impresión 3D construida con SvelteKit 5, TypeScript, Tailwind CSS y Three.js.

## Características

- 🎨 Interfaz moderna y responsive
- 🔄 Visor 3D interactivo con carga de archivos STL/3MF
- 📱 Integración directa con WhatsApp
- 🎭 Múltiples materiales y colores
- 📸 Galería de proyectos
- ⚡ Rendimiento optimizado

## Stack Tecnológico

- **Framework:** Svelte 5 + SvelteKit
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **3D Engine:** Three.js
- **Iconos:** Lucide Svelte

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Configuración

### 1. Información del Negocio

Editar `src/lib/config/contact.ts`:

```typescript
export const contactInfo = {
  whatsappNumber: '5491234567890', // Reemplazar con número real
  businessName: 'Tu Negocio 3D',
  city: 'Tu Ciudad',
  email: 'contacto@tunegocio.com'
};
```

### 2. Colores y Materiales

Editar `src/lib/config/filamentColors.ts` para actualizar:
- Colores disponibles
- Materiales ofrecidos
- Propiedades de cada material

### 3. Servicios

Editar `src/lib/config/services.ts` para personalizar los servicios ofrecidos.

### 4. Modelos 3D

Agregar archivos STL/3MF en `static/models/` y actualizar la lista en:
- `src/lib/components/sections/ModelViewer.svelte`

### 5. Imágenes

Agregar:
- Logo en `static/images/logo.png`
- Favicon en `static/favicon.png`
- Open Graph image en `static/og-image.jpg`

## Estructura del Proyecto

```
src/
├── lib/
│   ├── components/
│   │   ├── layout/       # Navbar, Footer
│   │   ├── sections/     # Secciones principales
│   │   ├── viewer/       # Componentes del visor 3D
│   │   └── ui/           # Componentes reutilizables
│   ├── config/           # Configuración del negocio
│   ├── loaders/          # Factory Pattern para carga de modelos
│   ├── stores/           # Svelte stores
│   ├── three/            # Setup de Three.js
│   └── utils/            # Utilidades
├── routes/               # Páginas de SvelteKit
└── app.css              # Estilos globales
```

## Patrones de Arquitectura

### Factory Pattern para Loaders

El proyecto usa el Factory Pattern para manejar diferentes formatos 3D:

```typescript
const loader = ModelLoaderFactory.getLoader(filename);
const model = await loader.load(file);
const info = loader.getModelInfo(model);
```

### Gestión de Estado

Usa Svelte stores para estado global:
- `modelStore`: Maneja el modelo 3D actual
- `uiStore`: Maneja estado de UI (menús, modales)

## Consideraciones Importantes

1. **SSR Deshabilitado**: Three.js requiere el DOM, por lo que SSR está deshabilitado en `+page.ts`
2. **Memory Management**: Siempre llamar a `dispose()` en `onDestroy` para limpiar recursos de Three.js
3. **Tamaño de Archivos**: Límite de 50MB para uploads de modelos
4. **Validación**: Los archivos se validan antes de cargar

## Deployment

### Vercel

```bash
npm run build
vercel deploy
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=build
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "build"]
```

## TODOs Post-Instalación

- [ ] Configurar número de WhatsApp real
- [ ] Agregar logo e imágenes
- [ ] Subir modelos 3D de ejemplo a `/static/models`
- [ ] Actualizar colores y materiales según inventario
- [ ] Configurar dominio y SSL
- [ ] Agregar Google Analytics (opcional)
- [ ] Optimizar SEO con meta tags específicos

## Licencia

Privado - Todos los derechos reservados

## Soporte

Para consultas sobre el código, revisar `CLAUDE.md` o abrir un issue.

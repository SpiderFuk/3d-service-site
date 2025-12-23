# Especificaciones de Diseño y Contenido

## 1. Diseño Visual (UI)

### Paleta de Colores Completa

```css
:root {
  /* Fondos */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --bg-viewer: #F1F5F9;
  
  /* Textos */
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  
  /* Acentos */
  --accent-primary: #3B82F6;
  --accent-hover: #2563EB;
  --accent-light: #DBEAFE;
  
  /* WhatsApp */
  --whatsapp: #25D366;
  --whatsapp-hover: #128C7E;
  
  /* Bordes y separadores */
  --border: #E2E8F0;
  --border-light: #F1F5F9;
  
  /* Estados */
  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
}
```

### Tipografía

| Elemento | Fuente | Peso | Tamaño |
|----------|--------|------|--------|
| H1 (Hero) | Inter | 700 | 48px / 3rem |
| H2 (Secciones) | Inter | 600 | 32px / 2rem |
| H3 (Subtítulos) | Inter | 600 | 24px / 1.5rem |
| Body | Inter | 400 | 16px / 1rem |
| Small | Inter | 400 | 14px / 0.875rem |
| Button | Inter | 500 | 16px / 1rem |

**Importar en CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Espaciado (Sistema de 8px)

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
```

### Bordes y Sombras

```css
/* Border radius */
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-full: 9999px;

/* Sombras */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 2. Componentes UI

### Botones

```
┌─────────────────────────────────────────────────────────┐
│  BOTÓN PRIMARIO                                         │
│  ┌─────────────────────┐                               │
│  │   Ver Galería       │  bg: #3B82F6                  │
│  └─────────────────────┘  text: white                  │
│                           hover: #2563EB               │
│                           padding: 12px 24px           │
│                           radius: 8px                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BOTÓN SECUNDARIO (Outline)                            │
│  ┌─────────────────────┐                               │
│  │   Subir modelo      │  bg: transparent              │
│  └─────────────────────┘  border: #3B82F6              │
│                           text: #3B82F6                │
│                           hover: bg #DBEAFE            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  BOTÓN WHATSAPP                                         │
│  ┌─────────────────────┐                               │
│  │  💬 WhatsApp        │  bg: #25D366                  │
│  └─────────────────────┘  text: white                  │
│                           hover: #128C7E               │
│                           icon: WhatsApp logo          │
└─────────────────────────────────────────────────────────┘
```

### Cards

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         Contenido/Imagen          │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Título                                 │
│  Descripción en texto secundario        │
│                                         │
│  bg: white                              │
│  border: 1px solid #E2E8F0             │
│  radius: 12px                           │
│  shadow: shadow-sm                      │
│  hover: shadow-md + translateY(-2px)    │
│                                         │
└─────────────────────────────────────────┘
```

### Input Fields

```
┌─────────────────────────────────────────┐
│  Label                                  │
│  ┌───────────────────────────────────┐  │
│  │  Placeholder text...              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  border: 1px solid #E2E8F0             │
│  focus: border #3B82F6 + ring          │
│  radius: 8px                            │
│  padding: 12px 16px                     │
└─────────────────────────────────────────┘
```

---

## 3. Estructura de Secciones

### 3.1 Navbar

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Logo]     Servicios   Colores   Visualizador   Galería   [WA]│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Sticky en scroll
- Fondo blanco con shadow-sm al hacer scroll
- Links con smooth scroll a secciones
- Botón WhatsApp siempre visible (verde)
- Mobile: hamburger menu
```

### 3.2 Hero

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│              [NOMBRE DEL NEGOCIO]                               │
│                                                                 │
│         Transformamos tus ideas en objetos reales               │
│                                                                 │
│    Servicio profesional de impresión 3D en [CIUDAD]            │
│                                                                 │
│         [ Ver Galería ]    [ Subir mi modelo ]                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Altura: 80vh mínimo
- Fondo: gradiente sutil o blanco
- Opcional: animación 3D de fondo (cubo rotando)
- CTAs principales prominentes
```

### 3.3 Servicios

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Nuestros Servicios                           │
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐         │
│   │    Icon     │   │    Icon     │   │    Icon     │         │
│   │             │   │             │   │             │         │
│   │  Prototipo  │   │   Piezas    │   │   Diseño    │         │
│   │   Rápido    │   │   Custom    │   │     3D      │         │
│   │             │   │             │   │             │         │
│   │ Descripción │   │ Descripción │   │ Descripción │         │
│   │   corta     │   │   corta     │   │   corta     │         │
│   └─────────────┘   └─────────────┘   └─────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Fondo: gris claro (#F8FAFC)
- Cards con hover effect
- Íconos de Lucide
```

### 3.4 Colores de Filamento

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Colores Disponibles                                │
│                                                                 │
│   ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤  ⬤               │
│                                                                 │
│   [Tooltip con nombre al hover sobre cada color]               │
│                                                                 │
│   ─────────────────────────────────────────                    │
│                                                                 │
│   Materiales:  [ PLA ]  [ PETG ]  [ ABS ]  [ TPU ]            │
│                                                                 │
│   [Descripción del material seleccionado]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Círculos de color clickeables
- Tooltip con nombre del color
- Tabs o pills para materiales
- Descripción dinámica según material
```

### 3.5 Visualizador 3D

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    Visualizador 3D                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │                                                           │ │
│  │                    [ CANVAS THREE.JS ]                    │ │
│  │                                                           │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  [Reset] [Zoom+] [Zoom-] [Grid] [Fullscreen]        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Archivo: ejemplo.stl                                     │ │
│  │  Dimensiones: 50mm × 30mm × 20mm                         │ │
│  │  Volumen: ~12.5 cm³                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Ejemplos:                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ thumb  │ │ thumb  │ │ thumb  │ │ thumb  │                  │
│  │   1    │ │   2    │ │   3    │ │   4    │                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │      📁 Arrastra tu archivo STL o 3MF aquí               │ │
│  │              o haz click para buscar                     │ │
│  │                                                           │ │
│  │         Formatos soportados: .stl, .3mf                  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│              [ 💬 Cotizar por WhatsApp ]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Canvas responsivo (aspect ratio 16:9 o 4:3)
- Controles minimalistas
- Panel de info colapsable en mobile
- Thumbnails con mini preview (imagen estática o mini canvas)
- Dropzone con drag visual feedback
- Botón WhatsApp genera mensaje con info del modelo
```

### 3.6 Galería 3D

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   Trabajos Realizados                           │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │              │  │              │  │              │        │
│   │  Mini Visor  │  │  Mini Visor  │  │  Mini Visor  │        │
│   │     3D       │  │     3D       │  │     3D       │        │
│   │  (auto-rot)  │  │  (auto-rot)  │  │  (auto-rot)  │        │
│   │              │  │              │  │              │        │
│   ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│   │ Engranaje    │  │ Soporte      │  │ Maceta       │        │
│   │ mecánico     │  │ custom       │  │ decorativa   │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│   │  Mini Visor  │  │  Mini Visor  │  │  Mini Visor  │        │
│   │     3D       │  │     3D       │  │     3D       │        │
│   ├──────────────┤  ├──────────────┤  ├──────────────┤        │
│   │ Figura       │  │ Herramienta  │  │ Prototipo    │        │
│   └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│   Click en cualquier modelo para verlo en el visualizador      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Grid responsivo (3 cols desktop, 2 tablet, 1 mobile)
- Cada card tiene mini canvas Three.js con auto-rotate
- Click abre modelo en visualizador principal (smooth scroll)
- Hover pausa rotación y muestra controles
```

### 3.7 Contacto WhatsApp

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              ¿Listo para imprimir tu idea?                     │
│                                                                 │
│         Contactanos y recibí tu cotización al instante         │
│                                                                 │
│              Nombre (opcional)                                  │
│              ┌─────────────────────────────────┐               │
│              │                                 │               │
│              └─────────────────────────────────┘               │
│                                                                 │
│              Tu mensaje                                         │
│              ┌─────────────────────────────────┐               │
│              │                                 │               │
│              │                                 │               │
│              │                                 │               │
│              └─────────────────────────────────┘               │
│                                                                 │
│              [ 💬 Enviar por WhatsApp ]                        │
│                                                                 │
│         ─────────────── o ───────────────                      │
│                                                                 │
│         Escribinos directamente:                                │
│                                                                 │
│              [ 💬 Abrir WhatsApp ]                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Fondo: gris claro
- Formulario simple (no requiere backend)
- Botón genera link wa.me con mensaje prellenado
- Opción directa sin formulario
```

### 3.8 Footer

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Logo]                                                         │
│                                                                 │
│  Servicio de impresión 3D en [CIUDAD]                          │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│  Instagram: @handle    WhatsApp: +54 9 XXX XXX XXXX            │
│                                                                 │
│  © 2025 [Nombre]. Todos los derechos reservados.               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

- Fondo: gris oscuro (#1E293B) o mantener claro
- Links a redes sociales (iconos)
- Copyright
```

---

## 4. Contenido de Texto (Copy)

### Hero

**Título principal:**
- "Transformamos tus ideas en objetos reales"
- Alt: "Impresión 3D profesional"
- Alt: "Dale forma a tu imaginación"

**Subtítulo:**
- "Servicio de impresión 3D en [CIUDAD]. Prototipos, piezas funcionales y diseños personalizados."

**CTAs:**
- "Ver galería de trabajos"
- "Subir mi modelo"
- "Cotizar ahora"

### Servicios

**Prototipado Rápido:**
- Título: "Prototipado Rápido"
- Descripción: "Convierte tu diseño en un prototipo físico en tiempo récord. Ideal para validar ideas antes de producción."

**Piezas Personalizadas:**
- Título: "Piezas a Medida"
- Descripción: "Fabricamos piezas únicas según tus especificaciones. Repuestos, adaptadores, soportes y más."

**Diseño 3D:**
- Título: "Diseño 3D"
- Descripción: "¿No tenés el modelo? Te ayudamos a diseñarlo. Desde boceto hasta archivo listo para imprimir."

### Colores

**Título:** "Colores Disponibles"
**Subtítulo:** "Elegí el color perfecto para tu proyecto"

**Materiales:**
- PLA: "El más versátil. Biodegradable, fácil de imprimir. Ideal para prototipos y decoración."
- PETG: "Resistente y duradero. Excelente para piezas funcionales y uso exterior."
- ABS: "Alta resistencia mecánica y térmica. Perfecto para piezas técnicas."
- TPU: "Flexible y elástico. Ideal para fundas, juntas y piezas que requieren flexibilidad."

### Visualizador

**Título:** "Visualizador 3D"
**Subtítulo:** "Explorá nuestros modelos o subí el tuyo"

**Dropzone:**
- "Arrastrá tu archivo aquí"
- "o hacé click para buscar"
- "Formatos: .STL, .3MF (máx 50MB)"

**CTA:** "Cotizar este modelo por WhatsApp"

### Galería

**Título:** "Trabajos Realizados"
**Subtítulo:** "Algunos de nuestros proyectos recientes"

**Nota:** "Hacé click en cualquier modelo para verlo en detalle"

### Contacto

**Título:** "¿Listo para imprimir tu idea?"
**Subtítulo:** "Contactanos y recibí tu cotización"

**Placeholder nombre:** "Tu nombre (opcional)"
**Placeholder mensaje:** "Contanos sobre tu proyecto..."

**CTA principal:** "Enviar por WhatsApp"
**CTA secundario:** "Abrir WhatsApp directamente"

---

## 5. Responsive Breakpoints

```css
/* Mobile first */
/* Base: < 640px (mobile) */

/* sm: >= 640px (large phones) */
@media (min-width: 640px) { }

/* md: >= 768px (tablets) */
@media (min-width: 768px) { }

/* lg: >= 1024px (laptops) */
@media (min-width: 1024px) { }

/* xl: >= 1280px (desktops) */
@media (min-width: 1280px) { }
```

### Ajustes por Breakpoint

| Sección | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navbar | Hamburger | Hamburger | Links visibles |
| Hero | Stack vertical | Stack vertical | Horizontal |
| Servicios | 1 columna | 2 columnas | 3 columnas |
| Colores | Scroll horizontal | Grid 6 cols | Grid 12 cols |
| Visualizador | Full width | Full width | Max 900px |
| Galería | 1 columna | 2 columnas | 3 columnas |
| Contacto | Full width | 70% width | 50% width |

---

## 6. Animaciones y Transiciones

### Transiciones Base

```css
/* Transición por defecto */
transition: all 0.2s ease-in-out;

/* Hover en botones */
transition: background-color 0.2s, transform 0.2s;

/* Hover en cards */
transition: box-shadow 0.3s, transform 0.3s;
```

### Animaciones de Entrada (Scroll)

- Fade in + slide up para secciones
- Stagger en cards de galería
- Usar IntersectionObserver o librería (svelte-inview)

### Animaciones 3D

- Auto-rotate en galería: rotación Y lenta (0.005 rad/frame)
- Modelo principal: sin auto-rotate (control del usuario)

---

## 7. SEO y Metadata

```html
<title>[Nombre] - Impresión 3D en [Ciudad]</title>
<meta name="description" content="Servicio profesional de impresión 3D. Prototipos, piezas personalizadas y diseño 3D. Visualizá tu modelo online y recibí cotización por WhatsApp.">
<meta name="keywords" content="impresión 3D, prototipado, piezas 3D, diseño 3D, [ciudad]">

<!-- Open Graph -->
<meta property="og:title" content="[Nombre] - Impresión 3D">
<meta property="og:description" content="Transformamos tus ideas en objetos reales">
<meta property="og:image" content="/og-image.png">
<meta property="og:type" content="website">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
```

---

## 8. Accesibilidad (a11y)

- Contraste mínimo 4.5:1 para texto
- Focus visible en elementos interactivos
- Alt text en imágenes
- Labels en inputs
- Aria labels en botones con solo ícono
- Skip to content link
- Estructura de headings correcta (h1 > h2 > h3)

---

## 9. Performance

- Lazy loading para galería 3D
- Intersection Observer para cargar canvases solo cuando visibles
- Comprimir modelos 3D (Draco compression para glTF)
- Imágenes en WebP
- Font subsetting
- Preload de fuentes críticas

---

## 10. Información Pendiente a Definir

| Item | Estado | Notas |
|------|--------|-------|
| Nombre del negocio | ⏳ Pendiente | Elegir de lista o proponer |
| Número WhatsApp | ⏳ Pendiente | Formato: 549XXXXXXXXX |
| Ciudad/Ubicación | ⏳ Pendiente | Para SEO y copy |
| Colores de filamento reales | ⏳ Pendiente | Según inventario |
| Materiales disponibles | ⏳ Pendiente | PLA, PETG, etc. |
| Modelos para galería | ⏳ Pendiente | 4-6 archivos STL/3MF |
| Logo | ⏳ Pendiente | Generar con prompts |
| Redes sociales | ⏳ Pendiente | Instagram, etc. |
| Precios referenciales | ⏳ Pendiente | Opcional, para cotizador |

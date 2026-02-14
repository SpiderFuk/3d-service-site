# Auto-Gallery + Instagram Publisher Pipeline

## Objetivo

Crear un sistema de contenido dinamico para printo.uy donde:

1. El contenido del sitio (galeria, materiales/filamentos, y secciones futuras) se gestiona desde un panel de admin sin necesidad de redeploy
2. Al subir una foto a la galeria, se genera titulo, descripcion, categoria, caption y hashtags con IA (Claude Vision)
3. Las fotos de galeria se publican automaticamente como post en Instagram (@printo.uy)

---

## Decisiones Arquitectonicas

### Decision 1: admin.printo.uy vs printo.uy/admin

**Elegido: `admin.printo.uy` (subdominio)**

| Criterio | admin.printo.uy | printo.uy/admin |
|---|---|---|
| **Aislamiento de codigo** | El codigo admin nunca se incluye en el bundle del sitio publico | El codigo admin se incluye en el bundle de SvelteKit |
| **Deploy independiente** | Cada uno tiene su propio CI/CD | Un unico deploy, cambios en admin requieren rebuild completo |
| **Seguridad** | Restriccion a nivel de CloudFront (IP allowlist, Cognito, WAF) | Proteccion solo a nivel de aplicacion (JS client-side) |
| **Stack independiente** | Cualquier tech stack (HTML + vanilla JS) | Atado a SvelteKit + Three.js |
| **Cache y CDN** | CloudFront distribution separada con reglas propias | Comparte reglas de cache con el sitio |
| **Costo adicional** | ~$0 (ACM gratis, CloudFront extra ~$0) | Nada adicional |

**Conclusion:** El aislamiento de `admin.printo.uy` es claramente superior para un panel con upload de archivos y credenciales de APIs externas. El costo adicional es $0 y el setup es una sola vez.

### Decision 2: Repo unico (monorepo) vs repos separados

**Elegido: Repos separados**

El sitio actual (`3d-service-site`) NO se reestructura. Los cambios en este repo son minimos (2-3 componentes pasan de datos hardcodeados a fetch dinamico). Mover todo a `user-front/` seria un cambio disruptivo sin beneficio real.

| Repo | Contenido | Deploy |
|---|---|---|
| `3d-service-site` (este repo) | Sitio publico printo.uy | S3 + CloudFront (existente) |
| `printo-admin-pipeline` (nuevo) | Admin frontend + Lambdas + IaC (CDK) | CDK deploy |

**Justificacion:**
- El admin y el sitio no comparten codigo significativo (tech stacks distintos)
- Los Lambdas son backend que no pertenece a ningun repo de frontend
- El admin y las Lambdas estan acoplados entre si (se despliegan juntos)
- El TODO ya decidio aislamiento total (subdominio, deploy independiente)

### Decision 3: Bucket unico de contenido dinamico vs bucket por seccion

**Elegido: Bucket unico `printo-content`**

Un solo bucket S3 almacena todo el contenido dinamico del sitio. Cada seccion sigue la misma convencion de directorios, lo que permite agregar secciones futuras sin crear recursos AWS adicionales.

### Decision 4: Separacion de responsabilidades (AppConfig vs S3 content)

**Elegido: AppConfig para flags operacionales, S3 para contenido**

| Sistema | Responsabilidad | Ejemplo |
|---|---|---|
| **AWS AppConfig** | Toggles operacionales (on/off) | "Esconder seccion galeria", "Sitio fuera de servicio" |
| **S3 `printo-content`** | Datos de contenido editables | Items de galeria, materiales, colores, disponibilidad |

El flag `materials-visibility` de AppConfig se elimina. La disponibilidad de materiales y colores pasa a `materials.json` en el bucket de contenido, gestionado desde el admin.

**Flags que permanecen en AppConfig:**
- `out-of-service` — toggle de emergencia
- `sections-visibility` — mostrar/ocultar secciones enteras
- `services-visibility` — mostrar/ocultar servicios

### Decision 5: Decisiones tecnicas resueltas

| Decision | Elegido | Justificacion |
|---|---|---|
| **Autenticacion del admin** | API Key en API Gateway (fase 1) | Cognito es overkill para un solo usuario. Se puede migrar despues |
| **Preview antes de publicar** | Si, agregar preview/edicion | Poco codigo extra, evita publicar contenido incorrecto en Instagram |
| **Formatos de imagen** | JPG + PNG + WebP | Sharp los convierte todos. HEIC es problematico en Lambda |
| **Imagenes por post** | Solo 1 imagen | Carousel complica el UX del admin y el pipeline innecesariamente |
| **Programar publicacion** | No, publicar inmediatamente | Se puede agregar despues si se necesita |
| **IaC** | AWS CDK (TypeScript) | Node.js nativo, un solo `cdk deploy` levanta todo |

---

## Arquitectura General

```
                    ┌────────────────────────────────────────────────────┐
                    │              admin.printo.uy                       │
                    │  ┌───────────────────┐  ┌───────────────────────┐  │
                    │  │  Galeria          │  │  Materiales           │  │
                    │  │  (upload foto)    │  │  (editar JSON)        │  │
                    │  └────────┬──────────┘  └───────────┬───────────┘  │
                    └───────────┼─────────────────────────┼──────────────┘
                                │                         │
             ┌──────────────────┘                         └──────────────────┐
             ▼                                                               ▼
  ┌─────────────────────┐                                    ┌──────────────────────────┐
  │ API GW              │                                    │ API GW                   │
  │ POST /admin/        │                                    │ PUT /admin/              │
  │   upload-url        │                                    │   content/{type}         │
  └────────┬────────────┘                                    └───────────┬──────────────┘
           ▼                                                             ▼
  ┌─────────────────────┐                                    ┌──────────────────────────┐
  │ Lambda:             │                                    │ Lambda:                  │
  │ gallery-upload-url  │                                    │ content-writer           │
  │ (presigned URL)     │                                    │ (write JSON + invalidate)│
  └────────┬────────────┘                                    └───────────┬──────────────┘
           │                                                             │
           │  Browser sube directo a S3                                  │
           ▼                                                             ▼
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │                        S3: printo-content                                      │
  │                                                                                │
  │  data/                    assets/                     _uploads/                │
  │  ├── gallery.json         ├── gallery/                ├── raw/                 │
  │  ├── materials.json       │   └── {id}.jpg            │   └── {id}.jpg         │
  │  └── [futuro].json        └── [futuro]/               └── meta/                │
  │                                                           └── {id}.json        │
  └──────────┬─────────────────────────────────────────────────────────────────────┘
             │
             │  S3 Event: ObjectCreated en _uploads/raw/
             ▼
  ┌──────────────────────────┐
  │ Lambda:                  │
  │ gallery-processor        │
  │ (Sharp + Claude Vision)  │
  └──────┬──────┬──────┬─────┘
         │      │      │
         ▼      │      ▼
  ┌──────────┐  │  ┌──────────┐
  │ Claude   │  │  │Instagram │
  │ API      │  │  │Graph API │
  │ (Vision) │  │  │          │
  └──────────┘  │  └──────────┘
                │
                ▼
  ┌──────────────────────────────────┐
  │  CloudFront: printo.uy           │
  │                                  │
  │  /*           → S3 website       │
  │  /content/*   → S3 printo-content│
  │                                  │
  │  El sitio hace fetch de:         │
  │  /content/data/gallery.json      │
  │  /content/data/materials.json    │
  │  /content/assets/gallery/{id}.jpg│
  └──────────────────────────────────┘
```

---

## Bucket S3: `printo-content`

### Proposito

Bucket unico de contenido dinamico para todo el sitio. Almacena datos (JSONs) y archivos estaticos (imagenes) que se gestionan desde el admin sin redeploy del sitio.

### Estructura

```
printo-content/
│
├── data/                              ← JSONs de contenido (servidos via CloudFront)
│   ├── gallery.json                   ← Items de la galeria con metadata
│   ├── materials.json                 ← Materiales, colores, disponibilidad
│   └── [futura-seccion].json          ← Extensible: services.json, hero.json, etc.
│
├── assets/                            ← Archivos estaticos asociados (servidos via CloudFront)
│   ├── gallery/                       ← Fotos optimizadas de la galeria
│   │   ├── 2026-02-14_abc123.jpg
│   │   └── ...
│   └── [futura-seccion]/              ← Extensible
│
└── _uploads/                          ← Interno, NO servido por CloudFront
    ├── raw/                           ← Imagenes sin procesar (subidas desde admin)
    │   └── 2026-02-14_abc123.jpg
    └── meta/                          ← Contexto/notas del admin para el procesador
        └── 2026-02-14_abc123.json     ← {"context": "litofania san valentin", "uploadedAt": "..."}
```

### Configuracion

- **S3 Event Notification:** `s3:ObjectCreated:*` en prefijo `_uploads/raw/` → trigger Lambda `gallery-processor`
- **Lifecycle Rule:** Eliminar objetos en `_uploads/` despues de 30 dias
- **Block Public Access:** Activado. Solo accesible via CloudFront OAC y Lambda IAM role

### Convencion de extensibilidad

Agregar una nueva seccion dinamica al sitio requiere unicamente:

1. Crear `data/{seccion}.json` con el schema correspondiente
2. (Opcional) Crear `assets/{seccion}/` si la seccion tiene archivos
3. En el sitio: fetch `/content/data/{seccion}.json` con fallback a config local
4. En el admin: nueva pagina que edita el JSON

No se necesitan nuevos buckets, lambdas, ni recursos AWS.

---

## CloudFront: Behavior de contenido dinamico

Se agrega un origin adicional al CloudFront distribution existente de printo.uy:

| Path Pattern | Origin | Cache Policy |
|---|---|---|
| `/*` (default) | S3 website bucket | Long cache (build assets) |
| `/content/data/*` | S3 printo-content/data/ | Short cache (5 min TTL) o invalidacion activa |
| `/content/assets/*` | S3 printo-content/assets/ | Long cache (1 year, immutable files con ID unico) |

**Nota:** El prefijo `_uploads/` no tiene behavior en CloudFront, por lo tanto no es accesible publicamente.

El sitio consume contenido asi:

```typescript
// Gallery
const res = await fetch('/content/data/gallery.json');

// Materials
const res = await fetch('/content/data/materials.json');

// Imagenes de galeria
<img src="/content/assets/gallery/2026-02-14_abc123.jpg" />
```

Mismo dominio = sin CORS.

---

## Schemas de Contenido

### gallery.json

```json
{
  "items": [
    {
      "id": "2026-02-14_abc123",
      "title": "Tu golden en 3D",
      "description": "Litofania personalizada de tu mascota favorita",
      "category": "Mascotas",
      "image": "/content/assets/gallery/2026-02-14_abc123.jpg",
      "instagramPostId": "17899506721234567",
      "createdAt": "2026-02-14T15:30:00Z"
    }
  ],
  "updatedAt": "2026-02-14T15:30:00Z"
}
```

**Categorias validas:** Mascotas | Coleccion | Momentos | Ilustracion | Decoracion | Funcional | Personalizado

### materials.json

Migracion directa de `filamentColors.ts`. Misma estructura, en JSON:

```json
{
  "materials": {
    "pla": {
      "nombre": "PLA",
      "descripcion": "Material versatil y facil de usar, ideal para la mayoria de aplicaciones",
      "propiedades": ["Biodegradable", "Bajo olor", "Buena calidad superficial", "No flexible"],
      "disponible": true,
      "colores": {
        "negro": { "nombre": "Negro", "hex": "#000000", "disponible": true },
        "blanco": { "nombre": "Blanco", "hex": "#FFFFFF", "disponible": true },
        "rojo": { "nombre": "Rojo", "hex": "#FF0000", "disponible": true },
        "cyan": { "nombre": "Cyan", "hex": "#0086D6", "disponible": true },
        "gris": { "nombre": "Gris", "hex": "#8E9089", "disponible": true },
        "amarillo": { "nombre": "Amarillo", "hex": "#FFD834", "disponible": true },
        "beige": { "nombre": "Beige", "hex": "#F7E6DE", "disponible": true },
        "plateado": { "nombre": "Plateado", "hex": "#C8C8C8", "disponible": true },
        "azulHieloTranslucido": { "nombre": "Azul Hielo translucido", "hex": "#B8CDE9", "disponible": true },
        "azul": { "nombre": "Azul", "hex": "#3B82F6", "disponible": false },
        "verde": { "nombre": "Verde", "hex": "#10B981", "disponible": false },
        "violeta": { "nombre": "Violeta", "hex": "#A855F7", "disponible": false }
      }
    },
    "petg": {
      "nombre": "PETG",
      "descripcion": "Mayor resistencia y durabilidad que PLA, resistente a impactos",
      "propiedades": ["Resistente", "Flexible", "Resistente a quimicos", "Uso alimentario"],
      "disponible": true,
      "colores": {
        "azul": { "nombre": "Azul", "hex": "#001489", "disponible": true },
        "grisTranslucido": { "nombre": "Gris translucido", "hex": "#8E8E8E", "disponible": true },
        "negro": { "nombre": "Negro", "hex": "#000000", "disponible": false }
      }
    }
  },
  "updatedAt": "2026-02-14T12:00:00Z"
}
```

El admin puede desde su panel:
- Agregar/eliminar materiales
- Agregar/eliminar colores de un material
- Cambiar disponibilidad (material completo o color individual)
- Editar nombre, descripcion, propiedades

---

## Componentes Detallados

### 1. Admin Panel (admin.printo.uy)

**Que es:** Panel de administracion para gestionar contenido dinamico del sitio.

**Tech stack:** HTML + vanilla JS, o Svelte minimal (NO SvelteKit, NO Three.js).

**Hosting:** S3 + CloudFront con distribution separada.

**Paginas:**

#### Pagina: Galeria

- Formulario con:
  - Input de imagen (acepta JPG, PNG, WebP)
  - Campo opcional de "contexto/notas" para enriquecer el prompt de Claude
  - Preview de la imagen antes de subir
  - Boton de subir
- **Preview del contenido generado por IA** antes de confirmar publicacion:
  - Muestra titulo, descripcion, categoria, caption de Instagram generados
  - Permite editar cualquier campo antes de publicar
  - Botones: "Publicar en web + Instagram" / "Solo web" / "Descartar"
- Estado de progreso: "Subiendo..." → "Procesando IA..." → "Esperando confirmacion" → "Publicado"
- Historial de uploads con estado

#### Pagina: Materiales

- Lista de materiales existentes (leidos de `materials.json`)
- Para cada material:
  - Toggle de disponibilidad
  - Editar nombre, descripcion, propiedades
  - Lista de colores con toggle de disponibilidad por color
  - Agregar/eliminar colores (nombre, hex, disponibilidad)
- Agregar nuevo material
- Boton "Guardar cambios" → PUT a API Gateway → Lambda `content-writer`

#### Pagina N: Futura seccion

Mismo patron: leer JSON del bucket → UI para editar → guardar JSON → invalidar cache.

**Flujo tecnico de upload (galeria):**

1. El admin page hace request a API Gateway: `POST /admin/upload-url`
2. Lambda `gallery-upload-url` genera **presigned URLs** de S3 (PUT)
3. El browser sube el meta JSON a `_uploads/meta/{id}.json` (si hay contexto)
4. El browser sube la imagen a `_uploads/raw/{id}.jpg` (trigger de S3 Event)
5. Lambda `gallery-processor` procesa la imagen y genera contenido con IA
6. El resultado vuelve al admin via polling o WebSocket para preview/edicion
7. El admin confirma → el processor finaliza (actualiza gallery.json, publica Instagram)

**Autenticacion:**

- **Fase 1:** API Gateway con API Key. CloudFront puede restringir por IP adicionalmente
- **Fase 2 (futuro):** Amazon Cognito User Pool + Lambda@Edge para validar tokens

**DNS:**

- Registro CNAME: `admin.printo.uy` → CloudFront distribution del admin
- Certificado SSL en ACM para `admin.printo.uy`

---

### 2. Lambda: `gallery-upload-url`

**Proposito:** Genera presigned URLs para que el admin pueda subir directamente a S3.

**Trigger:** API Gateway `POST /admin/upload-url`

**Input:**

```json
{
  "filename": "foto-mascota.jpg",
  "contentType": "image/jpeg",
  "context": "Litofania de un perro golden retriever"
}
```

**Output:**

```json
{
  "uploadUrl": "https://printo-content.s3.amazonaws.com/_uploads/raw/2026-02-14_abc123.jpg?X-Amz-...",
  "metaUrl": "https://printo-content.s3.amazonaws.com/_uploads/meta/2026-02-14_abc123.json?X-Amz-...",
  "id": "2026-02-14_abc123"
}
```

**Logica:**

1. Validar API key
2. Generar UUID para el archivo
3. Generar presigned URL de PUT para `_uploads/raw/{id}.{ext}` (expira en 5 min)
4. Si hay contexto, generar presigned URL para `_uploads/meta/{id}.json`
5. Retornar ambas URLs + ID

**Runtime:** Node.js 20.x | **Memory:** 128MB | **Timeout:** 10s

---

### 3. Lambda: `gallery-processor`

**Proposito:** Procesa la imagen subida, genera contenido con IA, actualiza la galeria, publica en Instagram.

**Trigger:** S3 Event Notification (`ObjectCreated` en `_uploads/raw/`)

**Flujo paso a paso:**

#### Paso 1: Descargar imagen de S3

- Obtener la imagen de `_uploads/raw/{id}.jpg`
- Obtener el meta-file de `_uploads/meta/{id}.json` (si existe)

#### Paso 2: Optimizar imagen

- Usar **Sharp** (via Lambda Layer)
- Redimensionar a maximo 1200px de ancho (mantener aspect ratio)
- Generar version JPEG optimizada (quality 85) para la web
- Generar version para Instagram si es necesario (1080x1080 o 1080x1350)
- Guardar version optimizada en `assets/gallery/{id}.jpg`

#### Paso 3: Enviar a Claude API (Vision) para generar contenido

**Prompt:**

```
Sos el social media manager de PRINTO, un servicio de impresion 3D en Uruguay
(Montevideo y Las Piedras). Analiza esta imagen de un producto impreso en 3D.

Contexto adicional del operador: "{context_del_admin}"

Responde UNICAMENTE con JSON valido, sin markdown ni explicaciones:
{
  "title": "titulo corto y llamativo en español (max 8 palabras)",
  "description": "una linea descriptiva en español para la galeria web",
  "category": "una de: Mascotas | Coleccion | Momentos | Ilustracion | Decoracion | Funcional | Personalizado",
  "instagramCaption": "caption atractivo en español para Instagram (2-3 lineas, con emojis relevantes)",
  "hashtags": ["lista", "de", "15-20", "hashtags", "relevantes"]
}
```

**Modelo:** Claude Sonnet (balance costo/calidad)

**Output esperado:**

```json
{
  "title": "Tu golden en 3D",
  "description": "Litofania personalizada de tu mascota favorita",
  "category": "Mascotas",
  "instagramCaption": "Cada mascota merece ser inmortalizada ...",
  "hashtags": ["impresion3d", "3dprinting", "litofania", "lithophane", "mascota", "pet", "goldenretriever", "perro", "dog", "regalo", "gift", "personalizado", "custom", "printo", "uruguay", "montevideo", "3dprint", "petlover"]
}
```

#### Paso 4: Retornar resultado al admin para preview

- Guardar resultado en `_uploads/meta/{id}-result.json`
- El admin page hace polling a un endpoint que lee este resultado
- El admin puede editar titulo, descripcion, caption, etc.
- El admin confirma → continua al paso 5

#### Paso 5: Actualizar gallery.json

- Leer `data/gallery.json` actual del bucket
- Agregar nuevo item al inicio del array `items`
- Escribir de vuelta a S3
- **Importante:** Usar `If-Match` con ETag para evitar race conditions

#### Paso 6: Publicar en Instagram

Instagram Graph API requiere 2+ llamadas:

**6a. Crear media container:**

```
POST https://graph.facebook.com/v19.0/{ig-user-id}/media
  image_url = https://printo.uy/content/assets/gallery/{id}.jpg
  caption   = {instagramCaption}\n\n{hashtags con #}
  access_token = {token desde SSM}
```

**Nota:** La `image_url` debe ser publica. Como la imagen ya esta en CloudFront, se usa `https://printo.uy/content/assets/gallery/{id}.jpg`.

**6b. Esperar procesamiento (polling):**

```
GET https://graph.facebook.com/v19.0/{container-id}?fields=status_code
  Poll cada 5s, max 60s, hasta status_code == "FINISHED"
```

**6c. Publicar:**

```
POST https://graph.facebook.com/v19.0/{ig-user-id}/media_publish
  creation_id = {container_id}
  access_token = {token}
```

**6d. Guardar el Instagram Post ID** en gallery.json

#### Paso 7: Invalidar CloudFront

```
Crear invalidation para:
  - /content/data/gallery.json
  - /content/assets/gallery/{id}.jpg
```

**Runtime:** Node.js 20.x | **Memory:** 512MB (Sharp necesita mas) | **Timeout:** 120s

**Variables de entorno:**

```
CONTENT_BUCKET=printo-content
CLOUDFRONT_DISTRIBUTION_ID=EXXXXXXXXX
CLAUDE_API_KEY_PARAM=/printo/claude-api-key
INSTAGRAM_TOKEN_PARAM=/printo/instagram-token
INSTAGRAM_USER_ID_PARAM=/printo/instagram-user-id
```

---

### 4. Lambda: `content-writer`

**Proposito:** Escribe JSONs de contenido al bucket y invalida el cache de CloudFront. Usado para secciones que no requieren procesamiento especial (materiales, futuros).

**Trigger:** API Gateway `PUT /admin/content/{type}`

**Input:**

```json
{
  "type": "materials",
  "data": {
    "materials": { ... },
    "updatedAt": "2026-02-14T15:30:00Z"
  }
}
```

**Logica:**

1. Validar API key
2. Validar schema del JSON segun el `type` (opcional, pero recomendado)
3. Escribir a `data/{type}.json` en el bucket `printo-content`
4. Crear invalidation en CloudFront para `/content/data/{type}.json`
5. Retornar resultado

**Nota:** Esta Lambda es generica. Sirve para `materials.json` hoy y para cualquier `{seccion}.json` en el futuro sin cambios.

**Runtime:** Node.js 20.x | **Memory:** 128MB | **Timeout:** 15s

---

### 5. Lambda: `instagram-token-refresh`

**Proposito:** Renovar automaticamente el token de Instagram antes de que expire.

**Trigger:** EventBridge Scheduled Rule — cada 50 dias (los tokens duran 60 dias)

**Logica:**

1. Leer token actual desde SSM Parameter Store (`/printo/instagram-token`)
2. Llamar al endpoint de refresh:
   ```
   GET https://graph.facebook.com/v19.0/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id={app-id}
     &client_secret={app-secret}
     &fb_exchange_token={current-token}
   ```
3. Guardar nuevo token en SSM Parameter Store
4. (Opcional) Enviar notificacion por email/WhatsApp si falla

**Runtime:** Node.js 20.x | **Memory:** 128MB | **Timeout:** 30s

---

### 6. Cambios en 3d-service-site (este repo)

#### Patron de consumo: fetch dinamico con fallback local

Todos los componentes que pasan a contenido dinamico siguen el mismo patron:

```
fetch /content/data/{seccion}.json
  ├── Exito  → Usar datos del JSON
  └── Error  → Usar config local (filamentColors.ts, galleryItems hardcodeados)
```

Este patron ya existe en el proyecto (feature flags con override de AppConfig + fallback local). La diferencia es que ahora el override es contenido completo, no solo toggles.

#### Gallery3D.svelte

**Que cambia:**
- El array `galleryItems` hardcodeado se convierte en fallback
- Se agrega fetch a `/content/data/gallery.json` en `onMount`
- Loading skeleton mientras carga
- Estado vacio si no hay items
- Ordenamiento por `createdAt` (mas reciente primero)

**Interface actualizada:**

```typescript
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  instagramPostId?: string;
}
```

**Migracion:** Los 4 items actuales se migran a `gallery.json` con IDs y timestamps retroactivos.

#### FilamentColors.svelte

**Que cambia:**
- Se agrega fetch a `/content/data/materials.json` en `onMount`
- Si el fetch tiene exito, los datos remotos reemplazan a `filamentColors.ts`
- Si falla, se usa la config local como fallback (comportamiento actual)
- El flag `materials-visibility` de AppConfig se elimina

**Nota:** `filamentColors.ts` sigue existiendo como fallback. No se elimina, solo deja de ser la fuente primaria.

#### Flag materials-visibility

Se elimina de:
- `featureFlagsStore.ts` (derived store `materialsVisibilityFlag`)
- `featureFlags.ts` (type `MaterialsVisibilityFlag`)
- `materialsVisibilityDefaults.ts` (archivo completo)
- `visibilityHelpers.ts` (funciones de materials: `isMaterialAvailable`, `getAvailableMaterials`, `getMaterialesWithFlagOverride`, `countAvailableMaterials`, `countAvailableColors`)

La disponibilidad de materiales ahora viene directamente del JSON remoto.

---

### 7. SSM Parameter Store

Todos los secretos en AWS SSM Parameter Store como SecureString:

| Parametro | Tipo | Descripcion |
|---|---|---|
| `/printo/claude-api-key` | SecureString | API key de Anthropic para Claude |
| `/printo/instagram-token` | SecureString | Long-lived access token de Instagram |
| `/printo/instagram-user-id` | String | Instagram Business Account ID |
| `/printo/instagram-app-id` | SecureString | Meta App ID |
| `/printo/instagram-app-secret` | SecureString | Meta App Secret |
| `/printo/admin-api-key` | SecureString | API key para el admin panel |

---

## Repositorio Nuevo: `printo-admin-pipeline`

### Estructura

```
printo-admin-pipeline/
├── admin/                              ← Frontend del admin panel
│   ├── index.html                      ← Entry point
│   ├── pages/
│   │   ├── gallery.html                ← Pagina de galeria
│   │   └── materials.html              ← Pagina de materiales
│   ├── js/
│   │   ├── api.js                      ← Cliente de API Gateway
│   │   ├── gallery.js                  ← Logica de upload + preview
│   │   └── materials.js                ← Logica de edicion de materiales
│   └── css/
│       └── styles.css
├── lambdas/                            ← Funciones Lambda
│   ├── gallery-upload-url/
│   │   └── index.ts
│   ├── gallery-processor/
│   │   └── index.ts
│   ├── content-writer/
│   │   └── index.ts
│   └── instagram-token-refresh/
│       └── index.ts
├── infra/                              ← AWS CDK (TypeScript)
│   ├── lib/
│   │   ├── content-bucket-stack.ts     ← S3 printo-content + lifecycle rules
│   │   ├── admin-hosting-stack.ts      ← S3 + CloudFront admin.printo.uy
│   │   ├── api-stack.ts               ← API Gateway + Lambdas
│   │   ├── cloudfront-behavior-stack.ts← Behavior /content/* en CF principal
│   │   └── scheduled-stack.ts         ← EventBridge + instagram-token-refresh
│   └── bin/
│       └── app.ts
├── shared/                             ← Types compartidos entre lambdas
│   └── types.ts
├── layers/                             ← Lambda Layers
│   └── sharp/                          ← Sharp para procesamiento de imagen
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisitos de Instagram

Antes de implementar la fase de Instagram, configurar la cuenta para uso programatico:

### Paso 1: Cuenta Business

- Instagram → Configuracion → Cuenta → Cambiar a cuenta profesional → "Empresa"

### Paso 2: Facebook Page

- Crear Facebook Page para PRINTO (si no existe)
- Vincular cuenta Instagram: Facebook Page → Configuracion → Instagram → Conectar cuenta

### Paso 3: Meta Developer App

- Ir a [developers.facebook.com](https://developers.facebook.com)
- Crear app tipo "Business"
- Agregar producto "Instagram Graph API"
- Permisos: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`

### Paso 4: Generar Token

- En Graph API Explorer, generar token con los permisos
- Convertir a long-lived token (60 dias):
  ```
  GET https://graph.facebook.com/v19.0/oauth/access_token
    ?grant_type=fb_exchange_token
    &client_id={app-id}
    &client_secret={app-secret}
    &fb_exchange_token={short-lived-token}
  ```
- Guardar en SSM Parameter Store

### Paso 5: Obtener Instagram User ID

```
GET https://graph.facebook.com/v19.0/me/accounts?access_token={token}
→ obtener page_id

GET https://graph.facebook.com/v19.0/{page_id}?fields=instagram_business_account&access_token={token}
→ obtener instagram_business_account.id
```

---

## Recursos AWS (resumen)

```
NUEVOS:
├── S3 Bucket: printo-content
│   ├── Event Notification: _uploads/raw/ → Lambda gallery-processor
│   └── Lifecycle Rule: delete _uploads/ after 30 days
├── S3 Bucket: printo-admin (hosting del admin page)
├── CloudFront Distribution: admin.printo.uy → S3 printo-admin
├── ACM Certificate: admin.printo.uy
├── DNS Record: admin.printo.uy CNAME → CloudFront admin
├── API Gateway:
│   ├── POST /admin/upload-url
│   └── PUT /admin/content/{type}
├── Lambda: gallery-upload-url (128MB, 10s timeout)
├── Lambda: gallery-processor (512MB, 120s timeout)
├── Lambda: content-writer (128MB, 15s timeout)
├── Lambda: instagram-token-refresh (128MB, 30s timeout)
├── Lambda Layer: Sharp
├── EventBridge Rule: instagram-token-refresh cada 50 dias
├── SSM Parameter Store: 6 parametros
└── IAM Roles: 4 roles de ejecucion Lambda

MODIFICADOS:
├── CloudFront printo.uy: nuevo origin behavior /content/* → S3 printo-content
└── 3d-service-site: Gallery3D.svelte + FilamentColors.svelte → fetch dinamico

ELIMINADOS (eventualmente):
└── AppConfig flag: materials-visibility (reemplazado por materials.json)

SIN CAMBIOS:
├── S3 Website Bucket (hosting del sitio)
├── API Gateway existente (feature flags)
└── Lambda existente (AppConfig)
```

---

## Estimacion de Costos Mensuales

| Recurso | Costo/mes |
|---|---|
| S3 printo-content (storage + requests) | ~$0.05 |
| S3 printo-admin (hosting) | ~$0.01 |
| CloudFront admin.printo.uy | ~$0.00 |
| CloudFront behavior /content/* (en distro existente) | ~$0.00 |
| Lambda invocaciones (~20-40/mes total) | ~$0.00 (free tier) |
| API Gateway requests | ~$0.00 (free tier) |
| Claude API (Sonnet, ~10-20 imagenes/mes) | ~$0.30-0.60 |
| SSM Parameter Store | $0.00 (standard tier) |
| CloudFront invalidations | $0.00 (primeras 1000 gratis) |
| **Total estimado** | **< $1/mes** |

---

## Orden de Implementacion

### Fase 1: Contenido dinamico en el sitio (en `3d-service-site`)

**Rama:** `feature/dynamic-content`

1. Crear `materials.json` inicial (migracion de `filamentColors.ts`)
2. Crear `gallery.json` inicial (migracion de los 4 items hardcodeados)
3. Crear servicio generico de fetch con cache y fallback (patron reutilizable)
4. Modificar `FilamentColors.svelte` para consumir `materials.json` con fallback a config local
5. Modificar `Gallery3D.svelte` para consumir `gallery.json` con fallback a items hardcodeados
6. Eliminar flag `materials-visibility` de AppConfig (store, types, helpers)
7. Deploy del sitio. Todo funciona igual que antes pero listo para datos dinamicos

### Fase 2: Infraestructura y admin basico (en `printo-admin-pipeline`)

8. Inicializar repo con CDK + estructura de directorios
9. CDK Stack: bucket `printo-content`, subir JSONs + imagenes iniciales
10. CDK Stack: CloudFront behavior `/content/*` en distribution principal
11. CDK Stack: Lambda `content-writer` + API Gateway `PUT /admin/content/{type}`
12. Admin page: pagina de materiales (leer, editar, guardar `materials.json`)
13. Deploy con `cdk deploy`
14. **Test E2E:** Cambiar disponibilidad de un color desde admin → se refleja en printo.uy sin redeploy

### Fase 3: Pipeline de galeria (en `printo-admin-pipeline`)

15. CDK Stack: Lambda `gallery-upload-url` + API Gateway `POST /admin/upload-url`
16. CDK Stack: Lambda `gallery-processor` (Sharp + update gallery.json, sin IA ni Instagram aun)
17. CDK Stack: S3 Event Notification `_uploads/raw/` → gallery-processor
18. Admin page: pagina de galeria (upload + preview)
19. **Test E2E:** Subir foto desde admin → aparece en galeria

### Fase 4: IA + Instagram (en `printo-admin-pipeline`)

20. Configurar cuenta Business de Instagram + Meta App + token (prerequisitos)
21. Agregar integracion Claude Vision al gallery-processor
22. Agregar preview/edicion en admin page (ver resultado de IA antes de publicar)
23. Agregar publicacion a Instagram al gallery-processor
24. CDK Stack: Lambda `instagram-token-refresh` + EventBridge rule
25. **Test E2E:** Subir foto → IA genera contenido → preview → confirmar → galeria + Instagram

### Fase 5: Pulido

26. Mejorar admin page: historial de uploads, estados, errores
27. Agregar manejo de errores y reintentos en el processor
28. Agregar notificaciones (email o WhatsApp) si algo falla
29. Considerar: boton de "eliminar" en admin, reordenar galeria, editar items existentes

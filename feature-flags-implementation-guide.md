# Guía de Implementación: Feature Flags con AWS AppConfig

## Resumen del Proyecto

**Objetivo:** Implementar un sistema de feature flags que permita modificar la configuración de una SPA en tiempo real sin necesidad de redeploy.

**Arquitectura:**

```
SPA (AWS Amplify) → API Gateway → Lambda → AppConfig

```

---

## Estado Actual

### Completado

| Componente | Estado | Detalles |
| --- | --- | --- |
| AppConfig Application | Creada | Nombre: **`printo-config`** |
| AppConfig Environment | Creado | Nombre: `production` |
| AppConfig Configuration Profile | Creado | Nombre: `feature-flags` (tipo: Feature Flag) |
| Feature Flags | Configurados | Flag actual: `out-of-service` (enabled: true) |
| Lambda Function | Creada y funcionando | Nombre: `get-feature-flags`, Runtime: Node.js 20.x, Arquitectura: arm64 |
| Lambda Layer | Configurada | AWS-AppConfig-Extension |
| Lambda IAM | Configurado | Política: AmazonAppConfigReadOnly |
| API Gateway | Creada y funcionando | Tipo: HTTP API, Nombre: `feature-flags-api` |
| Ruta API | Configurada | GET /config |
| **Configuración CORS** | **Completada** | **Origen permitido: `https://www.printo.uy/**` |

### Pendiente

| Tarea | Prioridad | Notas |
| --- | --- | --- |
| Implementar fetch en la SPA | Alta | Cargar configuración antes del render |
| Migrar flags existentes a AppConfig | Media | Agregar todos los toggles actuales del proyecto |

---

## Información de Recursos AWS

### API Gateway

* **API Name:** `feature-flags-api`
* **API ID:** `i5g5q5flt8`
* **Region:** `us-east-2`
* **Endpoint:** `https://i5g5q5flt8.execute-api.us-east-2.amazonaws.com/config`
* **Método:** GET
* **CORS:** Configurado para `https://www.printo.uy/` (Headers: `content-type`)

### Lambda

* **Function Name:** `get-feature-flags`
* **Runtime:** Node.js 20.x
* **Architecture:** arm64
* **Layer:** AWS-AppConfig-Extension (última versión)

**Variables de entorno:**
| Key | Value |
|-----|-------|
| `APPCONFIG_APPLICATION` | **`printo-config`** |
| `APPCONFIG_ENVIRONMENT` | `production` |
| `APPCONFIG_CONFIGURATION` | `feature-flags` |

**Código de la Lambda:**

```javascript
export const handler = async (event) => {
  const appName = process.env.APPCONFIG_APPLICATION;
  const envName = process.env.APPCONFIG_ENVIRONMENT;
  const configName = process.env.APPCONFIG_CONFIGURATION;

  const url = `http://localhost:2772/applications/${appName}/environments/${envName}/configurations/${configName}`;

  try {
    const response = await fetch(url);
    const config = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // Nota: API Gateway maneja el bloqueo, pero es buena práctica reflejarlo aquí o usar el contexto del evento
        'Access-Control-Allow-Origin': 'https://www.printo.uy/', 
        'Access-Control-Allow-Methods': 'GET',
      },
      body: JSON.stringify(config),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://www.printo.uy/',
      },
      body: JSON.stringify({ error: 'Failed to fetch configuration' }),
    };
  }
};

```

### AppConfig

* **Application:** **`printo-config`**
* **Environment:** `production`
* **Configuration Profile:** `feature-flags` (tipo Feature Flag)

**Flags actuales:**
| Flag Key | Tipo | Estado |
|----------|------|--------|
| `out-of-service` | Boolean | enabled: true |

---

## Respuesta Actual del Endpoint

```bash
curl -H "Origin: https://www.printo.uy/" https://i5g5q5flt8.execute-api.us-east-2.amazonaws.com/config

```

```json
{"out-of-service":{"enabled":true}}

```

---

## Próximos Pasos para Implementación en el Repositorio

### 1. Crear servicio de configuración en la SPA

Crear un módulo que:

* Haga fetch al endpoint de configuración
* Tenga fallback a valores por defecto si falla el fetch
* Cachee la configuración en memoria
* Exponga los flags de manera tipada (si usa TypeScript)

**Ejemplo de implementación sugerida:**

```typescript
// src/services/featureFlags.ts

interface FeatureFlags {
  'out-of-service': { enabled: boolean };
  // Agregar otros flags aquí
}

const CONFIG_URL = 'https://i5g5q5flt8.execute-api.us-east-2.amazonaws.com/config';

const DEFAULT_FLAGS: FeatureFlags = {
  'out-of-service': { enabled: false },
  // Valores por defecto para otros flags
};

let cachedFlags: FeatureFlags | null = null;

export async function loadFeatureFlags(): Promise<FeatureFlags> {
  if (cachedFlags) {
    return cachedFlags;
  }

  try {
    const response = await fetch(CONFIG_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch feature flags');
    }
    cachedFlags = await response.json();
    return cachedFlags;
  } catch (error) {
    console.error('Error loading feature flags, using defaults:', error);
    return DEFAULT_FLAGS;
  }
}

export function getFlag(flagKey: keyof FeatureFlags): boolean {
  if (!cachedFlags) {
    return DEFAULT_FLAGS[flagKey]?.enabled ?? false;
  }
  return cachedFlags[flagKey]?.enabled ?? false;
}

```

### 2. Integrar en el punto de entrada de la aplicación

```typescript
// src/main.ts o src/index.tsx

import { loadFeatureFlags } from './services/featureFlags';

async function bootstrap() {
  // Cargar flags antes de inicializar la app
  await loadFeatureFlags();
  
  // Inicializar la aplicación
  // ...
}

bootstrap();

```

### 3. Usar los flags en componentes

```typescript
import { getFlag } from './services/featureFlags';

if (getFlag('out-of-service')) {
  // Mostrar página de mantenimiento
}

```

---

## Flujo para Modificar Flags (Post-Implementación)

1. Ir a **AWS Console** → **Systems Manager** → **AppConfig**
2. Seleccionar aplicación **`printo-config`**
3. Ir a **Configuration profiles and feature flags**
4. Seleccionar `feature-flags`
5. Modificar los toggles deseados
6. Clic en **Save new version**
7. Clic en **Start deployment**
8. Seleccionar environment `production`
9. Seleccionar estrategia **AppConfig.AllAtOnce**
10. Clic en **Start deployment**

Los cambios estarán disponibles en segundos sin necesidad de redeploy de la SPA.

---

## Información del Proyecto SPA

* **Hosting:** AWS Amplify
* **Tipo:** SPA (Single Page Application)
* **Renderizado:** Client-side
* **Repositorio local:** `~/proyectos/3d-service-site`

---

## Notas Adicionales

* La extensión de AppConfig en Lambda cachea la configuración automáticamente, mejorando el performance.
* El endpoint de API Gateway tiene auto-deploy activado.
* CORS está restringido estrictamente a `https://www.printo.uy/` para seguridad en producción.
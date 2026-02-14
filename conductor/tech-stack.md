# Tech Stack - [PRINTO]

## Languages

| Language | Version | Usage |
| --- | --- | --- |
| TypeScript | 5.x | Primary language (strict mode) |
| JavaScript | ES modules | Config files, build tooling |

## Frontend

| Technology | Version | Role |
| --- | --- | --- |
| Svelte | 5.x | UI framework (runes reactive system) |
| SvelteKit | 2.x | Application framework (static adapter, SPA) |
| Tailwind CSS | 3.4 | Utility-first styling |
| Three.js | 0.160+ | 3D model rendering and interaction |
| Lucide Svelte | 0.460+ | Icon library |
| JSZip | 3.10+ | 3MF file parsing (ZIP extraction) |

## Build & Tooling

| Tool | Version | Role |
| --- | --- | --- |
| Vite | 7.3 | Build tool and dev server |
| PostCSS | 8.4 | CSS processing (with Autoprefixer) |
| ESLint | 9.x | Code linting |
| svelte-check | 4.x | Svelte type checking |

## Infrastructure

| Service | Role |
| --- | --- |
| AWS S3 | Static site hosting |
| AWS CloudFront | CDN distribution |
| AWS AppConfig | Feature flags (via Lambda + API Gateway) |
| GitHub Actions | CI/CD automated pipeline |

### Deployment

- **Branches:** `main` and `develop` both deploy automatically via GitHub Actions
- **Target:** S3 → CloudFront (static SPA)
- **SSR:** Disabled (Three.js requires DOM)
- **Pre-rendering:** Layout only (`prerender = true` on layout)

## Database

**None (stateless).** All configuration is static or via feature flags.

> Future consideration: database for managing filament colors and material types.

## Key Architectural Patterns

- **Factory Pattern** for 3D model loaders (STL, 3MF, OBJ)
- **Svelte stores** for global state (model, UI, feature flags)
- **Feature flags** with graceful degradation (AWS AppConfig → local config fallback)
- **Deep cloning** for model thumbnails (prevents mutation)

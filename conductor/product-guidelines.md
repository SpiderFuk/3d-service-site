# Product Guidelines - [PRINTO]

## Voice and Tone

**Professional and technical.** The UI and copy should convey expertise and reliability in 3D printing. Use clear, precise language that builds trust with customers while remaining accessible to non-technical users.

- All UI text is in **Spanish**
- Code comments may be in Spanish or English
- Documentation is in English

## Design Principles

### 1. Simplicity Over Features
Keep the interface clean and focused. Don't overwhelm users with options. Each section should have a clear purpose and guide the user toward contacting via WhatsApp.

### 2. Visual Impact and Interactivity
Leverage the 3D model viewer and modern design to stand out from competitors. The interactive experience (rotating models, viewing materials, uploading files) is a key differentiator.

## UI Standards

Design system: **PRINTO Filamento** (`design/landing-v1/BUILD.md` is the source of truth; tokens live in `src/lib/styles/tokens.css`).

- **Mobile-first** responsive design (phone ≤959 px, small desktop 960–1199 px, desktop ≥1200 px)
- **Colors:** cobalto `#2B3CFF`, tomate, mantequilla, menta, crema page background, tinta text and 2 px borders. No hex colors outside `tokens.css`
- **Fonts:** Bricolage Grotesque (700/800, headlines) + Figtree (400/500/600, text)
- **No icons, no emojis**
- **Buttons:** the cobalto "Pedir presupuesto" button appears once at a time; the WhatsApp button in Contacto is mantequilla; the rest are tinta
- **Extrusion:** tomate stacked shadow, once per view
- Motion respects `prefers-reduced-motion`

## Content Guidelines

- Keep section headings short and descriptive
- Use action-oriented CTAs (e.g., "Pedir presupuesto")
- Display model dimensions and volume clearly
- Show available materials and colors visually (color swatches)

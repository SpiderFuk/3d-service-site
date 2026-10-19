# Product Guidelines - printo

## Voice and Tone

**Close, colorful, handmade but printed by a machine.** The UI conveys expertise and reliability in 3D printing, in a warm, direct voice. Clear, concrete language that builds trust and stays accessible to non-technical users.

- All UI text is in **Spanish**, Uruguayan voseo ("Mandanos tu archivo y la imprimimos")
- Brand name is lowercase: `printo`
- No emojis, anywhere
- Code comments may be in Spanish or English
- Documentation is in English

## Design Principles

### 1. Simplicity Over Features
Keep the interface clean and focused. Each section has one purpose and guides the user toward contacting via WhatsApp.

### 2. Visual Impact and Interactivity
The 3D model viewer and the brand's printed-layer look (extruded p, filament spool) set the service apart. The interactive experience (rotating models, viewing materials, uploading files) is a key differentiator.

### 3. Brand: "Filamento"
Full rules live in `docs/brand.md`; tokens in `tailwind.config.js` and `static/brand/brand.css`. Never invent colors or fonts outside those files.

## UI Standards

- **Mobile-first** responsive design
- **Palette:** cobalto #2B3CFF (primary), tomate #FF5A47, mantequilla #FFD84D, menta #86E3C0, crema #FFF4E0 (page background), tinta #1B1B2F (text, borders, dark ground), tinta-suave #4A4A63 (secondary text)
- **WhatsApp CTA color:** #25D366 (green), with tinta text for contrast
- **Fonts:** Bricolage Grotesque 700-800 (titles, brand), Figtree 400-600 (text)
- **Shape:** pill buttons and tags, rounded cards (20-28px), white surfaces with a 2px tinta border on crema; no gradients
- Tomate, mantequilla and menta are never text colors; tomate is the accent (extrusion of the p, dot of the i)
- Logo: only from `static/brand/logo/`, never recolored; wordmark cobalto on light grounds, cream on cobalto or tinta
- Smooth transitions (300ms ease-in-out); visible keyboard focus; interactive targets at least 44px

## Content Guidelines

- Keep section headings short and descriptive
- Use action-oriented CTAs (e.g., "Cotizar por WhatsApp")
- Display model dimensions and volume clearly
- Show available materials and colors visually (color swatches); `filamentColors.ts` holds real product colors and is not part of the brand palette

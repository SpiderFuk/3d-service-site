# printo landing v1: build spec

This folder is the design handoff for the new printo.uy landing page. It was designed section by section (wireframe, copy, visual, QA, approved) on the printo design canvas. Build the real page in this repo from it.

## Files

| File | What it is |
| --- | --- |
| `BUILD.md` | This spec: structure, copy, behavior, rules. The source of truth when it and the HTML disagree. |
| `landing-final.html` | Static reference of the approved page (desktop and phone through CSS). Open it in a browser and match it. It is not production code: no JavaScript, the viewer, accordion and menu are frozen in one state. |
| `tokens.json` | PRINTO Filamento design tokens: colors, type, spacing, radius, extrusion. |
| `assets/printo-wordmark-cobalto.svg` | The wordmark used in the bar and the footer. The other logo files live in `D:\[PRINTO]\logo` (crema and tinta wordmarks, the p, favicons). |

Design canvas (private, for reference): https://claude.ai/artifact/QZGTDtk9pE67nvaT529N7c, page v1, last board "11 Pie · 5 Final".

## How to build it

1. Keep the current stack of this repo. Do not add a framework just for this page.
2. Put the design tokens in one place (CSS custom properties are enough) and use them everywhere. No hard-coded colors outside that file.
3. Build section by section in the order below. Compare each one with `landing-final.html` at 1440 px and 375 px before moving on.
4. Keep every text exactly as written here, accents included. Spanish (Uruguay), voseo.
5. Three things live in one place each, so the owner can change them with one edit: the opening hours, the filament stock list, and the WhatsApp number.

## Design system rules (PRINTO Filamento)

- Colors: cobalto `#2B3CFF`, tomate `#FF5A47`, mantequilla `#FFD84D`, menta `#86E3C0`, crema `#FFF4E0` (page background), blanco `#FFFFFF`, tinta `#1B1B2F` (text, all borders), tinta-suave `#4A4A63` (secondary text).
- Fonts: Bricolage Grotesque 700/800 for headlines and titles; Figtree 400/500/600 for everything else. Load both from Google Fonts with `display=swap`.
- Section headline: 56 px desktop, 36 px phone, weight 800, letter-spacing -0.04em, line-height 0.95, sentence case, the second phrase in cobalto. Hero and Contacto headlines: 72 px desktop.
- Eyebrow above every headline: 13 px, 600, uppercase, letter-spacing 0.1em, tinta-suave.
- Borders: 2 px tinta on every card, tile, button and box. Radius: 20 px (small tiles, chips), 24 px (cards), 28 px (large tiles), pill for buttons and tags.
- Extrusion (tomate stacked shadow, `tokens.json > shadow.extrude`): one element per view, square-edged shapes only. Used on the hero spool and the 3D viewer frame. Never on text or the logo.
- At most 3 support colors (tomate, mantequilla, menta) per view.
- No icons, no emojis. Shapes drawn with CSS or inline SVG only.
- Buttons: the only cobalto button is the quote button (hero and bar). Every other button is tinta with crema text, except WhatsApp in Contacto (mantequilla).
- One quote button at a time: the bar's "Pedir presupuesto" appears only after the hero button has scrolled out of view.
- `.cta` hover: lift 2 px and rotate -1.5deg; disabled under `prefers-reduced-motion`.
- Focus ring: 3 px cobalto, offset 3 px. Inside the cobalto Contacto section it turns crema.
- Links: tinta, underlined (offset 4 px). Hover: cobalto. Inside Contacto: crema, hover mantequilla.
- Breakpoints: phone up to 959 px, small desktop 960 to 1199 px, desktop 1200 px and up. Extra rules under 360 px where noted.
- Page side padding: 64 px desktop, 16 px phone. Section padding: 96 px top and bottom desktop, 32 px phone, gap 12 px on phone.

## WhatsApp

Number: `59896341462` (shown as "096 341 462"). Every button opens `https://wa.me/59896341462?text=<message>` in a new tab (`target="_blank" rel="noopener"`), with its own message so the owner knows where the person came from:

| Where | Message |
| --- | --- |
| Hero and bar, "Pedir presupuesto" | Hola printo, quiero pedir un presupuesto. |
| Tres caminos, "Mandar mi foto" | Hola printo, quiero un cuadro en relieve con una foto. |
| Tres caminos, "Contar mi idea" | Hola printo, busco imprimir algo y necesito ayuda para encontrar el modelo. |
| Tres caminos, "Mandar mi archivo" | Hola printo, tengo un archivo para imprimir. |
| Trabajos, "Quiero el mío" | Hola printo, quiero un cuadro en relieve con una foto. |
| Cómo funciona, "Sí, escribamos" | Hola printo, quiero pedir un presupuesto. |
| Precio y plazos, "Pedir el precio" | Hola printo, quiero saber cuánto sale imprimir algo. |
| Visor 3D, own file | Hola printo, quiero saber cuánto sale imprimir {nombre del archivo}. Te mando el archivo por acá. |
| Visor 3D, example | Hola printo, quiero saber cuánto sale imprimir {el Santa borracho / la Miniatura / el Jarrón / el Cuadro en relieve} del visor. |
| Visor 3D, file over 50 MB | Hola printo, tengo un archivo de más de 50 MB para imprimir. |
| Preguntas, "Preguntanos por WhatsApp" | Hola printo, tengo una pregunta. |
| Contacto and Pie, WhatsApp | Hola printo, quiero hacer un pedido. |

## Opening hours (one setting)

Monday to Friday 10:00 to 18:00, Saturday 12:00 to 16:00, Sunday closed, Montevideo time (UTC-3). Holidays are ignored. Store them once, for example `{ week: [600, 1080], sat: [720, 960] }` in minutes, and derive from it:

- The hero headline (open or closed version).
- The Preguntas answer "¿Cuándo me responden?".
- The Contacto "Horario" text and the open-now pill.

## Sections, in order

Anchors used by the menu: `#inicio`, `#que-imprimimos`, `#trabajos`, `#precios`, `#contacto` (plus `#visor`, `#preguntas`). Each anchored section has `scroll-margin-top: 100px` so the sticky bar does not cover its title. A "Saltar al contenido" skip link is the first focusable element.

### 01 Navegación (sticky bar)

- Desktop: wordmark (112 px, links to `#inicio`), four links (Qué imprimimos, Trabajos, Precios, Contacto), and on the right the cobalto "Pedir presupuesto" button, which appears only after the hero button has scrolled away.
- The link of the section in view is marked as current (weight 600, a 4 px cobalto bar under it, `aria-current="location"`).
- Phone (up to 959 px): 64 px tall bar with the wordmark (96 px), a small "Presupuesto" pill (only after the hero button is gone) and a round menu button. The menu opens a panel with the four links as 56 px rows (current one in mantequilla), Instagram and hola@printo.uy, and a full-width "Pedir presupuesto" button. Focus moves to the first link when it opens and back to the menu button when it closes; Escape closes it.
- Desktop links and the desktop button must be hidden on the phone (watch out for inline `display` styles overriding the media query).

### 02 Hero (`#inicio`)

- Eyebrow tag: "Impresión 3D hecha en Uruguay".
- Headline (72 px desktop, 44 px phone, 40 px under 360 px), two versions picked by the opening hours:
  - Workshop open: "Capa por capa," / "tu idea toma forma." (second line cobalto)
  - Workshop closed: "Tu idea," / "en tus manos." (second line cobalto)
- Line: "Mandanos una foto, un modelo que encontraste o tu archivo, y nosotros lo imprimimos."
- Cobalto button "Pedir presupuesto" with a small spool shape at its left (full width on the phone).
- Three claim tiles: mantequilla "24 a 48 h / en la mayoría de los pedidos", menta "Hasta 25 cm / de alto, ancho y largo", tomate "Hasta 4 colores / en una misma pieza".
- Art: cobalto square with a spool (tomate, mantequilla, menta, crema rings, cobalto center), tomate extrusion. Decorative, hidden from screen readers.

### 03 Tres caminos (`#que-imprimimos`)

- Eyebrow "Qué imprimimos". Headline "Una foto, una idea o un archivo." / "Elegí por dónde empezar." Line "Cada camino te lleva a WhatsApp con el mensaje listo."
- Three cards (photo on top, 4:3; phone 16:9, stacked). Under 1100 px desktop the cards go photo-left.
  1. Mantequilla photo, "Tengo una imagen": "Mandanos una foto y la convertimos en un cuadro en relieve en blanco y negro, con su soporte." Note box: "Revisamos cada foto y te decimos si se puede imprimir." Button "Mandar mi foto".
  2. Menta photo, "Tengo una idea": "Contanos qué buscás y te ayudamos a encontrar el modelo en MakerWorld, Printables o Thingiverse. ¿Ya encontraste uno? Mandanos el link." Button "Contar mi idea".
  3. Tomate photo, "Tengo un archivo": "Mandanos tu STL o 3MF y lo imprimimos en PLA o PETG." Link "Ver tu modelo en 3D" (tinta, underlined, to `#visor`). Button "Mandar mi archivo".
- Photos are placeholders until the owner provides them.

### 04 Trabajos (`#trabajos`)

- Eyebrow "Trabajos". Headline "Cada cuadro," / "una historia." Line "Cuadros en relieve que ya salieron del taller." Link "Ver más en Instagram" (https://www.instagram.com/printo.uy).
- Gallery of 5 pieces: one featured (big card, square photo, category tag in mantequilla, title, line, two-line story) and four small (square photo, category tag, title).
- The featured piece is picked at random on each visit; the other four fill the grid. Desktop: featured spans 2 columns and 2 rows of a 4-column grid; 960 to 1199 px: featured full width with photo left; phone: 2 columns, featured full width.
- Pieces (placeholders until real ones):
  - Colección · "Tu panel de manga favorito" · "El momento que cambió toda la historia, ahora en relieve."
  - Momentos · "Juntos para siempre" · "Su historia, en una pieza para la repisa."
  - Ilustración · "Tu escena favorita" · "Ese cuadro inolvidable, ahora con volumen."
  - Mascotas · "Tu compañero peludo" · "Con toda su personalidad, en blanco y negro."
  - [Categoría] · [Título] · [Una línea]
- Closing strip (mantequilla): "¿Querés el tuyo? Mandanos la foto." with button "Quiero el mío".

### 05 Cómo funciona (`#como-funciona`)

- Eyebrow "Cómo funciona". Headline "Más simple," / "imposible."
- Three numbered steps (cobalto number circles, an ordered list) and, outside the list, a menta card:
  1. "Mandanos lo que tenés": "Una foto, el link de un modelo o tu archivo STL o 3MF, por WhatsApp."
  2. "Te pasamos el precio": "En minutos, en horario de atención. Material, color y plazo, todo claro antes de empezar."
  3. "Lo imprimimos": "En 24 a 48 horas en la mayoría de los pedidos. Lo retirás en Montevideo o Las Piedras, coordinando antes."
  - Menta card: "¿Lo imprimimos?" (a big paragraph, not a heading) and button "Sí, escribamos".
- Desktop: 4 equal columns. 960 to 1199 px: steps in a row, card below. Phone: steps as rows (circle and text, no card), then the menta card.

### 06 Materiales y colores (`#materiales`)

- Eyebrow "Materiales y colores". Headline "Cada pieza," / "con el material justo." Line "Contanos para qué es la pieza y elegimos el material que mejor le va."
- Two cards, each with a menta "Disponible" tag:
  - PLA · "El todoterreno." · "Fácil de imprimir y con muy buena terminación. Ideal para figuras, decoración y regalos." Tags: Buena terminación, Rígido, Bajo olor.
  - PETG · "El resistente." · "Aguanta golpes, algo de flexión y más calor que el PLA. Para piezas que se usan todos los días." Tags: Resiste golpes, Algo flexible, Aguanta más calor.
- Color swatches (round, 2 px tinta border) from ONE stock list. Sold-out colors: faded fill, a diagonal line and an "Agotado" tag (14 px). Hex codes are Bambu Lab's official ones:
  - PLA: Negro #000000, Blanco #FFFFFF, Rojo #C12E1F, Cyan #0086D6, Gris #8E9089, Amarillo #F4EE2A, Beige #F7E6DE, Plateado #A6A9AA, Azul hielo translúcido rgba(184,205,233,.6), Azul #0A2989 (agotado), Verde #00AE42 (agotado), Violeta #5E43B7 (agotado).
  - PETG: Azul #002E96, Gris translúcido rgba(142,142,142,.55), Negro #000000 (agotado).
- "Los agotados vuelven a entrar. Preguntanos por WhatsApp."
- Multicolor box: four overlapping dots (cobalto, tomate, mantequilla, menta), "Hasta 4 colores en una misma pieza." and "Sin pintar: los colores salen así de la impresora."
- Detail box: "¿Cuánto detalle necesitás?" with three levels (small layer-lines square for each): "Muy detallado" (Miniaturas, figuras chicas y textos pequeños. Lleva más tiempo.), "Normal" (La mayoría de las piezas: buen detalle, buen tiempo.), "Grande y rápido" (Piezas grandes y robustas, en menos tiempo. Menos detalle fino.). Under it: "Te recomendamos uno cuando nos mandás lo que tenés."
- Note: "Los cuadros en relieve son en blanco y negro, y vienen con su soporte."
- No nozzle sizes or other technical terms anywhere on the page.

### 07 Precio y plazos (`#precios`)

- Eyebrow "Precio y plazos". Headline "Cada pieza," / "su precio." No prices and no minimum price.
- Desktop grid: three columns (1.35fr, 1fr, 0.75fr), equal heights.
  - "Piezas" card. "Lo que mueve el precio:" then five chips (crema, 20 px radius) in two columns: Tamaño (Cuanto más grande, más material lleva.), Material (PLA y PETG tienen distinto costo.), Detalle (Acabado fino o normal, vos elegís.), Colores (Una pieza multicolor suma al precio.), Cantidad (Varias piezas iguales.).
  - "Cuadros en relieve" card. "En blanco y negro. Lo que mueve el precio:" then Tamaño (El que vos quieras: el precio va con la medida.), Copias (La primera incluye preparar la foto; las copias, solo la impresión.), Soporte (Siempre incluido, sin costo extra.).
  - Two stacked boxes, together as tall as the cards, text vertically centered: "Plazo" / "24 a 48 h" / "En la mayoría de los pedidos. Piezas grandes, multicolor o en cantidad: te decimos el plazo junto con el precio." and "Entrega" / "Retiro o envío" / "Retirás en Montevideo o Las Piedras, o te lo enviamos a tu casa. El día, la hora y el envío los coordinamos por WhatsApp."
- 960 to 1199 px: the two cards side by side, Plazo and Entrega in a row below. Phone: one column; Plazo and Entrega merged into one compact box with two rows; texts 14 px.
- Closing strip (tomate): "¿Tenés algo en mente? Preguntanos." with tinta button "Pedir el precio".
- Headings: Piezas, Cuadros en relieve, Plazo and Entrega are h3.

### 08 Visor 3D (`#visor`)

Not in the menu; reached from "Ver tu modelo en 3D".

- Eyebrow "Visor 3D". Headline "Antes de imprimirla," / "dale una vuelta." Line "Abrí tu STL o 3MF acá y giralo para verlo por todos lados. No se sube a ningún lado hasta que nos lo mandes."
- Examples: "¿No tenés un archivo a mano? Probá con uno de estos:" and four cards with a square thumbnail and a name: Santa borracho, Miniatura, Jarrón, Cuadro en relieve. The selected one turns mantequilla (`aria-pressed`). Phone: a sideways-scrolling row.
- Viewer frame: white, 2 px border, 24 px radius, tomate extrusion, 4:3.3 on desktop, square on the phone, 16:9 from 960 to 1199 px.
- States:
  - Empty: dashed inner area, "Arrastrá tu archivo acá" (hidden on the phone), button "Elegir archivo" (the real file input), "STL o 3MF, hasta 50 MB".
  - Loading: progress bar (cobalto fill) and "Abriendo {nombre}… 55%".
  - Loaded: the model in cobalto, turnable by mouse drag, finger (sideways swipe only, vertical swipe scrolls the page: `touch-action: pan-y`) and arrow keys. File name pill top left, hint pill at the bottom ("Arrastrá para girarlo" / phone "Deslizá para girarlo", fades after the first turn). Under the frame: "Pedir el precio" (tinta, WhatsApp) and "Probar otro"; for an own file also "Se abre WhatsApp: adjuntá el archivo en el chat."
  - Errors: "Este archivo no lo podemos abrir. Probá con un STL o 3MF." / "Pesa más de 50 MB. Mandánoslo por WhatsApp y lo vemos." (button "Mandar por WhatsApp") / "No pudimos abrirlo. Puede estar dañado: probá exportarlo de nuevo." Each with "Probar otro".
- The viewer does not measure the piece and shows no size warnings.
- The file never leaves the browser. If the viewer ever uploads files, change the line about it the same day.
- Load the 3D library only when the visitor gets near this section.
- Frame: `tabindex="0"`, name "Vista 3D de {nombre}. Usá las flechas para girarla." State changes announced in a polite live region.
- 960 to 1199 px: text and examples on top, viewer below.

### 09 Preguntas (`#preguntas`)

- Eyebrow "Preguntas". Headline "Antes de escribirnos," / "capaz ya está acá." Under it: "¿Otra pregunta? Preguntanos por WhatsApp" (link). On the phone the link goes after the questions.
- Desktop: title column on the left stays in place while the questions scroll (sticky, top 100 px). 960 to 1199 px and phone: title on top, not sticky.
- Eight questions, each a real button inside an h3, `aria-expanded`, opening its answer below. Several can be open at once; the first starts open. Open row: mantequilla, circle turns tinta with a minus (drawn bars). Closed answers stay in the HTML (hidden), and the page includes FAQPage structured data (JSON-LD) with all eight.
  1. ¿Qué archivo te mando? · STL o 3MF. Si no tenés uno, mandanos una foto o el link de un modelo de MakerWorld, Printables o Thingiverse y te ayudamos a encontrarlo.
  2. ¿Hacen el diseño o el modelo 3D? · No modelamos desde cero. Te ayudamos a encontrar un modelo que ya exista, o imprimimos el tuyo.
  3. ¿Qué tan grande puede ser? · Hasta 25 cm de alto, ancho y largo.
  4. ¿Cuántos colores puede tener? · Hasta 4 colores en una misma pieza. Los cuadros en relieve son en blanco y negro.
  5. ¿Cuánto demora? · 24 a 48 h en la mayoría de los pedidos. Si es grande, multicolor o en cantidad, te decimos el plazo junto con el precio.
  6. ¿Cómo lo recibo? · Lo retirás en Montevideo o Las Piedras, o coordinamos el envío por WhatsApp.
  7. ¿Cómo pago? · En efectivo o por transferencia bancaria.
  8. ¿Cuándo me responden? · En minutos, en horario de atención: lunes a viernes de 10 a 18 y sábados de 12 a 16. (from the hours setting)

### 10 Contacto (`#contacto`)

- Full-width cobalto section, crema text, 2 px tinta top border.
- Eyebrow "Contacto". Headline (72 px desktop, 40 px phone, crema): "Tu próxima pieza" / "empieza con un hola." (second line mantequilla).
- Right of the headline: WhatsApp button (mantequilla, tinta border, 64 px tall): "WhatsApp" + "096 341 462" in tinta-suave, name "Escribinos por WhatsApp al 096 341 462". Under it the open-now pill (crema): open "Taller abierto ahora" with a menta dot; closed "Cerrado ahora · te respondemos apenas abramos" with a tomate dot (dot hidden from screen readers).
- Four details as a description list (`dl`), each under a 2 px crema line, no boxes: Instagram @printo.uy (link), Email hola@printo.uy (mailto), Horario "Lunes a viernes 10 a 18" / "Sábados 12 a 16" (from the hours setting), Dónde "Montevideo y Las Piedras".
- Phone: button full width, pill under it, the four details as rows (label left, value right). Hours shown short ("L a V 10 a 18 · S 12 a 16") but read in full by screen readers.

### 11 Pie (footer)

- Crema background. Top row: the wordmark at 68% of the width (60% on the phone), linking to `#inicio` ("printo, volver al inicio"), and to its right, bottom-aligned, "Impresión 3D hecha en Uruguay." (Bricolage 700, 32 px; 15 px on the phone; 13 px under 360 px). The phrase always stays to the right of the logo.
- A 2 px tinta line, then the menu links (left, in a `nav` named "Pie") and the channels (right): WhatsApp, Instagram, hola@printo.uy. Each link has a 44 px tall tap area. Phone: both rows centered.
- Legal line, 14 px tinta-suave: "© {año actual} printo · Montevideo y Las Piedras, Uruguay". The year comes from the current date.
- Use the wordmark as SVG.

## Accessibility checklist

- One h1 (hero). Each section: h2 headline; cards and groups h3.
- All decorative shapes `aria-hidden="true"`.
- Every button with a name that starts with its visible text.
- Text contrast: tinta on crema 15.5:1, tinta-suave 7.9:1, crema on cobalto 6.0:1, tinta on tomate 5.5:1, tinta on mantequilla 12.2:1. Never tomate, mantequilla or menta as text.
- Tap targets 44 px minimum.
- Respect `prefers-reduced-motion`.

## Still open (use placeholders until the owner provides them)

- Real photos for Tres caminos and Trabajos, and the five Trabajos stories.
- Example models for the 3D viewer: the files, a check that each license allows showing them on a business site, real thumbnails, and the owner's 3D photo for "Cuadro en relieve".
- The exact PETG Blue color (Bambu PETG Basic Blue is not in their table; the closest official blue is used).

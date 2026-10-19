# PRINTO - guia de marca (direccion B, "Filamento")

Servicio de impresion 3D en Uruguay (printo.uy). Cercano, colorido, hecho a mano e impreso en maquina.
Slogan: "Impresion 3D hecha en Uruguay."

## Voz
- Espanol rioplatense con voseo: "Mandanos tu archivo y la imprimimos. Asi de simple."
- Frases cortas, sin jerga corporativa. Titulares calidos y concretos: "Tu idea, en tus manos." (una frase en `--cobalto` para enfatizar).
- Botones nombran la accion: "Pedir presupuesto".
- Sin emojis, en ningun lado.

## Logo (`static/brand/logo/`)
- El nombre es `printo`, siempre en minusculas. La p es la primera letra de la palabra, no un simbolo aparte.
- Solo la p tiene volumen: una extrusion tomate detras, como una pieza recien impresa. El punto de la i tambien es tomate.
- Wordmark cobalto sobre crema, blanco, mantequilla y menta. Wordmark crema sobre cobalto y tinta. Nunca sobre tomate.
- La p sola (`printo-p-*`, `printo-icon-*`) solo para iconos de app, avatares y favicon.
- Espacio libre: el ancho del palo de la p. Ancho minimo del wordmark: 96px.
- No recolorear la extrusion, no agregar sombras, no delinear, no rotar.

## Color (variables en `static/brand/brand.css`)
- Base: `--crema`. Marca: `--cobalto`. Apoyo: `--tomate`, `--mantequilla`, `--menta`.
- Texto: `--tinta` sobre claros; `--crema` sobre `--cobalto` y `--tinta`. Secundario: `--tinta-suave`.
- Tomate, mantequilla y menta nunca como color de texto ni con texto claro encima.
- Superficies `--blanco` sobre crema, con borde `--tinta` de 2px.
- Maximo tres colores de apoyo por vista.

## Tipografia
- Titulos y marca: Bricolage Grotesque 700-800, tracking apretado, minusculas o frase normal (nunca todo en mayusculas).
- Texto: Figtree 400-600. Etiquetas de seccion: mayusculas, 13px, letter-spacing .1em, `--tinta-suave`.

## Forma y layout
- Todo redondeado: tarjetas `--radius-lg`/`--radius-xl`, botones y etiquetas `--radius-pill`.
- Campos de color solidos, sin degradados. Profundidad: la extrusion tomate (`--extrude`), una vez por vista.
- Margen lateral 64px en escritorio, minimo 16px en celular. Objetivos tactiles de 44px o mas.

## Carrete (motivo)
Cinco discos concentricos (tomate, mantequilla, menta, crema, cobalto, de afuera hacia adentro; radios 146/116/86/56/26 en un viewBox de 300). Ilustracion del hero, sobre cobalto o blanco. Decorativo (`aria-hidden`).

## Referencia
Design system completo: https://claude.ai/artifact/Nu2QjM9hQhGzxfWekKT55Q

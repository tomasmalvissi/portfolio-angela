# Portfolio — Angela Ellena

Sitio estático (HTML, CSS y JS sin frameworks) para **angelaellena.com**.

## Estructura

```
index.html          → índice del portfolio, agrupado por disciplina (ES/EN)
about/              → Sobre mí: perfil y CV en versión web (ES/EN)
  index.html
  angela-ellena-cv-2026.pdf → CV descargable
sweet-chaos/        → Proyecto 01: Sweet Chaos, producción de moda (one-page, ES/EN)
  index.html
  styles.css
  main.js           → textos ES/EN, menú, grilla de fotos, lightbox, videos
  assets/img/grid/  → fotos livianas para la grilla (800 px)
  assets/img/full/  → fotos para ampliar (1600 px)
  assets/video/     → clips mp4 + portada de cada uno
marie-claires/      → Proyecto 02: Marie Claire's, creación de marca (one-page, ES/EN)
  index.html        → el texto en español va en el HTML y el inglés en el atributo data-en
  styles.css
  main.js           → idioma, menú, apariciones, carril horizontal de redes, slider de verano, lightbox, videos
  assets/img/grid/  → fotos para la página (900 px)
  assets/img/full/  → fotos para ampliar (1600 px)
  assets/video/     → clips mp4 + portada de cada uno
```

Cada proyecto nuevo va en su propia carpeta y se suma como una fila en el grupo que corresponda de `index.html` (Dirección creativa & estilismo, Marca & e-commerce, Diseño & investigación). Los proyectos sin página propia van como filas de solo texto (`.row.static`).
El idioma elegido se recuerda entre páginas (`ae-lang` en localStorage).

## Ver en local

```bash
python3 -m http.server 4173
```

y abrir http://localhost:4173

## Publicar

No necesita build: se sube la carpeta tal cual (Netlify, Vercel, Cloudflare Pages, etc.).

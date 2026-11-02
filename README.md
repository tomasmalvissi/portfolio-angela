# Portfolio — Angela Ellena

Sitio estático (HTML, CSS y JS sin frameworks) para **angelaellena.com**.

## Estructura

```
index.html          → por ahora redirige a sweet-chaos/
sweet-chaos/        → Producción 01: Sweet Chaos (one-page, ES/EN)
  index.html
  styles.css
  main.js           → textos ES/EN, menú, grilla de fotos, lightbox, videos
  assets/img/grid/  → fotos livianas para la grilla (800 px)
  assets/img/full/  → fotos para ampliar (1600 px)
  assets/video/     → clips mp4 + portada de cada uno
```

Cada producción o proyecto nuevo va en su propia carpeta (`/prod-02`, `/disenos`, …).
Cuando haya más de uno, `index.html` de la raíz pasa a ser el índice del portfolio.

## Ver en local

```bash
python3 -m http.server 4173
```

y abrir http://localhost:4173

## Publicar

No necesita build: se sube la carpeta tal cual (Netlify, Vercel, Cloudflare Pages, etc.).

# CLAUDE.md — Portfolio de Angela Ellena

Sitio estático (HTML, CSS y JS sin frameworks ni build). Ver `README.md` para la estructura de carpetas.
Estas son reglas fijas del sitio: no cambiarlas salvo que Angela o Tomás lo pidan explícitamente.

## Piezas compartidas: `assets/site.css`

Todo lo que se repite en todas las páginas vive en `assets/site.css`, y su comportamiento en `assets/site.js`. **No se copia ni se redefine dentro de una página**: si hay que cambiarlo, se cambia ahí y cambia en todo el sitio.

Cada página la carga después de sus propios estilos:

```html
<link rel="stylesheet" href="assets/site.css">      <!-- index.html -->
<link rel="stylesheet" href="../assets/site.css">   <!-- páginas en subcarpeta -->
```

Necesita Archivo con eje de ancho, cargada desde Google Fonts:
`family=Archivo:wdth,wght@62..125,100..900`.

### 1. "ANGELA ELLENA" como título → clase `.ae-name`

Siempre en Archivo 800, `font-stretch: 105%`, MAYÚSCULAS y `letter-spacing: -0.045em`.
Nunca en Bodoni, cursiva ni caligráfica, ni mezclando palabras en itálica ("Angela *Ellena*" está prohibido).
Cada lugar pone solo su tamaño: la portada del índice, la sección "( Diseñadora )" de cada proyecto y el pie.
Esta regla vale para el nombre como título. Las etiquetas chicas de la barra de arriba ("Angela Ellena" en 0.78rem) siguen siendo texto de etiqueta.

### 2. Pie negro → `.ae-pie`

Todas las páginas terminan con este pie, sin excepción. Markup exacto:

```html
<footer class="ae-pie">
  <div class="ae-pie-row wrap">
    <a href="…">← Portfolio</a>           <!-- izquierda: volver -->
    <a href="…">Siguiente proyecto ( 0N )</a> <!-- centro: opcional -->
    <a href="#top">Volver arriba ↑</a>    <!-- derecha -->
  </div>
  <p class="ae-pie-mark ae-name" aria-hidden="true">Angela Ellena</p>
  <div class="ae-pie-row ae-pie-row--small wrap">
    <span>© 2026 Angela Ellena</span>
    <span>Nombre de esta página</span>
  </div>
</footer>
```

- En el índice el link de la izquierda es "Sobre mí", y el texto chico de la derecha es "Portfolio".
- El "© 2026" va solo en el pie, nunca repetido en la fila de contacto.

### 3. Contacto con ¿HABLAMOS? → `.ae-contact` + `assets/site.js`

Va en todas las páginas, justo antes del pie, **completo y con los datos a la vista**:
- la etiqueta "( Contacto )";
- "¿HABLAMOS?" (en inglés "Let’s talk"), con enlace a `mailto:angeellena610@gmail.com`;
- tres filas: Email y Teléfono con botón "Copiar", e Instagram con ↗.

Nunca se recorta a una línea suelta. Markup exacto (en Sweet Chaos los textos usan `data-i18n` en vez de `data-en`):

```html
<section class="ae-contact wrap" id="contacto">
  <p class="ae-contact-label">( <span data-en="Contact">Contacto</span> )</p>
  <a class="ae-hablamos" href="mailto:angeellena610@gmail.com" data-en="Let’s talk">¿Hablamos?</a>
  <div class="ae-contact-rows">
    <div class="ae-contact-row">
      <span class="ae-contact-k">Email</span>
      <span class="ae-contact-v" id="email">angeellena610@gmail.com</span>
      <button type="button" class="ae-copy" data-copy="email" data-en="Copy">Copiar</button>
    </div>
    <div class="ae-contact-row">
      <span class="ae-contact-k" data-en="Phone">Teléfono</span>
      <a class="ae-contact-v" id="phone" href="tel:+5493576650098">3576 65-0098</a>
      <button type="button" class="ae-copy" data-copy="phone" data-en="Copy">Copiar</button>
    </div>
    <div class="ae-contact-row">
      <span class="ae-contact-k">Instagram</span>
      <a class="ae-contact-v" href="https://instagram.com/angela__estudio" target="_blank" rel="noopener">@angela__estudio</a>
      <span aria-hidden="true">↗</span>
    </div>
  </div>
</section>
```

- Los botones "Copiar" funcionan con `assets/site.js`, que cada página carga al final:
  `<script src="assets/site.js" defer></script>` en la raíz, o `../assets/site.js` en una subcarpeta.
- El botón dice "Copiado" / "Copied" según el idioma de la página.
- No se agrega tipografía, color, hover ni lógica de copiado propios en la página.

## Paleta y tipografías del sitio (índice y Sobre mí)

| Uso | Valor |
|---|---|
| Fondo | `#EEEAE3` (hueso) — nunca negro, salvo el pie |
| Texto | `#161312` |
| Texto secundario | `#6E675F` |
| Líneas | `#D2CBC1` |
| Hover | `#FB0292`, Pantone 17-2435 TN Pink Glo. Es el **único** color de hover; no usar bordo. |
| Títulos y nombre | Archivo 800 en mayúsculas (ver `.ae-name`) |
| Cursiva de acento | Itálica de **Bodoni Moda**, para subtítulos, notas y las palabras finales de frases y títulos. No usar Fraunces, Great Vibes ni otras caligráficas para esto. |
| Texto corrido y etiquetas | Archivo |

Los proyectos conservan su identidad propia en el resto de la página:
- Sweet Chaos: Bodoni + condensada con estrella.
- Marie Claire's: firma en Pinyon Script, Cormorant y su bordo de marca `#7A1C22`.

Solo las tres piezas compartidas son iguales en todas las páginas.

## Portada del índice

- Las fotos van en un cuadro de borde a borde, sin márgenes a los costados, y pasan solas cada 3 s.
- Se muestran **en blanco y negro** con `filter: grayscale(1)`; los archivos quedan en color.
- Las fotos de la portada están en `assets/home/` (hNN.jpg, máximo 1600 px de ancho, JPEG calidad ~70).
- Solo se carga la primera de entrada; el resto usa `data-src` y se baja mientras se ve la actual.
- "ANGELA ELLENA" va superpuesto sobre las fotos, **en un solo renglón**, también en celular.
- Debajo van tres notas en la cursiva de acento: Diseño · Moda · Marca / Licenciada en Diseño e Innovación / Proyectos ↓.

## Idioma

- El sitio abre **siempre en español**.
- El español va en el HTML y el inglés en `data-en`. En Sweet Chaos, el inglés va en el diccionario de `main.js` con `data-i18n`.
- Si se elige inglés, se recuerda solo durante la visita: `sessionStorage`, clave `ae-lang`.
- No detectar el idioma del navegador ni usar `localStorage` para el idioma.
- Todo texto nuevo lleva su versión en inglés.

## Fotos

- Nunca mostrar fotos que aparezcan al pasar el mouse sobre proyectos o filas.
- Las fotos van en `assets/img/grid/` (livianas) y `assets/img/full/` (para ampliar) de cada proyecto.
- Se optimizan con `sips`: ancho máximo 1600 px, JPEG.

## Cómo verificar un cambio

```bash
python3 -m http.server 4173
```

Revisar en 1440×900 (notebook) y 375×812 (celular).
En celular, `document.documentElement.scrollWidth` tiene que ser igual a `innerWidth`: nada se sale de la pantalla.

## Git y publicación

- Trabajar en una rama, mergear a `main` y hacer push.
- **Vercel publica solo** cada push a `main` en angelaellena.vercel.app. No hay build ni otro paso.
- Los mensajes de commit van en español.

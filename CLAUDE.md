# CLAUDE.md — Portfolio de Angela Ellena

Sitio estático (HTML, CSS y JS sin frameworks ni build). Ver `README.md` para la estructura de carpetas.
Estas son reglas fijas del sitio: no cambiarlas salvo que Angela o Tomás lo pidan explícitamente.

## Piezas compartidas: `assets/site.css`

Todo lo que se repite en todas las páginas vive en `assets/site.css`. **No se copia ni se redefine dentro de una página**: si hay que cambiarlo, se cambia ahí y cambia en todo el sitio.

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

### 3. ¿HABLAMOS? → `.ae-hablamos`

Va en todas las páginas, justo antes del pie y seguido de los datos de contacto: mail, teléfono e Instagram.
Siempre con el texto "¿Hablamos?" (en inglés "Let’s talk") y enlazado a `mailto:angeellena610@gmail.com`.

```html
<a class="ae-hablamos" href="mailto:angeellena610@gmail.com" data-en="Let’s talk">¿Hablamos?</a>
```

En los proyectos se le suma la clase de layout de la página (`contact-big ae-hablamos`).
No se le agrega tipografía, color ni hover propio.

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

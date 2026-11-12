(() => {
  'use strict';

  /* ---------- Textos ES / EN ---------- */
  const T = {
    es: {
      'menu': 'Menú',
      'close': 'Cerrar',
      'nav.concept': 'Concepto',
      'nav.designer': 'Diseñadora',
      'nav.contact': 'Contacto',
      'hero.prod': 'Producción 01',
      'hero.kind': 'Producción de moda',
      'hero.line': 'Delicada, pero no frágil.',
      'marquee': ['Romanticismo', 'Rebeldía', 'Vinilos', 'Libros en el piso', 'Sin apuro', 'Curiosa', 'Elegancia natural'],
      'nav.photos': 'Fotos',
      'contact.phone': 'Teléfono',
      'concept.statement': 'Una mujer que vive entre el <em>romanticismo</em> y la <strong>rebeldía</strong>.',
      'concept.body': 'No busca ser perfecta, pero transmite una elegancia natural. Escucha vinilos, lee libros en el piso, nunca está apurada y es curiosa.',
      'lookbook.hint': '( Tocá una foto para ampliarla )',
      'side.a': 'Lado A',
      'side.b': 'Lado B',
      'side.a.kind': 'Color',
      'side.b.kind': 'Blanco y negro',
      'videos.hint': '( Tocá un video para pausarlo )',
      'videos.body': 'Registros en cámara digital del día de producción.',
      'cv.1': 'Licenciada en Diseño e Innovación',
      'cv.2': 'Técnica en Textiles, Moda e Indumentaria',
      'designer.note': 'Sweet Chaos es su primera producción de moda.',
      'contact.big': '¿Hablamos?',
      'contact.copy': 'Copiar',
      'contact.copied': 'Copiado',
      'foot.top': 'Volver arriba ↑',
      'cursor': 'ver'
    },
    en: {
      'menu': 'Menu',
      'close': 'Close',
      'nav.concept': 'Concept',
      'nav.designer': 'Designer',
      'nav.contact': 'Contact',
      'hero.prod': 'Production 01',
      'hero.kind': 'Fashion production',
      'hero.line': 'Delicate, but not fragile.',
      'marquee': ['Romance', 'Rebellion', 'Vinyl', 'Books on the floor', 'Never in a hurry', 'Curious', 'Natural elegance'],
      'nav.photos': 'Photos',
      'contact.phone': 'Phone',
      'concept.statement': 'A woman who lives between <em>romance</em> and <strong>rebellion</strong>.',
      'concept.body': 'She isn’t trying to be perfect, yet she carries a natural elegance. She listens to vinyl, reads books on the floor, is never in a hurry, and stays curious.',
      'lookbook.hint': '( Tap a photo to enlarge it )',
      'side.a': 'Side A',
      'side.b': 'Side B',
      'side.a.kind': 'Color',
      'side.b.kind': 'Black & white',
      'videos.hint': '( Tap a video to pause it )',
      'videos.body': 'Digital camera footage from the shoot day.',
      'cv.1': 'B.A. in Design and Innovation',
      'cv.2': 'Technician in Textiles, Fashion and Apparel',
      'designer.note': 'Sweet Chaos is her first fashion production.',
      'contact.big': 'Let’s talk',
      'contact.copy': 'Copy',
      'contact.copied': 'Copied',
      'foot.top': 'Back to top ↑',
      'cursor': 'view'
    }
  };

  // Los botones ES / EN, sessionStorage y <html lang> los maneja ../assets/site.js,
  // que avisa cada cambio con 'ae:lang'. Acá se aplican los textos propios de Sweet Chaos.
  document.addEventListener('ae:lang', ({ detail: { lang } }) => {
    const t = (key) => T[lang][key] ?? key;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    const star = document.querySelector('.hero-star').outerHTML.replace(' hero-star', '');
    document.querySelectorAll('[data-marquee]').forEach((el) => {
      el.innerHTML = t('marquee').map((w) => `<span>${w}</span>${star}`).join('');
    });
  });

  /* ---------- Lookbook en columnas ---------- */
  // Cada foto va a la columna más corta, así el orden se lee por filas y no hacia abajo.
  const colsFor = (w) => (w >= 1200 ? 4 : w >= 760 ? 3 : 2);
  const grids = [...document.querySelectorAll('.masonry')].map((el) => ({ el, figs: [...el.children], n: 0 }));

  function layoutMasonry() {
    const n = colsFor(window.innerWidth);
    grids.forEach((g) => {
      if (g.n === n) return;
      g.n = n;
      const cols = Array.from({ length: n }, () => Object.assign(document.createElement('div'), { className: 'm-col' }));
      const heights = new Array(n).fill(0);
      g.figs.forEach((fig) => {
        const img = fig.querySelector('img');
        const i = heights.indexOf(Math.min(...heights));
        cols[i].appendChild(fig);
        heights[i] += img.height / img.width + 0.08;
      });
      g.el.replaceChildren(...cols);
      g.el.classList.add('is-js');
    });
  }
  layoutMasonry();
  window.addEventListener('resize', layoutMasonry);


  /* Idioma, menú, lightbox, videos, cursor y Copiar: ../assets/site.js */
})();

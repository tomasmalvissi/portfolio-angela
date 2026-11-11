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

  let lang = 'es';
  const t = (key) => T[lang][key] ?? key;

  function setLang(next) {
    lang = T[next] ? next : 'es';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    const star = document.querySelector('.hero-star').outerHTML.replace(' hero-star', '');
    document.querySelectorAll('[data-marquee]').forEach((el) => {
      el.innerHTML = t('marquee').map((w) => `<span>${w}</span>${star}`).join('');
    });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { sessionStorage.setItem('ae-lang', lang); } catch (e) { /* sin storage */ }
  }

  let saved = null;
  try { saved = sessionStorage.getItem('ae-lang'); } catch (e) { /* sin storage */ }
  const initial = saved || 'es';
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- Menú ---------- */
  const menu = document.getElementById('menu');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  function toggleMenu(open) {
    menu.hidden = !open;
    menuOpen.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    (open ? menuClose : menuOpen).focus();
  }
  menuOpen.addEventListener('click', () => toggleMenu(true));
  menuClose.addEventListener('click', () => toggleMenu(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) toggleMenu(false); });

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

  /* ---------- Lightbox ---------- */
  const looks = [...document.querySelectorAll('.look-btn')].sort((a, b) => a.dataset.index - b.dataset.index);
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  let current = 0;

  function show(i) {
    current = (i + looks.length) % looks.length;
    const img = looks[current].querySelector('img');
    lbImg.src = looks[current].dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = looks[current].closest('figure').querySelector('figcaption').textContent + '  ·  ' + (current + 1) + ' / ' + looks.length;
    // Precarga la siguiente para que pasar fotos sea inmediato.
    const next = looks[(current + 1) % looks.length].dataset.full;
    if (next) new Image().src = next;
  }
  looks.forEach((btn, i) => btn.addEventListener('click', () => { show(i); lb.showModal(); }));
  document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(current + 1));
  document.getElementById('lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

  /* ---------- Videos ---------- */
  // Se reproducen solo mientras están en pantalla; tocar uno lo pausa y deja de autoreproducirse.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clips = [...document.querySelectorAll('.clip video')];
  const stopped = new WeakSet();

  clips.forEach((v) => v.addEventListener('click', () => {
    if (v.paused) { stopped.delete(v); v.play().catch(() => {}); }
    else { stopped.add(v); v.pause(); }
  }));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !stopped.has(target)) target.play().catch(() => {});
      else target.pause();
    }), { threshold: 0.35 });
    clips.forEach((v) => io.observe(v));
  }

  /* ---------- Copiar email / teléfono ---------- */
  document.querySelectorAll('.copy[data-copy]').forEach((btn) => {
    const target = document.getElementById(btn.dataset.copy);
    const select = () => {
      const r = document.createRange();
      r.selectNodeContents(target);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    };
    btn.addEventListener('click', () => {
      const done = () => {
        btn.textContent = t('contact.copied');
        setTimeout(() => { btn.textContent = t('contact.copy'); }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(target.textContent.trim()).then(done, select);
      else select();
    });
  });

  /* ---------- Cursor "( ver )" ---------- */
  const cursor = document.getElementById('cursor');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = 0, y = 0, on = false;
    const place = () => {
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${on ? 1 : 0.6})`;
    };
    document.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; place(); });
    looks.forEach((btn) => {
      btn.addEventListener('pointerenter', () => { on = true; cursor.classList.add('on'); place(); });
      btn.addEventListener('pointerleave', () => { on = false; cursor.classList.remove('on'); place(); });
    });
  }

  setLang(initial);
})();

/* Comportamiento compartido por todas las páginas (ver CLAUDE.md).
   Se carga al final con <script src="assets/site.js" defer></script> (o ../assets/site.js en subcarpetas).
   Cada bloque se activa solo si la página tiene los elementos que usa.
   Lo propio de cada página (carrusel de la portada, mosaico, slider, etc.) queda en su página o en su main.js,
   que se carga antes que este archivo. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (id) => document.getElementById(id);

  /* ---------- Idioma ES / EN ----------
     El español está en el HTML y el inglés en data-en (también sirve en <title>).
     Siempre abre en español; si se elige inglés se recuerda solo durante la visita (sessionStorage, 'ae-lang').
     Avisa el cambio con el evento 'ae:lang' para las páginas que traducen con su propio diccionario (Sweet Chaos). */
  const texts = [...document.querySelectorAll('[data-en]')].map((el) => ({ el, es: el.innerHTML, en: el.dataset.en }));
  const langBtns = document.querySelectorAll('.lang button[data-lang]');
  function setLang(next) {
    const lang = next === 'en' ? 'en' : 'es';
    root.lang = lang;
    texts.forEach((x) => { x.el.innerHTML = x[lang]; });
    langBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { sessionStorage.setItem('ae-lang', lang); } catch (e) { /* sin storage */ }
    document.dispatchEvent(new CustomEvent('ae:lang', { detail: { lang } }));
  }
  langBtns.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = null;
  try { saved = sessionStorage.getItem('ae-lang'); } catch (e) { /* sin storage */ }
  setLang(saved || 'es');

  /* ---------- Aparición al bajar (.rv) ---------- */
  const rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    rvs.forEach((el) => io.observe(el));
  } else {
    rvs.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Menú a pantalla completa (#menu, #menu-open, #menu-close) ---------- */
  const menu = $('menu'), menuOpen = $('menu-open'), menuClose = $('menu-close');
  if (menu && menuOpen && menuClose) {
    const toggleMenu = (open) => {
      menu.hidden = !open;
      menuOpen.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      (open ? menuClose : menuOpen).focus();
    };
    menuOpen.addEventListener('click', () => toggleMenu(true));
    menuClose.addEventListener('click', () => toggleMenu(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) toggleMenu(false); });
  }

  /* ---------- Lightbox de fotos (#lightbox + botones .look-btn) ----------
     data-full: foto grande; data-index: orden de lectura (si el layout las reordena);
     data-clone + data-ref: copias de un slider infinito, que abren la foto original. */
  const lb = $('lightbox');
  const looks = [...document.querySelectorAll('.look-btn:not([data-clone])')]
    .sort((a, b) => (a.dataset.index || 0) - (b.dataset.index || 0));
  if (lb && looks.length) {
    const lbImg = $('lb-img'), lbCap = $('lb-cap');
    let current = 0;
    const show = (i) => {
      current = (i + looks.length) % looks.length;
      const btn = looks[current];
      const img = btn.querySelector('img');
      lbImg.src = btn.dataset.full || img.src;
      lbImg.alt = img.alt;
      const cap = btn.closest('figure')?.querySelector('figcaption')?.textContent || '';
      lbCap.textContent = cap + '  ·  ' + (current + 1) + ' / ' + looks.length;
      // Precarga la siguiente para que pasar fotos sea inmediato.
      const next = looks[(current + 1) % looks.length].dataset.full;
      if (next) new Image().src = next;
    };
    document.querySelectorAll('.look-btn').forEach((btn) => btn.addEventListener('click', () => {
      const target = btn.dataset.clone ? looks.find((b) => b.dataset.ref === btn.dataset.ref) : btn;
      show(looks.indexOf(target));
      lb.showModal();
    }));
    $('lb-prev').addEventListener('click', () => show(current - 1));
    $('lb-next').addEventListener('click', () => show(current + 1));
    $('lb-close').addEventListener('click', () => lb.close());
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    // Deslizar con el dedo para pasar de foto.
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Videos (.clip video) ----------
     Se reproducen solo mientras están en pantalla; tocar uno lo pausa y deja de autoreproducirse. */
  const clips = [...document.querySelectorAll('.clip video')];
  const stopped = new WeakSet();
  clips.forEach((v) => v.addEventListener('click', () => {
    if (v.paused) { stopped.delete(v); v.play().catch(() => {}); }
    else { stopped.add(v); v.pause(); }
  }));
  if (clips.length && !reduceMotion && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !stopped.has(target)) target.play().catch(() => {});
      else target.pause();
    }), { threshold: 0.35 });
    clips.forEach((v) => vio.observe(v));
  }

  /* ---------- Cursor "ver" sobre las fotos (#cursor) ----------
     El tamaño en reposo lo pone cada página con --cursor-rest en .cursor. */
  const cursor = $('cursor');
  if (cursor && finePointer) {
    const rest = parseFloat(getComputedStyle(cursor).getPropertyValue('--cursor-rest')) || 0.5;
    let x = 0, y = 0, on = false;
    const place = () => { cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${on ? 1 : rest})`; };
    document.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; place(); });
    document.querySelectorAll('.look-btn').forEach((btn) => {
      btn.addEventListener('pointerenter', () => { on = true; cursor.classList.add('on'); place(); });
      btn.addEventListener('pointerleave', () => { on = false; cursor.classList.remove('on'); place(); });
    });
  }

  /* ---------- Botones "Copiar" del contacto (.ae-copy[data-copy="id-del-dato"]) ---------- */
  const COPY = { es: { copy: 'Copiar', copied: 'Copiado' }, en: { copy: 'Copy', copied: 'Copied' } };
  const L = () => (root.lang === 'en' ? 'en' : 'es');
  document.querySelectorAll('.ae-copy[data-copy]').forEach((btn) => {
    const target = $(btn.dataset.copy);
    if (!target) return;
    const select = () => {
      const r = document.createRange();
      r.selectNodeContents(target);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    };
    btn.addEventListener('click', () => {
      const done = () => {
        btn.textContent = COPY[L()].copied;
        setTimeout(() => { btn.textContent = COPY[L()].copy; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(target.textContent.trim()).then(done, select);
      else select();
    });
  });
})();

(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- ES / EN ----------
     El texto en español está en el HTML; la versión en inglés va en data-en. */
  const UI = {
    es: { copied: 'Copiado', copy: 'Copiar' },
    en: { copied: 'Copied', copy: 'Copy' }
  };
  // Se lee al primer cambio de idioma, cuando las copias del slider ya existen.
  let i18n = null;
  let lang = 'es';

  function setLang(next) {
    if (!i18n) i18n = [...document.querySelectorAll('[data-en]')].map((el) => ({ el, es: el.innerHTML, en: el.dataset.en }));
    lang = next === 'en' ? 'en' : 'es';
    document.documentElement.lang = lang;
    i18n.forEach((x) => { x.el.innerHTML = x[lang]; });
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { sessionStorage.setItem('ae-lang', lang); } catch (e) { /* sin storage */ }
  }
  document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- Barra: se vuelve sólida al bajar y se esconde mientras se baja ---------- */
  const bar = document.getElementById('bar');
  let lastY = window.scrollY;
  function onBar() {
    const y = window.scrollY;
    bar.classList.toggle('is-solid', y > window.innerHeight * 0.6);
    bar.classList.toggle('is-hidden', y > lastY && y > window.innerHeight);
    lastY = y;
  }

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

  /* ---------- Slider infinito (verano) ---------- */
  // Se duplica la tira para que el loop no tenga corte. Las copias no se leen ni se enfocan.
  document.querySelectorAll('[data-loop]').forEach((loop) => {
    const track = loop.querySelector('.loop-track');
    const originals = [...track.children];
    originals.forEach((fig, i) => {
      fig.querySelector('.look-btn').dataset.ref = 'loop-' + i;
      const c = fig.cloneNode(true);
      c.classList.add('in');
      c.setAttribute('aria-hidden', 'true');
      c.querySelector('.look-btn').tabIndex = -1;
      c.querySelector('.look-btn').dataset.clone = '1';
      track.appendChild(c);
    });
    if (!reduceMotion) {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      loop.style.setProperty('--loop-gap', gap / 2 + 'px');
      loop.style.setProperty('--loop-dur', originals.length * 5 + 's');
      loop.classList.add('is-running');
    }
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    rvs.forEach((el) => io.observe(el));
  } else {
    rvs.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Paralaje de la foto de portada ---------- */
  const para = document.querySelector('[data-parallax] img');

  /* ---------- Redes: scroll vertical → desplazamiento horizontal (desktop) ---------- */
  const hs = document.querySelector('[data-hscroll]');
  const hsTrack = hs.querySelector('.hs-track');
  let hsDist = 0;
  const HS_SPEED = 0.6; // menos scroll vertical por cada px horizontal
  const wantPin = () => window.innerWidth >= 900 && !reduceMotion;

  function measureHs() {
    if (!wantPin()) {
      hs.classList.remove('is-pinned');
      hs.style.height = '';
      hsTrack.style.transform = '';
      return;
    }
    hs.classList.add('is-pinned');
    hsDist = Math.max(0, hsTrack.scrollWidth - window.innerWidth);
    hs.style.height = window.innerHeight + hsDist * HS_SPEED + 'px';
    moveHs();
  }
  function moveHs() {
    if (!hs.classList.contains('is-pinned')) return;
    const top = hs.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / (hsDist * HS_SPEED || 1)));
    hsTrack.style.transform = `translate3d(${-p * hsDist}px,0,0)`;
  }
  // Las fotos del carril cargan antes de tiempo para que el ancho sea exacto.
  hsTrack.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; img.addEventListener('load', measureHs); });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onBar();
      moveHs();
      if (para && !reduceMotion) {
        const r = para.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) para.style.transform = `translate3d(0,${(r.top / window.innerHeight) * -12}%,0)`;
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measureHs(); onScroll(); });

  /* ---------- Lightbox ---------- */
  const looks = [...document.querySelectorAll('.look-btn:not([data-clone])')];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  let current = 0;

  function show(i) {
    current = (i + looks.length) % looks.length;
    const btn = looks[current];
    const img = btn.querySelector('img');
    lbImg.src = btn.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = btn.closest('figure').querySelector('figcaption').textContent + '  ·  ' + (current + 1) + ' / ' + looks.length;
    const next = looks[(current + 1) % looks.length].dataset.full;
    if (next) new Image().src = next;
  }
  document.querySelectorAll('.look-btn').forEach((btn) => btn.addEventListener('click', () => {
    const target = btn.dataset.clone ? looks.find((b) => b.dataset.ref === btn.dataset.ref) : btn;
    show(looks.indexOf(target));
    lb.showModal();
  }));
  document.getElementById('lb-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('lb-next').addEventListener('click', () => show(current + 1));
  document.getElementById('lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------- Videos ---------- */
  // Se reproducen mientras están en pantalla; tocar uno lo pausa y deja de autoreproducirse.
  const clips = [...document.querySelectorAll('.clip video')];
  const stopped = new WeakSet();
  clips.forEach((v) => v.addEventListener('click', () => {
    if (v.paused) { stopped.delete(v); v.play().catch(() => {}); }
    else { stopped.add(v); v.pause(); }
  }));
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !stopped.has(target)) target.play().catch(() => {});
      else target.pause();
    }), { threshold: 0.35 });
    clips.forEach((v) => vio.observe(v));
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
        btn.textContent = UI[lang].copied;
        setTimeout(() => { btn.textContent = UI[lang].copy; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(target.textContent.trim()).then(done, select);
      else select();
    });
  });

  /* ---------- Cursor "ver" ---------- */
  const cursor = document.getElementById('cursor');
  if (finePointer) {
    let x = 0, y = 0, on = false;
    const place = () => { cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${on ? 1 : 0.4})`; };
    document.addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; place(); });
    document.querySelectorAll('.look-btn').forEach((btn) => {
      btn.addEventListener('pointerenter', () => { on = true; cursor.classList.add('on'); place(); });
      btn.addEventListener('pointerleave', () => { on = false; cursor.classList.remove('on'); place(); });
    });
  }

  /* ---------- Inicio ---------- */
  let saved = null;
  try { saved = sessionStorage.getItem('ae-lang'); } catch (e) { /* sin storage */ }
  setLang(saved || 'es');
  measureHs();
  onScroll();
})();

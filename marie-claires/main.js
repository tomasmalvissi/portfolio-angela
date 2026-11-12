(() => {
  'use strict';
  // Idioma, aparición al bajar, menú, lightbox, videos, cursor y Copiar: ../assets/site.js

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Barra: se vuelve sólida al bajar y se esconde mientras se baja ---------- */
  const bar = document.getElementById('bar');
  let lastY = window.scrollY;
  function onBar() {
    const y = window.scrollY;
    bar.classList.toggle('is-solid', y > window.innerHeight * 0.6);
    bar.classList.toggle('is-hidden', y > lastY && y > window.innerHeight);
    lastY = y;
  }

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

  /* ---------- Inicio ---------- */
  measureHs();
  onScroll();
})();

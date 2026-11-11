/* Comportamiento compartido por todas las páginas (ver CLAUDE.md).
   Se carga con <script src="assets/site.js" defer></script> (o ../assets/site.js en subcarpetas). */
(() => {
  'use strict';

  /* Botones "Copiar" del bloque de contacto (.ae-copy[data-copy="id-del-dato"]) */
  const TXT = { es: { copy: 'Copiar', copied: 'Copiado' }, en: { copy: 'Copy', copied: 'Copied' } };
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'es');

  document.querySelectorAll('.ae-copy[data-copy]').forEach((btn) => {
    const target = document.getElementById(btn.dataset.copy);
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
        btn.textContent = TXT[lang()].copied;
        setTimeout(() => { btn.textContent = TXT[lang()].copy; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(target.textContent.trim()).then(done, select);
      else select();
    });
  });
})();

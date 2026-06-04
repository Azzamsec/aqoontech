/* ============================================================
   AQOON TECH — Internationalisation (i18n)
   Somali ↔ English live content switch
   ============================================================
   Usage: add data-so="..." data-en="..." to any element.
   setLang('so') or setLang('en') swaps all text instantly.
   Language persists in localStorage under 'aqoon-lang'.
   ============================================================ */

/* ── Apply language to every tagged element ── */
function applyLang(lang) {
  document.querySelectorAll('[data-so]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt !== null) {
      /* Preserve child elements (icons, badges) — only swap text nodes */
      if (el.children.length === 0) {
        el.textContent = txt;
      } else {
        /* Has children: find/replace the first direct text node */
        for (let node of el.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
            node.textContent = txt + ' ';
            break;
          }
        }
      }
    }
  });

  /* Update <html lang> attribute for accessibility */
  document.documentElement.setAttribute('lang', lang);

  /* Sync the toggle buttons */
  const so = document.getElementById('lang-so');
  const en = document.getElementById('lang-en');
  if (so) so.classList.toggle('active', lang === 'so');
  if (en) en.classList.toggle('active', lang === 'en');

  /* Sync the floating lang fab if present */
  const fab = document.getElementById('lang-fab-so');
  const fab2 = document.getElementById('lang-fab-en');
  if (fab)  fab.classList.toggle('active',  lang === 'so');
  if (fab2) fab2.classList.toggle('active', lang === 'en');

  localStorage.setItem('aqoon-lang', lang);
}

/* ── Public API (also used by onclick= handlers) ── */
function setLang(lang) {
  applyLang(lang);
}

function initLang() {
  const stored = localStorage.getItem('aqoon-lang') || 'so';
  applyLang(stored);
}

/* init on DOM ready */
document.addEventListener('DOMContentLoaded', initLang);

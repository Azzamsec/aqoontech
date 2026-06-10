/* ============================================================
   AQOON TECH — Internationalisation (i18n) v3
   Somali <-> English live content switch
   - data-so / data-en : element text/HTML
   - data-ph-so / data-ph-en : input/textarea placeholders
   Fires 'aqoon-lang-change' for dynamic renderers.
   ============================================================ */

function applyLang(lang){
  document.querySelectorAll('[data-so]').forEach(el=>{
    const val = el.getAttribute('data-'+lang);
    if(val===null) return;
    el.innerHTML = val;
  });
  /* placeholders */
  document.querySelectorAll('[data-ph-so]').forEach(el=>{
    const val = el.getAttribute('data-ph-'+lang);
    if(val!==null) el.setAttribute('placeholder', val);
  });
  document.documentElement.setAttribute('lang', lang);
  const so=document.getElementById('lang-so');
  const en=document.getElementById('lang-en');
  if(so) so.classList.toggle('active', lang==='so');
  if(en) en.classList.toggle('active', lang==='en');
  localStorage.setItem('aqoon-lang', lang);
  window.dispatchEvent(new CustomEvent('aqoon-lang-change',{detail:{lang:lang}}));
}
function setLang(lang){ applyLang(lang); }
function initLang(){ applyLang(localStorage.getItem('aqoon-lang') || 'so'); }
document.addEventListener('DOMContentLoaded', initLang);

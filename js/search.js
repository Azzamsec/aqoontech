/* ============================================================
   AQOON TECH — Search  (js/search.js)
   Live search dropdown with keyboard navigation
   ============================================================ */

const ARTICLES = [
  { cat:'AI & Future Tech',    title:'Maxay tahay Artificial Intelligence?',       icon:'🤖', href:'article-ai.html' },
  { cat:'Cybersecurity',       title:'Sida looga badbaado xatooyin internet-ka',    icon:'🔒', href:'article-ai.html' },
  { cat:'Mobile & Devices',    title:'Apps 10 ee ugu wanaagsan telefoonka',         icon:'📱', href:'article-ai.html' },
  { cat:'Internet & Networks', title:'Wi-Fi vs Mobile Data — Kee ka Wanaagsan?',   icon:'🌐', href:'article-ai.html' },
  { cat:'Digital Skills',      title:'Sida looga shaqeysto online — Freelancing',  icon:'💼', href:'article-ai.html' },
  { cat:'Tech Basics',         title:'Cloud Storage waa maxay? Google Drive',      icon:'☁️', href:'article-ai.html' },
  { cat:'AI & Future Tech',    title:'ChatGPT sida loo adeegsado 2026',            icon:'💬', href:'article-ai.html' },
  { cat:'Cybersecurity',       title:'Password xoogan sida loo sameeyo',           icon:'🔐', href:'article-ai.html' },
  { cat:'Tech Basics',         title:'VPN waa maxay oo maxay u baahan tahay?',     icon:'🛡️', href:'article-ai.html' },
  { cat:'AI & Future Tech',    title:'AI miyay qaadan doontaa shaqooyinkayaga?',   icon:'🤔', href:'article-ai.html' },
  { cat:'Mobile & Devices',    title:'iPhone vs Android — Kee ku haboon?',         icon:'📱', href:'article-ai.html' },
  { cat:'Internet & Networks', title:'Sida loo ogaado email khiyaamo ah',          icon:'✉️', href:'article-ai.html' },
  { cat:'Software & Apps',     title:'Microsoft Office vs Google Docs',            icon:'📄', href:'article-ai.html' },
  { cat:'Business Tech',       title:'Sida loo bilaabo ganacsiga online-ka',       icon:'📊', href:'article-ai.html' },
  { cat:'Digital Skills',      title:'Zoom iyo Google Meet — sida loo adeegsado', icon:'🎥', href:'article-ai.html' },
];

let _selectedIdx = -1;

function handleSearch(val) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;

  const q = val.trim().toLowerCase();
  if (q.length < 2) { dd.classList.remove('open'); _selectedIdx = -1; return; }

  const hits = ARTICLES.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.cat.toLowerCase().includes(q)
  ).slice(0, 6);

  if (!hits.length) { dd.classList.remove('open'); return; }

  dd.innerHTML = hits.map((r, i) => `
    <a href="${r.href}" class="search-result" data-idx="${i}">
      <div class="search-result-icon">${r.icon}</div>
      <div>
        <div class="search-result-cat">${r.cat}</div>
        <div class="search-result-title">${r.title}</div>
      </div>
    </a>`).join('');

  dd.classList.add('open');
  _selectedIdx = -1;
}

/* Arrow-key navigation inside dropdown */
document.addEventListener('keydown', (e) => {
  const dd = document.getElementById('search-dropdown');
  if (!dd || !dd.classList.contains('open')) return;
  const items = dd.querySelectorAll('.search-result');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _selectedIdx = Math.min(_selectedIdx + 1, items.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _selectedIdx = Math.max(_selectedIdx - 1, -1);
  } else if (e.key === 'Enter' && _selectedIdx >= 0) {
    e.preventDefault();
    items[_selectedIdx].click();
    return;
  }

  items.forEach((el, i) => el.classList.toggle('active', i === _selectedIdx));
  if (_selectedIdx >= 0) items[_selectedIdx].scrollIntoView({ block: 'nearest' });
});

const pages = ['home','articles','article-detail','categories','about','contact'];

function showPage(id) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.page === id) a.classList.add('active');
    });
    setTimeout(() => triggerReveal(), 100);
    closeMobileNav();
  }
}

function initTheme() {
  const stored = localStorage.getItem('aqoon-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateDarkToggleIcon(theme);
}

function toggleDark() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('aqoon-theme', next);
  updateDarkToggleIcon(next);
}

function updateDarkToggleIcon(theme) {
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

let mobileNavOpen = false;
function toggleMobileNav() {
  mobileNavOpen = !mobileNavOpen;
  document.getElementById('mobile-nav').classList.toggle('open', mobileNavOpen);
  document.getElementById('hamburger-btn').classList.toggle('open', mobileNavOpen);
}
function closeMobileNav() {
  mobileNavOpen = false;
  const mn = document.getElementById('mobile-nav');
  const hb = document.getElementById('hamburger-btn');
  if (mn) mn.classList.remove('open');
  if (hb) hb.classList.remove('open');
}

function setLang(lang) {
  document.getElementById('lang-so').classList.toggle('active', lang === 'so');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

function setFilter(btn) {
  btn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

const searchData = [
  { cat: 'AI & Future Tech', title: 'Maxay tahay Artificial Intelligence?', icon: '🤖' },
  { cat: 'Cybersecurity', title: 'Sida looga badbaado xatooyin internet-ka', icon: '🔒' },
  { cat: 'Mobile Apps', title: 'Apps 10 ee ugu wanaagsan telefoonka', icon: '📱' },
  { cat: 'Internet', title: 'Wi-Fi vs Mobile Data — Kee ka Wanaagsan?', icon: '🌐' },
  { cat: 'Digital Skills', title: 'Sida looga shaqeysto online', icon: '💼' },
  { cat: 'Tech Basics', title: 'Cloud Storage waa maxay?', icon: '☁️' },
  { cat: 'AI & Future Tech', title: 'ChatGPT sida loo adeegsado 2026', icon: '🤖' },
  { cat: 'Cybersecurity', title: 'Password xoogan sida loo sameeyo', icon: '🔐' },
];

function handleSearch(val) {
  const dropdown = document.getElementById('search-dropdown');
  if (!dropdown) return;
  if (val.trim().length < 2) { dropdown.classList.remove('open'); return; }
  const results = searchData.filter(item =>
    item.title.toLowerCase().includes(val.toLowerCase()) ||
    item.cat.toLowerCase().includes(val.toLowerCase())
  );
  if (!results.length) { dropdown.classList.remove('open'); return; }
  dropdown.innerHTML = results.slice(0,5).map(r => `
    <div class="search-result" onclick="showPage('articles');document.getElementById('search-dropdown').classList.remove('open');">
      <div class="search-result-icon">${r.icon}</div>
      <div><div class="search-result-cat">${r.cat}</div><div class="search-result-title">${r.title}</div></div>
    </div>`).join('');
  dropdown.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap'))
    document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('open'));
});

function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  bar.style.width = (Math.min(pct,1)*100) + '%';
}

function triggerReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1800; const start = performance.now();
    function upd(now) {
      const p = Math.min((now-start)/dur, 1);
      const e2 = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(e2*target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
  });
}

function handleNewsletter(formEl) {
  const input = formEl.querySelector('input[type="email"]');
  const btn = formEl.querySelector('button[type="submit"], button');
  if (!input.value || !input.value.includes('@')) {
    input.style.borderColor = '#e24b4a';
    setTimeout(() => input.style.borderColor = '', 2500);
    return;
  }
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#1d9e75';
  btn.disabled = true;
  input.value = '';
}

function handleContactForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Sent! We\'ll reply within 24h';
    btn.style.background = '#1d9e75';
    e.target.reset();
  }, 1200);
}

function loadMore(btn) {
  const orig = btn.textContent;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = '✓ All loaded'; btn.style.opacity='0.5'; }, 1000);
}

window.addEventListener('scroll', () => {
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', window.scrollY > 500);
  updateProgressBar();
}, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  triggerReveal();
  const stats = document.querySelector('.stats-banner');
  if (stats) {
    new IntersectionObserver(e => { if(e[0].isIntersecting) animateCounters(); }).observe(stats);
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileNav();
    if (e.key === '/' && !e.target.matches('input,textarea')) {
      e.preventDefault();
      const si = document.querySelector('.search-input');
      if (si) si.focus();
    }
  });
});

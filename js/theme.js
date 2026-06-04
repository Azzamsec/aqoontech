/* ============================================================
   AQOON TECH — Theme & UI Interactions  (js/theme.js)
   Dark/light mode, language toggle, mobile navigation,
   scroll progress bar, back-to-top, navbar shadow,
   counter animation, scroll reveal, keyboard shortcuts
   ============================================================ */

/* ──────────────────────────────────────
   THEME (dark / light)
────────────────────────────────────── */
function initTheme() {
  const stored    = localStorage.getItem('aqoon-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('aqoon-theme', next);
}

/* ──────────────────────────────────────
   LANGUAGE TOGGLE  →  handled by i18n.js
   (setLang / initLang live there)
────────────────────────────────────── */

/* ──────────────────────────────────────
   MOBILE NAV
────────────────────────────────────── */
let _mobileOpen = false;

function toggleMobileNav() {
  _mobileOpen = !_mobileOpen;
  document.getElementById('mobile-nav')?.classList.toggle('open', _mobileOpen);
  document.getElementById('hamburger')?.classList.toggle('open', _mobileOpen);
}

function closeMobileNav() {
  _mobileOpen = false;
  document.getElementById('mobile-nav')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

/* ──────────────────────────────────────
   PROGRESS BAR
────────────────────────────────────── */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  function update() {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    bar.style.width = (Math.min(window.scrollY / max, 1) * 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
}

/* ──────────────────────────────────────
   BACK TO TOP
────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ──────────────────────────────────────
   NAVBAR SCROLL SHADOW
────────────────────────────────────── */
function initNavShadow() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ──────────────────────────────────────
   ACTIVE NAV LINK
────────────────────────────────────── */
function initActiveNav() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-link').forEach(a => {
    a.classList.remove('active');
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === file || (file === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ──────────────────────────────────────
   SCROLL REVEAL
────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 72);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

/* ──────────────────────────────────────
   COUNTER ANIMATION
────────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    if (el.dataset.counted) return; // run once
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const t0     = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function initCounters() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) animateCounters();
  }, { threshold: 0.3 }).observe(strip);
}

/* ──────────────────────────────────────
   NEWSLETTER FORM
────────────────────────────────────── */
function handleNewsletter(formEl) {
  const input = formEl.querySelector('input[type="email"]');
  const btn   = formEl.querySelector('button');
  if (!input || !input.value.trim().includes('@')) {
    if (input) {
      input.style.borderColor = '#e24b4a';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 2600);
    }
    return;
  }
  if (btn) {
    btn.textContent   = '✓ Subscribed!';
    btn.style.background = '#1d9e75';
    btn.disabled      = true;
  }
  input.value = '';
  input.placeholder = 'Thank you! 🙏';
}

/* ──────────────────────────────────────
   FILTER BAR
────────────────────────────────────── */
function setFilter(btn) {
  btn.closest('.filter-bar')
     .querySelectorAll('.filter-btn')
     .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ──────────────────────────────────────
   LOAD MORE
────────────────────────────────────── */
function loadMore(btn) {
  btn.textContent  = 'Loading...';
  btn.disabled     = true;
  btn.style.opacity = '.7';
  setTimeout(() => {
    btn.textContent  = '✓ All articles loaded';
    btn.style.opacity = '.5';
    btn.style.cursor  = 'default';
  }, 900);
}

/* ──────────────────────────────────────
   CONTACT FORM
────────────────────────────────────── */
function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  if (!btn) return;
  btn.textContent = 'Sending…';
  btn.disabled    = true;
  setTimeout(() => {
    btn.textContent   = '✓ Message sent! We\'ll reply within 24 h';
    btn.style.background = '#1d9e75';
    e.target.reset();
  }, 1100);
}

/* ──────────────────────────────────────
   GLOBAL CLICK: close dropdowns / mobile nav
────────────────────────────────────── */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar') && _mobileOpen) closeMobileNav();
  if (!e.target.closest('.search-wrap')) {
    document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('open'));
  }
});

/* ──────────────────────────────────────
   KEYBOARD SHORTCUTS
────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
  if (e.key === '/' && !e.target.matches('input,textarea,select')) {
    e.preventDefault();
    const si = document.querySelector('.search-input');
    if (si) { si.focus(); si.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
});

/* ──────────────────────────────────────
   INIT (DOM ready)
────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  /* initLang() is now handled by i18n.js */
  initProgressBar();
  initBackToTop();
  initNavShadow();
  initReveal();
  initActiveNav();
  initCounters();
});

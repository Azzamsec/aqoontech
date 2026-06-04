/* ============================================================
   AQOON TECH — Article Renderer
   Reads frontmatter from a CMS article and builds the page
   dynamically. Loaded on every article page.
   ============================================================ */

/* Author avatar map */
const AUTHOR_DATA = {
  abdi:   { name: 'Abdi Hassan',    role_so: 'Tifaftiraha Guud, Aqoon Tech',      role_en: 'Editor-in-Chief, Aqoon Tech',      avatar: '../images/avatar-abdi.png' },
  fadumo: { name: 'Fadumo Mohamed', role_so: 'Qoraaga Nuxurka Hore, Aqoon Tech',  role_en: 'Lead Content Writer, Aqoon Tech',  avatar: '../images/avatar-fadumo.png' },
  omar:   { name: 'Omar Ali',       role_so: 'Soo-saare Muuqaal, Aqoon Tech',     role_en: 'Video Producer, Aqoon Tech',       avatar: '../images/avatar-omar.png' },
  hodan:  { name: 'Hodan Nuur',     role_so: 'Turjubaan Luqadda, Aqoon Tech',     role_en: 'Language Translator, Aqoon Tech',  avatar: '../images/avatar-hodan.png' },
};

/* Category badge colour map */
const CAT_BADGE = {
  'tech-basics':    'badge-teal',
  'internet':       'badge-teal',
  'mobile':         'badge-amber',
  'cybersecurity':  'badge-green',
  'ai':             'badge-blue',
  'digital-skills': 'badge-purple',
  'software':       'badge-blue',
  'business-tech':  'badge-amber',
};

const CAT_LABEL_SO = {
  'tech-basics':    'Aasaaska Teknoolajiyada',
  'internet':       'Internet & Shabakadaha',
  'mobile':         'Mobilada & Qalabka',
  'cybersecurity':  'Amniga Dijitaalka',
  'ai':             'AI & Teknoolajiyada Mustaqbalka',
  'digital-skills': 'Xirfadaha Dijitaalka',
  'software':       'Barnaamijyada & Abka',
  'business-tech':  'Teknoolajiyada Ganacsiga',
};

const CAT_LABEL_EN = {
  'tech-basics':    'Tech Basics',
  'internet':       'Internet & Networks',
  'mobile':         'Mobile & Devices',
  'cybersecurity':  'Cybersecurity',
  'ai':             'AI & Future Tech',
  'digital-skills': 'Digital Skills',
  'software':       'Software & Apps',
  'business-tech':  'Business Tech',
};

/* Simple markdown → HTML converter (for article body) */
function mdToHtml(md) {
  if (!md) return '';
  return md
    // headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 id="' + slugify('$1') + '">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h2 id="' + slugify('$1') + '">$1</h2>')
    // bold, italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    // blockquote
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // unordered list
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // paragraphs (double newline)
    .replace(/\n\n/g, '</p><p>')
    // wrap everything in p
    .replace(/^(.+)$/gm, function(m) {
      if (/^<[hbu]|^<bloc|^<ul|^<ol/.test(m)) return m;
      return m;
    });
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* Format date nicely */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* Apply article data to the page */
function renderArticle(data) {
  const lang = localStorage.getItem('aqoon-lang') || 'so';
  const author = AUTHOR_DATA[data.author] || AUTHOR_DATA.abdi;
  const catBadge = CAT_BADGE[data.category] || 'badge-blue';
  const catLabelSo = CAT_LABEL_SO[data.category] || data.category;
  const catLabelEn = CAT_LABEL_EN[data.category] || data.category;

  /* Page title */
  document.title = (lang === 'so' ? data.title_so : data.title_en) + ' — Aqoon Tech';

  /* Hero image */
  if (data.hero_image) {
    const heroEl = document.getElementById('article-hero-img');
    if (heroEl) { heroEl.src = data.hero_image; heroEl.alt = data.title_so; }
  }

  /* Breadcrumb category */
  const bcCat = document.getElementById('breadcrumb-cat');
  if (bcCat) {
    bcCat.setAttribute('data-so', catLabelSo);
    bcCat.setAttribute('data-en', catLabelEn);
    bcCat.textContent = lang === 'so' ? catLabelSo : catLabelEn;
  }

  /* Category badge */
  const badgeEl = document.getElementById('article-cat-badge');
  if (badgeEl) {
    badgeEl.className = 'badge ' + catBadge;
    badgeEl.setAttribute('data-so', catLabelSo);
    badgeEl.setAttribute('data-en', catLabelEn);
    badgeEl.textContent = lang === 'so' ? catLabelSo : catLabelEn;
  }

  /* Difficulty badge */
  const diffEl = document.getElementById('article-diff-badge');
  if (diffEl && data.difficulty === 'fudud') {
    diffEl.style.display = 'inline-flex';
  } else if (diffEl) {
    diffEl.style.display = 'none';
  }

  /* Title */
  const titleEl = document.getElementById('article-title');
  if (titleEl) {
    titleEl.setAttribute('data-so', data.title_so);
    titleEl.setAttribute('data-en', data.title_en);
    titleEl.textContent = lang === 'so' ? data.title_so : data.title_en;
  }

  /* Subtitle */
  const subEl = document.getElementById('article-subtitle');
  if (subEl) {
    subEl.setAttribute('data-so', data.subtitle_so || '');
    subEl.setAttribute('data-en', data.subtitle_en || '');
    subEl.textContent = lang === 'so' ? data.subtitle_so : data.subtitle_en;
  }

  /* Author */
  const avatarEl = document.getElementById('author-avatar');
  if (avatarEl) { avatarEl.src = author.avatar; avatarEl.alt = author.name; }
  const nameEl = document.getElementById('author-name');
  if (nameEl) nameEl.textContent = author.name;
  const roleEl = document.getElementById('author-role');
  if (roleEl) {
    roleEl.setAttribute('data-so', author.role_so);
    roleEl.setAttribute('data-en', author.role_en);
    roleEl.textContent = lang === 'so' ? author.role_so : author.role_en;
  }

  /* Date */
  const dateEl = document.getElementById('article-date');
  if (dateEl && data.date) dateEl.textContent = formatDate(data.date);

  /* Read time */
  const rtEl = document.getElementById('article-readtime');
  if (rtEl) {
    const so = (data.read_time || 5) + ' daqiiqo akhrinta';
    const en = (data.read_time || 5) + ' min read';
    rtEl.setAttribute('data-so', so);
    rtEl.setAttribute('data-en', en);
    rtEl.textContent = lang === 'so' ? so : en;
  }

  /* Article body */
  const bodyEl = document.getElementById('article-body-content');
  if (bodyEl) {
    const bodyMd = lang === 'so' ? (data.body_so || '') : (data.body_en || data.body_so || '');
    bodyEl.innerHTML = '<p>' + mdToHtml(bodyMd) + '</p>';
    /* Add ids to h2 for TOC */
    bodyEl.querySelectorAll('h2').forEach(h => {
      if (!h.id) h.id = slugify(h.textContent);
    });
  }

  /* Key facts */
  if (data.key_facts && data.key_facts.length) {
    ['article-key-facts', 'article-key-facts-mobile'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = data.key_facts.map(f =>
        '<div class="key-fact"><span class="key-fact-icon">📌</span><span>' + f.fact + '</span></div>'
      ).join('');
    });
  }

  /* TOC — auto-build from h2s */
  setTimeout(() => {
    const tocEl = document.getElementById('toc');
    const headings = document.querySelectorAll('#article-body-content h2[id]');
    if (tocEl && headings.length) {
      tocEl.innerHTML = Array.from(headings).map(h =>
        '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>'
      ).join('');
    }
  }, 100);

  /* SEO meta description */
  if (data.seo_description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = data.seo_description;
  }
}

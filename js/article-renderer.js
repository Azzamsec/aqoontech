/* ============================================================
   AQOON TECH — Article Renderer
   Reads an article's frontmatter (title, meta, sections[])
   and renders the flexible blocks into the new design.
   Language-aware with graceful fallback.
   ============================================================
   Expected: a global ARTICLE object injected into the page, e.g.
   window.ARTICLE = {
     primary_lang:'so', title_so, title_en, subtitle_so, subtitle_en,
     category, difficulty, author, read_time, date, hero_emoji, hero_image,
     sections: [ {type:'heading', so, en}, {type:'paragraph', so, en}, ... ]
   }
   ============================================================ */

(function(){
  const A = window.ARTICLE;
  if(!A) return;

  /* current language (set by i18n.js / localStorage) */
  function lang(){ return localStorage.getItem('aqoon-lang') || 'so'; }

  /* pick a field with fallback: try current lang, else the other, else '' */
  function pick(obj, l){
    if(!obj) return '';
    l = l || lang();
    const other = l === 'so' ? 'en' : 'so';
    return (obj[l] && obj[l].trim()) ? obj[l] : (obj[other] || '');
  }

  /* tiny markdown-ish: bold **x**, line breaks */
  function md(t){
    if(!t) return '';
    return t
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\n\n/g,'</p><p>')
      .replace(/\n/g,'<br>');
  }

  /* YouTube id extractor */
  function ytId(url){
    if(!url) return '';
    const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return m ? m[1] : '';
  }

  const cats = {
    'tech-basics':['Aasaaska Teknoolajiyada','Tech Basics'],
    'internet':['Internet & Shabakadaha','Internet & Networks'],
    'mobile':['Mobilada & Qalabka','Mobile & Devices'],
    'cybersecurity':['Amniga Dijitaalka','Cybersecurity'],
    'ai':['AI & Mustaqbalka','AI & Future'],
    'digital-skills':['Xirfadaha Dijitaalka','Digital Skills'],
    'software':['Barnaamijyada & Abka','Software & Apps'],
    'business-tech':['Teknoolajiyada Ganacsiga','Business Tech']
  };
  const diffs = {
    'fudud':['Fudud','Easy'],
    'dhexdhexaad':['Dhexdhexaad','Medium'],
    'adag':['Adag','Advanced']
  };

  function render(){
    const l = lang();
    const cat = cats[A.category] ? cats[A.category][l==='so'?0:1] : A.category;
    const diff = diffs[A.difficulty] ? diffs[A.difficulty][l==='so'?0:1] : A.difficulty;

    /* header */
    const titleEl = document.querySelector('.art-title');
    const subEl = document.querySelector('.art-sub');
    if(titleEl) titleEl.textContent = pick({so:A.title_so,en:A.title_en}, l);
    if(subEl) subEl.textContent = pick({so:A.subtitle_so,en:A.subtitle_en}, l);

    /* tags */
    const tagrow = document.querySelector('.art-head .tagrow');
    if(tagrow) tagrow.innerHTML =
      '<span class="tag tag-indigo">'+cat+'</span><span class="tag tag-teal">'+diff+'</span>';

    /* hero */
    const hero = document.querySelector('.art-hero-img');
    if(hero){
      if(A.hero_image){ hero.style.backgroundImage='url('+A.hero_image+')'; hero.style.backgroundSize='cover'; hero.style.backgroundPosition='center'; hero.textContent=''; }
      else hero.textContent = A.hero_emoji || '📄';
    }

    /* meta */
    const rt = document.querySelector('[data-meta="read"]');
    if(rt) rt.textContent = (A.read_time||5)+' '+(l==='so'?'daqiiqo':'min');

    /* body */
    const body = document.querySelector('.art-body');
    const toc = document.querySelector('#toc');
    if(!body) return;

    let html='', tocHtml='', hn=0;
    (A.sections||[]).forEach(s=>{
      switch(s.type){
        case 'heading':{
          hn++; const id='s'+hn; const txt=pick(s,l);
          html+='<h2 id="'+id+'">'+txt+'</h2>';
          tocHtml+='<a href="#'+id+'"'+(hn===1?' class="on"':'')+'>'+txt+'</a>';
          break;}
        case 'paragraph':
          html+='<p>'+md(pick(s,l))+'</p>'; break;
        case 'callout':
          html+='<div class="callout"><span class="ic">'+(s.icon||'💡')+'</span><div>'+md(pick(s,l))+'</div></div>'; break;
        case 'quote':
          html+='<blockquote>'+md(pick(s,l))+'</blockquote>'; break;
        case 'list':{
          const items=pick(s,l).split('\n').filter(x=>x.trim());
          html+='<ul>'+items.map(i=>'<li>'+md(i)+'</li>').join('')+'</ul>'; break;}
        case 'steps':{
          const items=pick(s,l).split('\n').filter(x=>x.trim());
          html+='<ol class="steps">'+items.map(i=>'<li>'+md(i)+'</li>').join('')+'</ol>'; break;}
        case 'code':
          html+='<pre class="codebox"><code>'+(s.code||'').replace(/</g,'&lt;')+'</code></pre>'+(pick(s,l)?'<p class="cap">'+pick(s,l)+'</p>':''); break;
        case 'warning':
          html+='<div class="callout warn"><span class="ic">⚠️</span><div>'+md(pick(s,l))+'</div></div>'; break;
        case 'didyouknow':
          html+='<div class="callout dyk"><span class="ic">🎯</span><div><strong>'+(l==='so'?'Ma Ogtahay? ':'Did you know? ')+'</strong>'+md(pick(s,l))+'</div></div>'; break;
        case 'video':{
          const id=ytId(s.url); const cap=pick(s,l);
          html+='<div class="video-wrap"><div class="video-label">🎬 '+(l==='so'?'Daawo':'Watch')+'</div>'+
            (id?'<div class="video-frame"><iframe src="https://www.youtube.com/embed/'+id+'" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:16px"></iframe></div>':'')+
            (cap?'<p class="cap">'+cap+'</p>':'')+'</div>'; break;}
        case 'image':
          html+='<figure class="art-fig"><img src="'+s.image+'" alt="'+(pick(s,l)||'')+'" style="width:100%;border-radius:16px">'+(pick(s,l)?'<figcaption>'+pick(s,l)+'</figcaption>':'')+'</figure>'; break;
        case 'summary':{
          const items=pick(s,l).split('\n').filter(x=>x.trim());
          html+='<div class="summary"><h3>📋 '+(l==='so'?'Soo koobka Maqaalka':'Article Summary')+'</h3><ul style="padding:0">'+
            items.map(i=>'<li>'+md(i)+'</li>').join('')+'</ul></div>'; break;}
      }
    });

    body.innerHTML = html;
    if(toc) toc.innerHTML = tocHtml;
  }

  render();
  /* re-render when language changes */
  window.addEventListener('aqoon-lang-change', render);
})();

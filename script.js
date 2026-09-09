(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;

  document.documentElement.classList.add('js');

  // ---------- Language system ----------
  const languageData = {
    en: { nav:['Home','About','What I Do','My Works','Contact'], heroTitle:'Subtitle <span class="accent">Creator.</span>', heroSub:'Vocaloid / UTAU / Synthesizer V • Thai subtitles • timing • styling', about:'About Me', what:'What I Do', works:'My Works', contact:'Got an MV that needs subtitles?', goal:'100 MVs Goal', important:'Completely Important Information', archive:'View my subtitle archive →' },
    th: { nav:['หน้าหลัก','เกี่ยวกับ','สิ่งที่ทำ','ผลงาน','ติดต่อ'], heroTitle:'นักทำ <span class="accent">ซับไตเติล.</span>', heroSub:'Vocaloid / UTAU / Synthesizer V • ซับไทย • แปล • ไทม์มิ่ง • จัดสไตล์', about:'เกี่ยวกับฉัน', what:'สิ่งที่ฉันทำ', works:'ผลงาน', contact:'มี MV ที่ต้องการซับไหม?', goal:'เป้าหมาย 100 MV', important:'ข้อมูลสำคัญแบบสุด ๆ', archive:'ดูคลังซับของฉัน →' },
    ja: { nav:['ホーム','プロフィール','できること','作品','連絡先'], heroTitle:'字幕 <span class="accent">クリエイター.</span>', heroSub:'Vocaloid / UTAU / Synthesizer V • Thai subtitles • timing • styling', about:'プロフィール', what:'できること', works:'作品', contact:'字幕が必要なMVがありますか？', goal:'100 MV 目標', important:'とても重要な情報', archive:'字幕アーカイブを見る →' }
  };

  const langButtons = $$('.lang-btn');
  const savedLang = localStorage.getItem('packpm-lang') || 'en';
  let currentLang = languageData[savedLang] ? savedLang : 'en';

  function applyLanguage(lang) {
    currentLang = languageData[lang] ? lang : 'en';
    localStorage.setItem('packpm-lang', currentLang);
    document.documentElement.lang = currentLang;
    document.body.dataset.lang = currentLang;
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));

    const d = languageData[currentLang];
    $$('.navbar a').forEach((el, i) => { if (d.nav[i]) el.textContent = d.nav[i]; });
    const title = $('.hero h1'); if (title) title.innerHTML = d.heroTitle;
    const sub = $('.hero > div > p'); if (sub) sub.textContent = d.heroSub;
    const sectionTitles = $$('.section-title');
    if (sectionTitles[0]) sectionTitles[0].innerHTML = `${d.about} <span>👋</span>`;
    if (sectionTitles[1]) sectionTitles[1].innerHTML = `${d.goal} <span>🌱</span>`;
    if (sectionTitles[2]) sectionTitles[2].innerHTML = `${d.what} <span>🎬</span>`;
    if (sectionTitles[3]) sectionTitles[3].innerHTML = `${d.works} <span>📚</span>`;
    if (sectionTitles[4]) sectionTitles[4].innerHTML = `${d.goal} <span>📊</span>`;
    if (sectionTitles[5]) sectionTitles[5].innerHTML = `${d.important} <span>🥶</span>`;
    const contact = $('.contact-card h2'); if (contact) contact.textContent = d.contact;
    const archive = $('.archive-link'); if (archive) archive.textContent = d.archive;
  }
  langButtons.forEach(b => b.addEventListener('click', () => applyLanguage(b.dataset.lang)));

  // ---------- Startup ----------
  const startup = $('.startup');
  const skip = $('.boot-skip');
  const greeted = ['Hello','สวัสดี','こんにちは'];
  const bootTitle = $('.boot-title');
  const bootSequence = async () => {
    if (!startup) return;
    if (reduceMotion || sessionStorage.getItem('packpm-booted') === '1') {
      startup.remove();
      document.body.classList.add('x-booted');
      return;
    }
    for (const text of greeted) {
      if (!bootTitle) break;
      bootTitle.textContent = text;
      await new Promise(r => setTimeout(r, 560));
    }
    await new Promise(r => setTimeout(r, 650));
    closeBoot();
  };
  function closeBoot() {
    if (!startup) return;
    sessionStorage.setItem('packpm-booted','1');
    startup.classList.add('hide');
    document.body.classList.add('x-booted');
    setTimeout(() => startup.remove(), 800);
  }
  skip?.addEventListener('click', closeBoot);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && startup) closeBoot(); }, { once:false });
  bootSequence();

  // ---------- Canvas particles ----------
  const canvas = $('#particleCanvas');
  const ctx = canvas?.getContext('2d', { alpha:true });
  let particles = [];
  let raf = 0;
  const pointer = { x: innerWidth/2, y: innerHeight/2, tx:innerWidth/2, ty:innerHeight/2 };
  function resizeCanvas(){
    if (!canvas || !ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(innerWidth*dpr); canvas.height = Math.floor(innerHeight*dpr);
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = reduceMotion ? 0 : Math.min(90, Math.max(28, Math.floor(innerWidth*innerHeight/18000)));
    particles = Array.from({length:count}, () => ({ x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.5+.3,a:Math.random()*.55+.12 }));
  }
  function particleLoop(){
    if (!canvas || !ctx || document.hidden) { raf = requestAnimationFrame(particleLoop); return; }
    pointer.x += (pointer.tx-pointer.x)*.045; pointer.y += (pointer.ty-pointer.y)*.045;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -5) p.x = innerWidth+5; if (p.x > innerWidth+5) p.x=-5;
      if (p.y < -5) p.y = innerHeight+5; if (p.y > innerHeight+5) p.y=-5;
      const dx = pointer.x-p.x, dy=pointer.y-p.y, dist=Math.hypot(dx,dy);
      if (dist<150) { p.x -= dx/dist*.12*(1-dist/150); p.y -= dy/dist*.12*(1-dist/150); }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(103,232,249,${p.a})`; ctx.fill();
    }
    raf=requestAnimationFrame(particleLoop);
  }
  if (canvas && ctx) { resizeCanvas(); particleLoop(); addEventListener('resize', resizeCanvas); }

  // ---------- Cursor + magnetic interactions ----------
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  let cx=innerWidth/2,cy=innerHeight/2,rx=cx,ry=cy;
  if (finePointer && !reduceMotion) {
    addEventListener('pointermove', e => {
      pointer.tx=e.clientX; pointer.ty=e.clientY; document.documentElement.style.setProperty('--mx',e.clientX+'px'); document.documentElement.style.setProperty('--my',e.clientY+'px');
      cx=e.clientX; cy=e.clientY;
    });
    const cursorLoop=()=>{rx+=(cx-rx)*.24; ry+=(cy-ry)*.24; if(dot) dot.style.transform=`translate3d(${cx}px,${cy}px,0)`; if(ring) ring.style.transform=`translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(cursorLoop)}; cursorLoop();
    $$('a,button,.project,.thing,.tag').forEach(el=>{ el.addEventListener('mouseenter',()=>ring?.classList.add('hot')); el.addEventListener('mouseleave',()=>ring?.classList.remove('hot')); });
    $$('.magnetic').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-(r.left+r.width/2))*.12}px,${(e.clientY-(r.top+r.height/2))*.12}px)`}));
    $$('.magnetic').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));
  }

  // ---------- Project tilt / spotlight ----------
  if (finePointer && !reduceMotion) $$('.project,.featured-project').forEach(card=>{
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;card.style.setProperty('--px',x+'px');card.style.setProperty('--py',y+'px');if(card.classList.contains('project')) card.style.transform=`perspective(900px) rotateX(${(y/r.height-.5)*-5}deg) rotateY(${(x/r.width-.5)*7}deg) translateY(-3px)`});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  // ---------- Scroll reveals + active nav ----------
  const revealTargets = $$('section,.profile-card,.hero'); revealTargets.forEach((el,i)=>{ if(!el.classList.contains('reveal')) el.classList.add('reveal'); el.style.transitionDelay=`${Math.min(i%4*70,210)}ms`; });
  if ('IntersectionObserver' in window && !reduceMotion) { const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12}); revealTargets.forEach(e=>io.observe(e)); } else revealTargets.forEach(e=>e.classList.add('visible'));
  const navLinks=$$('.navbar a'); const sections=navLinks.map(a=>$(a.getAttribute('href'))).filter(Boolean); if('IntersectionObserver' in window){const nio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-30% 0px -55%'});sections.forEach(s=>nio.observe(s));}

  // ---------- Lazy images ----------
  $$('img').forEach(img=>{ if(!img.loading) img.loading='lazy'; img.decoding='async'; });

  // ---------- Terminal ----------
  const terminal=$('.terminal'), output=$('.terminal-body'), input=$('.terminal-input input');
  const terminalLines = {
    help:['Available commands:','help   — show commands','whoami — identity','projects — latest work','skills — tools & services','contact — contact links','theme — activate secret mode','clear — clear terminal','exit — close terminal'],
    whoami:['PACKPM','Subtitle Creator','Thailand','Vocaloid / UTAU / Synthesizer V'],
    projects:['01  It’s fiction. feat. Kasane Teto','02  Character T','03  YARARARA feat. 重音テト','04  Baka Backer','05  Don’t Let Me Down feat. GUMI','... 21+ MVs and counting'],
    skills:['Aegisub','YTSubConverter','Thai lyric adaptation','English / Japanese → Thai','Subtitle timing + styling'],
    contact:['email: doubletp90@gmail.com','discord: @759341756025798656','x: @Pack0pm','tiktok: @pack0pm']
  };
  function print(lines){ if(!output)return; lines.forEach(line=>{const p=document.createElement('div');p.className='terminal-line';p.textContent=line;output.appendChild(p)});output.scrollTop=output.scrollHeight; }
  function runCommand(raw){const cmd=raw.trim().toLowerCase();if(!cmd)return;if(cmd==='clear'){output.innerHTML='';return}if(cmd==='exit'){closeTerminal();return}if(cmd==='theme'){document.body.classList.toggle('secret');toast('SECRET MODE // unlocked');print(['[+] visual frequency shifted.']);return}if(terminalLines[cmd]) print(terminalLines[cmd]); else print([`command not found: ${cmd}`,'type “help” for available commands']);}
  function openTerminal(){terminal?.classList.add('open');input?.focus();if(output?.children.length===0)print(['PACKPM TERMINAL v1.0','Type “help” to begin.']);}
  function closeTerminal(){terminal?.classList.remove('open');}
  $('.terminal-btn')?.addEventListener('click',openTerminal); $('.terminal-close')?.addEventListener('click',closeTerminal); terminal?.addEventListener('click',e=>{if(e.target===terminal)closeTerminal()}); input?.addEventListener('keydown',e=>{if(e.key==='Enter'){runCommand(input.value);input.value=''}});
  addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();openTerminal()}if(e.key==='Escape')closeTerminal()});

  // ---------- Konami / secret ----------
  const konami=[ 'ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a' ]; let ki=0;
  addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(key===konami[ki]){ki++;if(ki===konami.length){ki=0;document.body.classList.toggle('secret');toast('KONAMI // PACKPM MODE');}}else ki=0});
  function toast(msg){const t=$('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1800)}

  // Initialize after DOM is ready.
  applyLanguage(currentLang);
})();
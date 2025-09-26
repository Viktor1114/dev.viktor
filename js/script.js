/* ---------- Theme toggle ---------- */
(function(){
  const root = document.documentElement;
  const initial = localStorage.getItem('theme');
  if(initial){ root.setAttribute('data-theme', initial); }
  const btn = document.getElementById('theme');
  if(btn){
    btn.addEventListener('click', ()=>{
      const cur = root.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      if(!cur){
        root.setAttribute('data-theme','light');
        localStorage.setItem('theme','light');
      } else {
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      }
    });
  }
})();

/* ---------- Matrix rain background (canvas) ---------- */
(function(){
  const c = document.getElementById('matrix');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w,h, cols, yPos;
  const chars = 'アイウエオカキクケコｱｲｳVIKTORｴｵｶｷｸｹｺ01[]{}<>/\\=+*#$_';
  function resize(){
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    cols = Math.floor(w/16);
    yPos = Array(cols).fill(0);
  }
  function draw(){
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#0b0f14';
    ctx.globalAlpha = 0.10;
    ctx.fillRect(0,0,w,h);
    ctx.globalAlpha = 1;
    for(let i=0;i<cols;i++){
      const text = chars[Math.floor(Math.random()*chars.length)];
      const x = i*16;
      const y = (yPos[i] % (Math.ceil(h/16)+20)) * 16;
      ctx.fillStyle = Math.random()>0.975 ? '#7aa8ff' : '#4ee4a5';
      ctx.font = '16px monospace';
      ctx.fillText(text, x, y);
      if(y>h && Math.random()>0.975){ yPos[i]=0 } else { yPos[i]++ }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize(); draw();
})();

/* ---------- Scroll reveal (IntersectionObserver) ---------- */
(function(){
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  },{ threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
})();

/* ---------- Scrollspy for sidebar (IntersectionObserver) ---------- */
(function(){
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navlinks = Array.from(document.querySelectorAll('nav .navlink'));
  if(!sections.length || !navlinks.length) return;
  const map = new Map(sections.map(s=>[s.id, s]));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const id = e.target.id;
      if(e.isIntersecting){
        navlinks.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+id));
        // update URL hash without scrolling
        history.replaceState(null, '', '#'+id);
      }
    });
  },{ rootMargin:'-40% 0px -50% 0px', threshold:0.01 });
  sections.forEach(s=>io.observe(s));

  // Smooth nav click + close mobile menu
  document.getElementById('nav').addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    map.get(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    // on mobile: close menu
    const sidebar = document.getElementById('sidebar');
    if(sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      document.body.classList.remove('menu-open');
      document.getElementById('overlay').classList.remove('show');
      document.getElementById('menuToggle').setAttribute('aria-expanded','false');
    }
  });
})();
const burger = document.querySelector('.burger');
const nav = document.querySelector('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

/* ---------- 3D tilt on project cards ---------- */
(function(){
  const parents = document.querySelectorAll('[data-tilt]');
  parents.forEach(parent=>{
    const card = parent.querySelector('.card');
    if(!card) return;
    const r = 10; // max rotate
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rx = ((y/rect.height)-.5)*-r;
      const ry = ((x/rect.width)-.5)*r;
      card.style.transform = "rotateX(+ rx + deg) , rotateY(+ ry + deg) , translateZ(6px)";
      card.style.boxShadow = '0 25px 60px rgba(0,0,0,.35)';
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();


/* ---------- Mobile menu toggle + overlay handling ---------- */
(function(){
  const btn = document.getElementById('menuToggle');
  const sidebar = document.getElementById('nav');
  const overlay = document.getElementById('overlay');
  if(!btn , !sidebar , !overlay) return;

  function openMenu(){
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded','true');
  }
  function closeMenu(){
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded','false');
    btn.focus();
  }

  btn.addEventListener('click', ()=>{
    const isOpen = sidebar.classList.contains('open');
    if(isOpen) closeMenu(); else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

  const id = a.getAttribute('href').slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  closeMenu();
});

  // close on escape
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && sidebar.classList.contains('open')) closeMenu();
  });
})();


/* ---------- Small helpers ---------- */
document.getElementById('y').textContent = new Date().getFullYear();
// Burger menu (mobile)
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger?.addEventListener('click', () => {
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
  nav.style.flexDirection = 'column';
  nav.style.gap = '8px';
  nav.style.background = 'rgba(14,15,22,.95)';
  nav.style.position = 'absolute';
  nav.style.top = '56px';
  nav.style.right = '16px';
  nav.style.padding = '12px';
  nav.style.border = '1px solid rgba(255,255,255,.08)';
  nav.style.borderRadius = '12px';
});

// Smooth scroll untuk anchor
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const el = document.querySelector(id);
    if (el){
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // tutup menu mobile setelah klik
      if (window.innerWidth < 900) nav.style.display = 'none';
    }
  });
});

// Scroll spy (highlight link saat section aktif)
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav a[href^="#"]')];

function onScroll(){
  const y = window.scrollY + 120;
  let currentId = '';
  for (const s of sections){
    const top = s.offsetTop;
    const bottom = top + s.offsetHeight;
    if (y >= top && y < bottom){ currentId = '#'+s.id; break; }
  }
  links.forEach(l=>{
    if (l.getAttribute('href') === currentId) l.style.color = '#fff';
    else l.style.color = 'var(--muted)';
  });
}
document.addEventListener('scroll', onScroll);
onScroll();

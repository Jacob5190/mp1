// DOM
const hdr = document.getElementById('hdr');
const bar = document.getElementById('bar-fill');
const menu = document.getElementById('menu');
const toggle = document.getElementById('toggle');

const secs = [
  document.getElementById('home'),
  document.getElementById('about'),
  document.getElementById('imgs'),
  document.getElementById('skills'),
  document.getElementById('video'),
  document.getElementById('contact')
];

const links = [
  document.querySelector('#menu a[href="#home"]'),
  document.querySelector('#menu a[href="#about"]'),
  document.querySelector('#menu a[href="#imgs"]'),
  document.querySelector('#menu a[href="#skills"]'),
  document.querySelector('#menu a[href="#video"]'),
  document.querySelector('#menu a[href="#contact"]')
];

if (toggle && menu && !toggle.dataset.bound) {
  toggle.dataset.bound = '1';
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    console.log({
      hasOpen: menu.classList.contains('open'),
      computed: getComputedStyle(menu).display,
      inline: menu.style.display
    });
  });
}


// Section and Active Link Detection
let sectionTops = [];

function measureSections() {
  sectionTops = secs.map(s => s ? s.offsetTop : 0);
}

function pickActiveIndex() {
  if (window.scrollY <= 1) return 0;
  
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const y = window.scrollY;
  
  if (Math.abs(y - max) <= 1) return secs.length - 1;
  
  const lineY = y + hdr.offsetHeight + 1;
  let idx = 0;
  
  for (let i = 0; i < sectionTops.length; i++) {
    if (sectionTops[i] <= lineY) {
      idx = i;
    } else {
      break;
    }
  }
  
  return idx;
}

// Scroll Handler
function onScroll() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  
  if (bar) {
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }

  const active = pickActiveIndex();
  links.forEach((a, i) => a?.classList.toggle('active', i === active));
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const el = id && document.querySelector(id);
    
    if (!el) return;
    
    e.preventDefault();
    const y = el.getBoundingClientRect().top + window.scrollY - hdr.offsetHeight + 4;
    window.scrollTo({ top: y, behavior: 'smooth' });
    menu?.classList.remove('open');
  });
});

// Event Listeners
window.addEventListener('load', () => {
  measureSections();
  onScroll();
});

window.addEventListener('resize', () => {
  measureSections();
  onScroll();
});

document.addEventListener('scroll', onScroll, { passive: true });

// Carousel
const track = document.getElementById('track');
let i = 0;
let n = track.children.length;

document.querySelectorAll('.arrow').forEach(b => {
  b.onclick = () => {
    i = (i + +b.dataset.dir + n) % n;
    track.style.transform = `translateX(${-i * 100}%)`;
  };
});

// Modal
const modal = document.getElementById('modal');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open]').forEach(b => {
  b.onclick = openModal;
});

document.querySelectorAll('[data-close], .backdrop').forEach(b => {
  b.onclick = closeModal;
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

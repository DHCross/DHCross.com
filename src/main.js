import './style.css';

// ─────────────────────────────────────────────
// 1. PARTICLE SYSTEM (canvas background)
// ─────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles = [];

const PARTICLE_COUNT = 80;

const COLORS = [
  'rgba(201, 168, 76,',   // gold
  'rgba(164, 178, 198,',  // steel blue
  'rgba(155, 123, 222,',  // violet
  'rgba(240, 242, 246,',  // white
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticle() {
  const color = randomColor();
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.35 + 0.05,
    color,
  };
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `${p.color}${p.alpha})`;
    ctx.fill();
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    // Wrap around edges
    if (p.x < -5) p.x = W + 5;
    if (p.x > W + 5) p.x = -5;
    if (p.y < -5) p.y = H + 5;
    if (p.y > H + 5) p.y = -5;
  }
}

let animationId;
function tick() {
  updateParticles();
  drawParticles();
  animationId = requestAnimationFrame(tick);
}

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

resize();
initParticles();
tick();

// ─────────────────────────────────────────────
// 2. STAGGERED CARD ENTRY ANIMATIONS
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = parseInt(card.dataset.delay || 0, 10);
          setTimeout(() => {
            card.classList.add('is-visible');
          }, delay);
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.01, rootMargin: '200px 0px 0px 0px' }
  );

  cards.forEach((card) => observer.observe(card));
});

// ─────────────────────────────────────────────
// 3. CARD MOUSE-TILT MICRO-INTERACTION
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, border-color 0.4s, box-shadow 0.4s';
    });
  });
});

// ─────────────────────────────────────────────
// 4. PARALLAX-LITE ON SCROLL
// ─────────────────────────────────────────────
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const delta = y - lastScroll;
  lastScroll = y;

  // Subtly shift aurora with scroll
  const aurora = document.querySelector('.aurora-overlay');
  if (aurora) {
    aurora.style.transform = `translateY(${y * 0.04}px)`;
  }
}, { passive: true });

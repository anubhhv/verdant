'use strict';

// ── CUSTOM CURSOR ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursorTrail');
let mx = -200, my = -200, tx = -200, ty = -200;
let cursorReady = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (!cursorReady) {
    cursorReady = true;
    cursor.classList.add('ready');
    trail.classList.add('ready');
  }
  trail.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});

// smooth cursor follow
function animCursor() {
  tx += (mx - tx) * 0.13;
  ty += (my - ty) * 0.13;
  cursor.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.feat-card,.path-card,.tcard,.float-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// ── NAV SCROLL ─────────────────────────────────────────────────
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 30);
});

// ── MOBILE MENU ────────────────────────────────────────────────
document.getElementById('navBurger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ── PARTICLE CANVAS ────────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLE_COUNT = 90;
const particles = [];

class Particle {
  constructor() { this.reset(true); }
  reset(randomY = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = randomY ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(0.2 + Math.random() * 0.5);
    this.r  = 0.8 + Math.random() * 1.6;
    this.alpha = 0.05 + Math.random() * 0.35;
    this.life = 0;
    this.maxLife = 200 + Math.random() * 400;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    const fade = Math.min(this.life / 60, 1) * Math.min((this.maxLife - this.life) / 60, 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59,186,130,${this.alpha * fade})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(59,186,130,${0.04 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animParticles);
}
animParticles();

// ── COUNTER ANIMATION ──────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// ── SCROLL REVEAL ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const counters  = document.querySelectorAll('.hs-num');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('on');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

// trigger counters when hero stats come into view
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(el => {
        animateCounter(el, Number(el.dataset.count));
      });
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── PROGRESS BAR ANIMATION (mini bars) ────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.mb-fill').forEach(fill => {
        fill.style.width = getComputedStyle(fill).getPropertyValue('--w');
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.mini-bars').forEach(el => {
  // Start all bars at 0
  el.querySelectorAll('.mb-fill').forEach(f => { f.style.width = '0'; });
  barObserver.observe(el);
});

// ── SMOOTH ANCHOR LINKS ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── TILT ON FEAT CARDS ─────────────────────────────────────────
document.querySelectorAll('.feat-card,.path-card,.tcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 5;
    const ry = ((e.clientX - cx) / rect.width)  * -5;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
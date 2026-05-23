/* ═══════════════════════════════════════════════════════
   WEDDING INVITATION — main.js
   Depends on: GSAP 3 + ScrollTrigger (loaded before this file)
═══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── DOM REFERENCES ─────────────────────────────────── */
const loader    = document.getElementById('loader');
const envelope  = document.getElementById('envelope');
const flapL     = document.getElementById('flap-left');
const flapR     = document.getElementById('flap-right');
const coupleBg  = document.getElementById('couple-bg');
const scrollCue = document.getElementById('scroll-cue');
const audio     = document.getElementById('wedding-audio');
const musicBtn  = document.getElementById('music-btn');
const icOn      = document.getElementById('ic-on');
const icOff     = document.getElementById('ic-off');


/* ─── SPLASH LOADER ──────────────────────────────────── */
document.body.style.overflow = 'hidden';

loader.addEventListener('click', e => {
  e.stopPropagation();
  document.body.style.overflow = '';
  loader.classList.add('out');
  setTimeout(() => loader.remove(), 950);
  initAudio();
}, { once: true });

/* ─── IDLE FLOAT ─────────────────────────────────────── */
/* Subtle breathing motion before the user scrolls       */
const floatAnim = gsap.to(envelope, {
  y: -10,
  duration: 3.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});

/* ─── ENVELOPE OPEN — SCROLL TRIGGER ─────────────────── */
const openTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: '40% top',
    scrub: 0.6,
    onEnter() {
      floatAnim.kill();
      gsap.set(envelope, { y: 0 });
      initAudio();
    },
  },
});

openTl
  /* Fade out scroll cue immediately */
  .to(scrollCue, { opacity: 0, duration: .12 }, 0)

  /* LEFT flap — heavier physics, slightly slower */
  .to(flapL, {
    x: '-108%',
    rotationZ: -1.8,
    transformOrigin: 'left center',
    ease: 'power2.inOut',
    duration: 1,
  }, 0.04)

  /* RIGHT flap — lighter, fractionally faster */
  .to(flapR, {
    x: '108%',
    rotationZ: 1.2,
    transformOrigin: 'right center',
    ease: 'power2.inOut',
    duration: .92,
  }, 0.10)

  /* Couple photo: fade + subtle scale-down reveal */
  .fromTo(
    coupleBg,
    { opacity: 0, scale: 1.07 },
    { opacity: 1, scale: 1, ease: 'power1.out', duration: .72 },
    0.30
  );

/* ─── FLOATING DUST PARTICLES ────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = [
    'rgba(201,169,110,',
    'rgba(232,213,183,',
    'rgba(255,245,225,',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 38; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.4 + 0.25,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    -(Math.random() * 0.28 + 0.08),
      alpha: Math.random() * 0.38 + 0.08,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5)    { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5)      p.x = W + 5;
      if (p.x > W + 5)   p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}());

/* ─── FADE-UP ON SCROLL ──────────────────────────────── */
gsap.utils.toArray('.fu').forEach(el => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 34 },
    {
      opacity: 1,
      y: 0,
      duration: .95,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 87%',
        toggleActions: 'play none none none',
      },
    }
  );
});

/* ─── AUDIO SYSTEM ───────────────────────────────────── */
let audioReady = false;
let playing    = false;

function fadeIn() {
  audio.volume = 0;
  audio.play()
    .then(() => {
      playing = true;
      musicBtn.classList.add('playing');
      icOff.style.display = 'none';
      icOn.style.display  = '';
      gsap.to(audio, { volume: .65, duration: 3, ease: 'power1.out' });
    })
    .catch(() => {
      audioReady = false; // reset so the next interaction can retry
    });
}

function fadeOut() {
  gsap.to(audio, {
    volume: 0,
    duration: 1.2,
    onComplete: () => audio.pause(),
  });
  playing = false;
  musicBtn.classList.remove('playing');
  icOn.style.display  = 'none';
  icOff.style.display = '';
}

function initAudio() {
  if (!audioReady) {
    audioReady = true;
    fadeIn();
  }
}

/* Try on scroll — works if browser allows it */
window.addEventListener('scroll',     () => initAudio(), { once: true });
/* First touch or click anywhere guarantees autoplay policy is satisfied */
window.addEventListener('touchstart', () => initAudio(), { once: true, passive: true });
document.addEventListener('click',    () => initAudio(), { once: true });

/* Manual toggle — stopPropagation prevents the document click above from double-firing */
musicBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (!audioReady) { audioReady = true; fadeIn(); }
  else if (playing) { fadeOut(); }
  else              { fadeIn(); }
});

/* ─── RSVP FORM ──────────────────────────────────────── */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFdjJJMLH9QJ3kpZImV1kXV92kK8580Wkwai2toxAQyRM8sh_ePHid5qZiTXMBANgC-Q/exec'; // ← paste your deployed Apps Script URL here

document.getElementById('rsvp-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.btn-rsvp');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  const els = form.elements;
  const data = {
    name:       els['name'].value.trim(),
    email:      els['email'].value.trim(),
    phone:      els['phone'].value.trim(),
    attendance: els['attendance'].value,
    guests:     els['guests'].value,
    dietary:    els['dietary'].value.trim(),
  };

  try {
    await fetch(SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'text/plain' }, // text/plain is allowed in no-cors; Apps Script reads body as JSON string
      body:    JSON.stringify(data),
    });
    btn.textContent = 'Thank you ♡';
  } catch (err) {
    btn.textContent = 'Send RSVP';
    btn.disabled = false;
    alert('Something went wrong. Please try again.');
  }
});

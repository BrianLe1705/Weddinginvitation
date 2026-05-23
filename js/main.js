gsap.registerPlugin(ScrollTrigger);

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

document.body.style.overflow = 'hidden';

loader.addEventListener('click', e => {
  e.stopPropagation();
  document.body.style.overflow = '';
  loader.classList.add('out');
  setTimeout(() => loader.remove(), 950);
  initAudio();
}, { once: true });

const floatAnim = gsap.to(envelope, {
  y: -10,
  duration: 3.8,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});

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
  .to(scrollCue, { opacity: 0, duration: .12 }, 0)
  .to(flapL, {
    x: '-108%',
    rotationZ: -1.8,
    transformOrigin: 'left center',
    ease: 'power2.inOut',
    duration: 1,
  }, 0.04)
  .to(flapR, {
    x: '108%',
    rotationZ: 1.2,
    transformOrigin: 'right center',
    ease: 'power2.inOut',
    duration: .92,
  }, 0.10)
  .fromTo(
    coupleBg,
    { opacity: 0, scale: 1.07 },
    { opacity: 1, scale: 1, ease: 'power1.out', duration: .72 },
    0.30
  );

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
      audioReady = false;
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

window.addEventListener('scroll',     () => initAudio(), { once: true });
window.addEventListener('touchstart', () => initAudio(), { once: true, passive: true });
document.addEventListener('click',    () => initAudio(), { once: true });

musicBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (!audioReady) { audioReady = true; fadeIn(); }
  else if (playing) { fadeOut(); }
  else              { fadeIn(); }
});

(function initCarousel() {
  const photos = [
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1200&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=1200&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80',
  ];

  let current  = 0;
  let animating = false;
  let timer;
  const INTERVAL  = 4500;
  const FLIP_TIME = 320;

  let imgA = document.getElementById('gc-img-a');
  let imgB = document.getElementById('gc-img-b');

  imgA.style.zIndex = '2';
  imgB.style.zIndex = '1';

  const thumbsWrap = document.getElementById('gc-thumbs');
  const prevBtn    = document.querySelector('.gc-prev');
  const nextBtn    = document.querySelector('.gc-next');
  const display    = document.querySelector('.gc-display');

  photos.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'gc-thumb' + (i === 0 ? ' active' : '');
    const img = document.createElement('img');
    img.src = src; img.alt = 'Photo ' + (i + 1); img.loading = 'lazy';
    div.appendChild(img);
    div.addEventListener('click', () => goTo(i, i >= current ? 1 : -1));
    thumbsWrap.appendChild(div);
  });

  function clearFlipClasses(el) {
    el.classList.remove('flip-out-left', 'flip-out-right', 'flip-in-left', 'flip-in-right');
  }

  function goTo(index, dir) {
    if (animating || index === current) return;
    animating = true;

    const thumbs  = thumbsWrap.querySelectorAll('.gc-thumb');
    thumbs[current].classList.remove('active');
    current = (index + photos.length) % photos.length;

    imgB.src = photos[current];
    imgB.style.opacity = '1';

    clearFlipClasses(imgA);
    clearFlipClasses(imgB);
    void imgA.offsetWidth;

    imgA.classList.add(dir >= 0 ? 'flip-out-left'  : 'flip-out-right');
    imgB.classList.add(dir >= 0 ? 'flip-in-right'  : 'flip-in-left');

    setTimeout(() => {
      clearFlipClasses(imgA);
      clearFlipClasses(imgB);
      imgA.style.opacity = '0';
      [imgA, imgB] = [imgB, imgA];
      imgA.style.opacity = '1';
      animating = false;
    }, FLIP_TIME * 2 + 50);

    thumbs[current].classList.add('active');
    const thumb = thumbs[current];
    thumbsWrap.scrollTo({
      left: thumb.offsetLeft - thumbsWrap.offsetWidth / 2 + thumb.offsetWidth / 2,
      behavior: 'smooth',
    });

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1, 1), INTERVAL);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1, -1));
  nextBtn.addEventListener('click', () => goTo(current + 1,  1));

  let touchStartX = 0;
  display.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  display.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1, diff > 0 ? 1 : -1);
  });

  resetTimer();
}());

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFdjJJMLH9QJ3kpZImV1kXV92kK8580Wkwai2toxAQyRM8sh_ePHid5qZiTXMBANgC-Q/exec';

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
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:   JSON.stringify(data),
    });
    btn.textContent = 'Thank you ♡';
  } catch (err) {
    btn.textContent = 'Send RSVP';
    btn.disabled = false;
    alert('Something went wrong. Please try again.');
  }
});

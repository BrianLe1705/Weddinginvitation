gsap.registerPlugin(ScrollTrigger);
window.scrollTo(0, 0);

const loader    = document.getElementById('loader');
const envelope  = document.getElementById('envelope');
const flapL     = document.getElementById('flap-left');
const flapR     = document.getElementById('flap-right');
const coupleBg  = document.getElementById('couple-bg');
const scrollCue = document.getElementById('scroll-cue');
const audio     = document.getElementById('wedding-audio');
const musicBtn  = document.getElementById('music-btn');
const icOn      = document.getElementById('ic-on');
const icOff        = document.getElementById('ic-off');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const rsvpNavBtn   = document.getElementById('rsvp-nav-btn');
const btnLangEn    = document.getElementById('btn-lang-en');
const btnLangVi    = document.getElementById('btn-lang-vi');

document.body.style.overflow = 'hidden';

loader.addEventListener('click', e => e.stopPropagation());

function dismissLoader() {
  document.body.style.overflow = '';
  loader.classList.add('out');
  setTimeout(() => loader.remove(), 950);
  langToggleBtn.style.display = '';
  rsvpNavBtn.style.display = '';
  initAudio();
}

btnLangEn.addEventListener('click', e => {
  e.stopPropagation();
  setLang('en');
  dismissLoader();
});

btnLangVi.addEventListener('click', e => {
  e.stopPropagation();
  setLang('vi');
  dismissLoader();
});

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
    end: '28% top',
    scrub: 0.42,
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

  for (let i = 0; i < 45; i++) {
    particles.push({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 2.2 + 0.45,
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

rsvpNavBtn.addEventListener('click', () => {
  if (rsvpNavBtn.classList.contains('at-bottom')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.getElementById('sec-rsvp').scrollIntoView({ behavior: 'smooth' });
  }
});

new IntersectionObserver(
  entries => rsvpNavBtn.classList.toggle('at-bottom', entries[0].isIntersecting),
  { threshold: 0.1 }
).observe(document.querySelector('footer'));

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

const i18n = {
  en: {
    'hero-eyebrow':         'Celebrating our special day',
    'flap-date':            '17 · December · 2026',
    'scroll-cue':           'scroll to open',
    'wedding-date':         'Thursday · December 17 · 2026',
    'wedding-location':     'Hanoi City, Viet Nam',
    'brides-family':        "Bride's Family",
    'grooms-family':        "Groom's Family",
    'family-message':       'Together with our families, we sincerely invite you to join us in celebrating our wedding ceremony and to share in the joy of this special occasion.',
    'details-title':        'The Wedding Details',
    'date-label':           'Date',
    'date-sub':             'Thursday',
    'ceremony-venue-label': 'Ceremony Venue',
    'map-btn':              'Open in Maps',
    'dress-label':          'Dress Code',
    'dress-value':          'Dress Your Best',
    'dress-sub':            'Formal Attire Requested',
    'timeline-title':       'Ceremony Schedule',
    'ev-time-1':            '10:30 AM',
    'ev-time-2':            '11:00 AM',
    'ev-time-3':            '11:30 AM',
    'ev-time-4':            '1:30 PM',
    'ev-welcome':           'Welcome Reception',
    'ev-welcome-place':     'PhotoBooth & Backdrop Photography',
    'ev-lunch':             'Lunch Serving',
    'ev-ceremony':          'Ceremony Begins',
    'ev-reception':         'Wedding Reception & Celebration',
    'rsvp-eyebrow':         'Kindly Reply At your convenience',
    'rsvp-title':           'Will You Join Us?',
    'label-name':           'Full Name',
    'ph-name':              'Your full name',
    'label-side':           'Which side are you attending with?',
    'opt-bride-side':       "Bride's Side",
    'opt-groom-side':       "Groom's Side",
    'label-phone':          'Phone Number',
    'ph-phone':             'Your phone number',
    'label-attendance':     'Attendance',
    'opt-select':           'Please select',
    'opt-yes':              'Accept',
    'opt-no':               'Decline',
    'label-guests':         'Number of Guests',
    'ph-guests':            'Enter number of guests',
    'label-dietary':        'Leave us a message',
    'ph-dietary':           'Special request',
    'btn-rsvp':             'Send RSVP',
    'footer-date':          'December 17, 2026 · Hanoi City',
    'footer-made':          'Your presence is truly the most meaningful gift on our special day.',
    'fc-names':             'Cathy & Hung',
    'groom-name':           'Hung',
    'family-bride-father':  'Mr. Chu Dinh Luong',
    'family-bride-mother':  'Mrs. Nguyen Thi Huong Giang',
    'family-groom-father':  'Mr. Le Van Sinh',
    'family-groom-mother':  'Mrs. Nguyen Thi Huong',
    'family-groom-name':    'Hung Le',
    'family-groom-p1':      'Hung',
    'family-groom-p2':      'Le',
    'family-bride-name':    'Cathy Chu',
    'family-bride-p1':      'Cathy',
    'family-bride-p2':      'Chu',
    'date-value-main':      'December 17',
    'venue-name':           'Long Vi Palace',
    'venue-sub':            '3A Dao Duy Anh st, Kim Lien, Hanoi · 12:00 PM',
  },
  vi: {
    'hero-eyebrow':         'Celebrating our special day',
    'flap-date':            '17 · Tháng 12 · 2026',
    'scroll-cue':           'cuộn để mở',
    'wedding-date':         'Thứ Năm · 17 Tháng 12 · 2026',
    'wedding-location':     'Hà Nội, Việt Nam',
    'brides-family':        'Nhà Gái',
    'grooms-family':        'Nhà Trai',
    'family-message':       'Trân trọng kính mời tới dự bữa tiệc Lễ Thành Hôn cùng gia đình chúng tôi',
    'details-title':        'Lễ Thành Hôn',
    'date-label':           'Ngày',
    'date-sub':             'Thứ Năm',
    'ceremony-venue-label': 'Địa Điểm Tổ Chức',
    'map-btn':              'Xem bản đồ',
    'dress-label':          'Trang Phục',
    'dress-value':          'Lịch Sự',
    'dress-sub':            'Trang phục trang trọng',
    'timeline-title':       'Chương trình chi tiết',
    'ev-time-1':            '10:30',
    'ev-time-2':            '11:00',
    'ev-time-3':            '11:30',
    'ev-time-4':            '13:30',
    'ev-welcome':           'Đón Khách',
    'ev-welcome-place':     'PhotoBooth & Backdrop',
    'ev-lunch':             'Khai Tiệc',
    'ev-ceremony':          'Nghi Thức Thành Hôn',
    'ev-reception':         'Tiệc Mừng & Giao Lưu',
    'rsvp-eyebrow':         'Kindly Reply At your convenience',
    'rsvp-title':           'Bạn Sẽ Tham Dự Chứ?',
    'label-name':           'Họ và Tên',
    'ph-name':              'Họ tên đầy đủ của bạn',
    'label-side':           'Bạn sẽ tham dự cùng ai?',
    'opt-bride-side':       'Nhà Gái',
    'opt-groom-side':       'Nhà Trai',
    'label-phone':          'Số Điện Thoại',
    'ph-phone':             'Nhập số điện thoại của bạn',
    'label-attendance':     'Tham Dự',
    'opt-select':           'Vui lòng chọn',
    'opt-yes':              'Xác Nhận Tham Dự',
    'opt-no':               'Không Tham Dự Được',
    'label-guests':         'Số Người Tham Dự',
    'ph-guests':            'Nhập số người tham dự',
    'label-dietary':        'Gửi lời nhắn đến cô dâu và chú rể',
    'ph-dietary':           'Nhắn ở đây',
    'btn-rsvp':             'Gửi Xác Nhận',
    'footer-date':          '17 Tháng 12, 2026 · Hà Nội',
    'footer-made':          'Cảm ơn bạn đã dành tình cảm cho chúng mình, sự hiện diện của bạn chính là món quà ý nghĩa nhất trong ngày vui của chúng mình.',
    'fc-names':             'Cathy & Hưng',
    'groom-name':           'Hưng',
    'family-bride-father':  'Ông Chu Đình Lương',
    'family-bride-mother':  'Bà Nguyễn Thị Hương Giang',
    'family-groom-father':  'Ông Lê Văn Sinh',
    'family-groom-mother':  'Bà Nguyễn Thị Hương',
    'family-groom-name':    'Gia Hưng',
    'family-groom-p1':      'Gia',
    'family-groom-p2':      'Hưng',
    'family-bride-name':    'Cathy Hà Linh',
    'family-bride-p1':      'Hà',
    'family-bride-p2':      'Linh',
    'date-value-main':      '17 Tháng 12',
    'venue-name':           'Long Vĩ',
    'venue-sub':            '3A Phố Đào Duy Anh, Kim Liên, Hà Nội · 12:00 trưa',
  },
};

let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key] !== undefined) el.textContent = i18n[lang][key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (i18n[lang][key] !== undefined) el.placeholder = i18n[lang][key];
  });

  langToggleBtn.textContent = lang === 'en' ? 'VI' : 'EN';
}

langToggleBtn.addEventListener('click', () => {
  setLang(currentLang === 'en' ? 'vi' : 'en');
});

window.addEventListener('beforeunload', () => {
  if (playing) {
    audio.pause();
    audio.currentTime = 0;
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (playing) {
      gsap.killTweensOf(audio);
      audio.pause();
    }
  } else {
    if (playing) {
      audio.play().catch(() => {});
      gsap.to(audio, { volume: .65, duration: 1.5, ease: 'power1.out' });
    }
  }
});


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
    side:       els['side'].value,
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

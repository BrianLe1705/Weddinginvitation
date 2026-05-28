(function () {
  'use strict';

  // Only activate on real pointer devices (desktop), not touch screens
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  /* ── Custom cursor ── */
  const cur = document.createElement('div');
  cur.id = 'custom-cursor';
  cur.textContent = '💐';
  document.body.appendChild(cur);

  /* ── Fairy sparkle config ── */
  const COLORS  = ['#C9A96E', '#E8D9B8', '#A1AF88', '#FFF5E0', '#CCD3C0', '#ffffff'];
  const RATE_MS = 30;   // ms between sparkle spawns
  let   lastT   = 0;

  function spawnSparkle(x, y) {
    const el   = document.createElement('div');
    const size = Math.random() * 5 + 2.5;           // 2.5–7.5 px
    const col  = COLORS[Math.floor(Math.random() * COLORS.length)];

    Object.assign(el.style, {
      position:      'fixed',
      left:          x + 'px',
      top:           y + 'px',
      width:         size + 'px',
      height:        size + 'px',
      background:    col,
      borderRadius:  '50%',
      pointerEvents: 'none',
      zIndex:        '99997',
      transform:     'translate(-50%, -50%)',
      boxShadow:     '0 0 ' + (size * 2) + 'px ' + col,
      opacity:       '1',
    });
    document.body.appendChild(el);

    // Give each dot a slight random drift upward
    const vx = (Math.random() - 0.5) * 2.2;
    const vy = -(Math.random() * 2.0 + 0.5);
    let   px = x, py = y, op = 1;

    (function tick() {
      px  += vx;
      py  += vy;
      op  -= 0.032;
      el.style.left    = px + 'px';
      el.style.top     = py + 'px';
      el.style.opacity = op;
      if (op > 0) requestAnimationFrame(tick);
      else        el.remove();
    }());
  }

  /* ── Track mouse ── */
  document.addEventListener('mousemove', function (e) {
    cur.style.left = e.clientX + 'px';
    cur.style.top  = e.clientY + 'px';

    const now = Date.now();
    if (now - lastT >= RATE_MS) {
      lastT = now;
      spawnSparkle(e.clientX, e.clientY);
    }
  });
}());

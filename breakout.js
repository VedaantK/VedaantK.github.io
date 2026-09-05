/*
  breakout.js — Decorative block-breaker animation in the hero section.

  AI USAGE: This file was written with Claude AI assistance. I described
  the visual effect I wanted (a bouncing ball that destroys the decorative
  bricks and changes the colour of title letters on hit) and Claude helped
  implement the canvas rendering loop, trail effect, and circle-vs-rect
  collision detection. I chose the colour scheme, ball size, speed, and
  which elements to interact with.
*/

(function () {
  const canvas = document.getElementById('breakout-canvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const hero = document.getElementById('hero');

  const NEON = ['#ff3c6e', '#00f5ff', '#ffe74c', '#39ff14', '#b04aff', '#ff6b2b'];

  // ── Ball ─────────────────────────────────────────────────────────────
  const ball = {
    x: 0, y: 0,
    vx: 2.6, vy: -2.0,
    r: 7,
    color: '#00f5ff'
  };

  // Trail: store the last N positions so we can draw a fading comet tail
  const TRAIL_LEN = 12;
  const trail = [];

  // ── Canvas sizing ─────────────────────────────────────────────────────
  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    ball.x = Math.max(ball.r, Math.min(ball.x || canvas.width  * 0.72, canvas.width  - ball.r));
    ball.y = Math.max(ball.r, Math.min(ball.y || canvas.height * 0.28, canvas.height - ball.r));
  }
  resize();
  window.addEventListener('resize', () => { trail.length = 0; resize(); });

  // ── Helpers ───────────────────────────────────────────────────────────

  // Returns the live (visible) brick elements each frame
  function liveBricks() {
    return Array.from(document.querySelectorAll('.brick')).filter(
      b => b.style.opacity !== '0' && b.offsetWidth > 0
    );
  }

  const letters = Array.from(document.querySelectorAll('.hero-letter'));

  // Nearest-point circle-vs-rect collision: true if ball touches the DOM rect
  function hits(domRect, cr) {
    if (domRect.width === 0) return false; // hidden element (e.g. mobile bricks)
    const l = domRect.left   - cr.left;
    const r = domRect.right  - cr.left;
    const t = domRect.top    - cr.top;
    const b = domRect.bottom - cr.top;
    const nx = Math.max(l, Math.min(ball.x, r));
    const ny = Math.max(t, Math.min(ball.y, b));
    const dx = ball.x - nx, dy = ball.y - ny;
    return dx * dx + dy * dy < ball.r * ball.r;
  }

  // Bounce the ball off whichever face of the rect it hit
  function bounceOff(domRect, cr) {
    const l = domRect.left   - cr.left;
    const r = domRect.right  - cr.left;
    const t = domRect.top    - cr.top;
    const b = domRect.bottom - cr.top;
    // How far the ball overlaps each edge
    const olL = ball.x - (l - ball.r);
    const olR = (r + ball.r) - ball.x;
    const olT = ball.y - (t - ball.r);
    const olB = (b + ball.r) - ball.y;
    const minH = Math.min(olL, olR);
    const minV = Math.min(olT, olB);
    if (minH < minV) ball.vx = -ball.vx;
    else             ball.vy = -ball.vy;
  }

  // ── Draw ─────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Comet trail — older positions are smaller and more transparent
    trail.forEach((pt, i) => {
      const t = (i + 1) / trail.length;
      ctx.save();
      ctx.globalAlpha = t * 0.45;
      ctx.shadowColor = pt.color;
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ball.r * t * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.restore();
    });

    // Ball — full opacity with bright glow
    ctx.save();
    ctx.shadowColor = ball.color;
    ctx.shadowBlur  = 22;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.restore();
  }

  // ── Main loop ─────────────────────────────────────────────────────────
  function tick() {
    // Move
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Store trail position (capped at TRAIL_LEN)
    trail.push({ x: ball.x, y: ball.y, color: ball.color });
    if (trail.length > TRAIL_LEN) trail.shift();

    // Wall bouncing — keep ball inside the hero
    if (ball.x - ball.r <= 0)             { ball.x = ball.r;                ball.vx =  Math.abs(ball.vx); }
    if (ball.x + ball.r >= canvas.width)  { ball.x = canvas.width  - ball.r; ball.vx = -Math.abs(ball.vx); }
    if (ball.y - ball.r <= 0)             { ball.y = ball.r;                ball.vy =  Math.abs(ball.vy); }
    if (ball.y + ball.r >= canvas.height) { ball.y = canvas.height - ball.r; ball.vy = -Math.abs(ball.vy); }

    const cr = canvas.getBoundingClientRect();

    // Brick collision — destroy brick and bounce
    liveBricks().forEach(brick => {
      if (hits(brick.getBoundingClientRect(), cr)) {
        bounceOff(brick.getBoundingClientRect(), cr);
        brick.style.transition = 'opacity 0.12s';
        brick.style.opacity    = '0';
        // Ball changes colour on each brick hit
        ball.color = NEON[Math.floor(Math.random() * NEON.length)];
      }
    });

    // Letter collision — flash a neon colour, subtle glow, no bounce
    letters.forEach(letter => {
      if (hits(letter.getBoundingClientRect(), cr)) {
        const c = NEON[Math.floor(Math.random() * NEON.length)];
        letter.style.color      = c;
        letter.style.textShadow = `0 0 6px ${c}`;
      }
    });

    // Navbar collision — ball bounces off the bottom edge of the fixed nav
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const nr = navbar.getBoundingClientRect();
      // The nav bottom edge in canvas coordinates
      const navBottom = nr.bottom - cr.top;
      if (ball.y - ball.r <= navBottom && ball.vy < 0) {
        ball.y = navBottom + ball.r;
        ball.vy = Math.abs(ball.vy);
      }
    }

    draw();
    requestAnimationFrame(tick);
  }

  tick();
})();

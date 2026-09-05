/*
  ============================================================
  main.js — Portfolio interactivity
  ============================================================
  AI USAGE: The overall structure of this file and the
  IntersectionObserver pattern for active nav highlighting were
  suggested by Claude AI. I adapted the score counter idea
  (making it increment as you scroll sections) and added the
  Konami code easter egg based on my own interests. The
  hamburger menu toggle logic I understood and kept as-is
  since it directly matched what I needed.
  ============================================================
*/

/* ── SCORE COUNTER ──────────────────────────────────────────
   Tracks a fake arcade score that increases as you explore
   the page — ties into the retro Breakout theme.          */
const scoreEl = document.getElementById('score');
let score = 0;

function incrementScore(amount = 100) {
  score += amount;
  // padStart keeps it a fixed 6-digit display (e.g. 000050)
  scoreEl.textContent = String(score).padStart(6, '0');
}

/* ── NAV ACTIVE STATE ON SCROLL ─────────────────────────────
   IntersectionObserver fires when a section enters the
   viewport and highlights the matching nav link.
   AI-assisted: I learned this pattern from Claude and kept it
   because it's cleaner than a scroll event listener.       */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-btn');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`.nav-btn[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add('active');
          incrementScore(50);
        }
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => observer.observe(s));

/* ── HAMBURGER MENU ─────────────────────────────────────────
   Toggles the nav link list open/closed on mobile.
   Closes automatically when a link is tapped.             */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

/* ── BRICK CLICK EASTER EGG ─────────────────────────────────
   Clicking any decorative brick in the hero briefly hides it
   and awards points — plays into the Breakout theme.      */
document.querySelectorAll('.brick, .pb').forEach((brick) => {
  brick.addEventListener('click', () => {
    brick.style.opacity = '0';
    brick.style.transition = 'opacity 0.1s';
    incrementScore(10);
    setTimeout(() => {
      brick.style.opacity = '1';
    }, 800);
  });
});

/* ── KONAMI CODE ─────────────────────────────────────────────
   Type ↑↑↓↓←→←→BA on the keyboard to unlock a secret
   colour-shift animation and a big score bonus.
   I added this myself as a fun easter egg for the retro theme. */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      incrementScore(9999);
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => { document.body.style.filter = ''; }, 2000);
    }
  } else {
    konamiIdx = 0;
  }
});

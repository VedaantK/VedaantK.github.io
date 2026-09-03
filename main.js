/* ── SCORE COUNTER ── */
const scoreEl = document.getElementById('score');
let score = 0;

function incrementScore(amount = 100) {
  score += amount;
  scoreEl.textContent = String(score).padStart(6, '0');
}

/* ── NAV ACTIVE STATE ON SCROLL ── */
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

/* ── BRICK CLICK EASTER EGG ── */
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

/* ── KONAMI CODE ── */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      incrementScore(9999);
      document.body.style.animation = 'none';
      document.body.style.filter = 'hue-rotate(180deg)';
      setTimeout(() => { document.body.style.filter = ''; }, 2000);
    }
  } else {
    konamiIdx = 0;
  }
});

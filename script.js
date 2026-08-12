// DOM Elements
const header         = document.querySelector('header');
const navLinks       = document.querySelector('.nav-links');
const hamburger      = document.querySelector('.hamburger');
const navLinksItems  = document.querySelectorAll('.nav-links li');
const themeToggle    = document.querySelector('.theme-toggle');
const moonIcon       = document.querySelector('.fa-moon');
const sunIcon        = document.querySelector('.fa-sun');
const contactForm    = document.getElementById('contact-form');

// Header scroll effect
window.addEventListener('scroll', () => {
  header.classList.toggle('header-scroll', window.scrollY > 50);
});

// Full-screen menu overlay (hamburger)
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
  menuOverlay.classList.add('open');
  hamburger.classList.add('active');
  document.body.classList.add('no-scroll');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  menuOverlay.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.classList.remove('no-scroll');
  hamburger.setAttribute('aria-expanded', 'false');
}
function toggleMenu() {
  if (menuOverlay.classList.contains('open')) closeMenu(); else openMenu();
}

if (hamburger && menuOverlay) {
  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });
  // Close when any overlay link is clicked
  menuOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  // Close when the backdrop (not a link) is clicked
  menuOverlay.addEventListener('click', e => { if (e.target === menuOverlay) closeMenu(); });
  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// Theme toggle (only if the elements exist)
if (themeToggle && moonIcon && sunIcon) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
      moonIcon.style.display = 'none';
      sunIcon.style.display  = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display  = 'none';
    }
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  });
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' && moonIcon && sunIcon) {
    document.body.classList.add('light-theme');
    moonIcon.style.display = 'none';
    sunIcon.style.display  = 'block';
  }

  // Animate sections
  document.querySelectorAll('section').forEach(section => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('section-animate'));
    }, { threshold: 0.1 });
    obs.observe(section);
  });
});

// Contact form handler
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = e.target.name.value.trim();
    const email   = e.target.email.value.trim();
    const subject = e.target.subject.value.trim();
    const message = e.target.message.value.trim();

    if (!name || !email || !subject || !message) {
      return alert('Please fill out all fields');
    }

    console.log('Form submitted:', { name, email, subject, message });

    // Show fake success
    contactForm.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <p>Thank you for reaching out, ${name}! I'll get back to you soon.</p>
      </div>
    `;
  });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const tgt = document.querySelector(a.getAttribute('href'));
    if (tgt) window.scrollTo({ top: tgt.offsetTop - 80, behavior: 'smooth' });
  });
});

// Hero binary type‑writer
const binary = document.querySelector('.binary');
if (binary) {
  const txt = binary.innerText;
  binary.innerText = '';
  let i = 0;
  setTimeout(function type() {
    if (i < txt.length) {
      binary.innerText += txt[i++];
      setTimeout(type, 50);
    }
  }, 1000);
}

// debug logging to confirm script ran:
console.log("🔧 DevOps keyword rotator script loaded");

document.addEventListener("DOMContentLoaded", () => {
  const keywords = [ "Deploy", "Scale", "Monitor", "Automate", "Optimize" ];
  let idx = 0;
  const el  = document.getElementById("devops-keyword");

  if (!el) {
    console.error("❌ #devops-keyword element not found!");
    return;
  }

  function rotateKeyword() {
    el.classList.remove("visible");
    setTimeout(() => {
      el.textContent = keywords[idx];
      el.classList.add("visible");
      idx = (idx + 1) % keywords.length;
    }, 500);
  }

  // run immediately, then every 3s
  rotateKeyword();
  setInterval(rotateKeyword, 3000);
});

// Animated profession — rolling triangular prism per character (kobina.me concept)
document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("heroProfessions");
  if (!host) return;

  const words = ["DevOps & Cloud Engineer", "NLP Researcher"];
  const maxLen = Math.max(...words.map(w => w.length));
  const STAGGER = 35;     // per-character delay via transition-delay
  const HOLD = 2400;      // pause between rolls
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = w => w.padEnd(maxLen, " ");
  const padded = words.map(pad);
  let cur = 0;      // index of currently shown word
  let step = 0;     // total 120deg roll steps taken

  // Build a 3-face prism per character position. Face (step % 3) is the one at
  // the front; rolling -120deg brings the next face forward.
  const cells = [];
  const first = padded[0];
  for (let i = 0; i < maxLen; i++) {
    const ch = document.createElement("span"); ch.className = "pchar";
    const cube = document.createElement("span"); cube.className = "pcube";
    const faces = [];
    for (let f = 0; f < 3; f++) {
      const face = document.createElement("span");
      face.className = "pface f" + f;
      face.textContent = f === 0 ? first[i] : " ";
      cube.appendChild(face);
      faces.push(face);
    }
    ch.appendChild(cube);
    host.appendChild(ch);
    cells.push({ cube, faces });
  }

  function roll() {
    const next = (cur + 1) % words.length;
    const nw = padded[next];
    step += 1;
    const frontFace = ((step % 3) + 3) % 3;   // face that will be at the front
    const angle = -120 * step;

    cells.forEach((c, i) => {
      // Put the new character on the face that's about to roll into view
      c.faces[frontFace].textContent = nw[i];
      if (reduce) {
        c.cube.style.transform = "rotateX(" + angle + "deg)";
      } else {
        c.cube.style.transitionDelay = (i * STAGGER) + "ms";
        c.cube.style.transform = "rotateX(" + angle + "deg)";
      }
    });

    cur = next;
    setTimeout(roll, HOLD + maxLen * STAGGER);
  }

  setTimeout(roll, HOLD);
});

// <NEBA/> logo — rolling-prism wave (same mechanism as the profession)
document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("logoWave");
  if (!link) return;

  const chars = ["<", "N", "E", "B", "A", "/", ">"];
  const isMark = c => "<>/".includes(c);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  link.innerHTML = "";
  const wrap = document.createElement("span");
  wrap.className = "logo-wave-inner";
  const cubes = [];
  chars.forEach(c => {
    const lc = document.createElement("span");
    lc.className = "lchar";
    lc.style.color = isMark(c) ? "var(--accent-color)" : "var(--text-primary)";
    const cube = document.createElement("span");
    cube.className = "lcube";
    for (let f = 0; f < 3; f++) {
      const face = document.createElement("span");
      face.className = "lface l" + f;
      face.textContent = c;
      cube.appendChild(face);
    }
    lc.appendChild(cube);
    wrap.appendChild(lc);
    cubes.push(cube);
  });
  link.appendChild(wrap);

  if (reduce) return;

  const STAGGER = 55, DURATION = 500, PAUSE = 2600;
  let step = 0;
  function wave() {
    step += 1;
    const angle = -120 * step;
    cubes.forEach((cube, i) => {
      cube.style.transitionDelay = (i * STAGGER) + "ms";
      cube.style.transform = "rotateX(" + angle + "deg)";
    });
    setTimeout(wave, PAUSE + cubes.length * STAGGER + DURATION);
  }
  setTimeout(wave, 1600);
});

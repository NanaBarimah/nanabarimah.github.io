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

// Download-resume dropdown (header)
(function () {
  const wrap   = document.getElementById('resumeDownload');
  const toggle = document.getElementById('resumeToggle');
  if (!wrap || !toggle) return;

  const open  = () => { wrap.classList.add('open');  toggle.setAttribute('aria-expanded', 'true');  };
  const close = () => { wrap.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.contains('open') ? close() : open();
  });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  wrap.querySelectorAll('.resume-menu a').forEach(a => a.addEventListener('click', close));
})();

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

// Hero Docker whale — text image with a whole-image glitch (RGB split + slice
// displacement + jitter) that triggers on hover, like the kobina.me portrait.
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("whaleGlitch");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const IMG_ASPECT = 756.26 / 596.9;
  const WORDS = "DOCKER KUBERNETES TERRAFORM AWS CICD GITOPS PROMETHEUS GRAFANA ANSIBLE HELM GOLANG PYTHON BERT PYTORCH ";
  const BLUE = "rgba(105,125,170,0.95)";   // base (slightly deeper for contrast)
  const RED  = "rgba(240,45,70,0.9)";
  const CYAN = "rgba(35,195,225,0.9)";

  let rectW = 0, rectH = 0, fontSize = 11;
  let baseBuf = null, redBuf = null, cyanBuf = null;
  let startT = 0, firstBuild = true;
  let raf = 0, lastRender = 0, hovering = false, running = false;
  let lastTick = -1, slices = [], jitter = { x: 0, y: 0 }, split = 3;
  // occupancy grid of the whale silhouette, for hover hit-testing
  let mask = null, gDx = 0, gDy = 0, gCw = 1, gChh = 1, gCols = 0, gRows = 0;

  const img = new Image();
  let imgReady = false;
  img.onload = () => { imgReady = true; build(); };
  img.src = "assets/docker-whale.svg";

  function renderBuffer(color, cells) {
    const b = document.createElement("canvas");
    b.width = rectW; b.height = rectH;
    const bx = b.getContext("2d");
    bx.textBaseline = "top";
    bx.font = "700 " + fontSize + 'px "Space Mono", ui-monospace, monospace';
    bx.fillStyle = color;
    for (let i = 0; i < cells.length; i++) bx.fillText(cells[i].ch, cells[i].x, cells[i].y);
    return b;
  }

  function build() {
    const rect = canvas.getBoundingClientRect();
    if (!imgReady || rect.width < 5) return;
    rectW = Math.round(rect.width); rectH = Math.round(rect.height);
    // dpr = 1: the whale is a subtle background; keeps the glitch cheap
    canvas.width = rectW; canvas.height = rectH;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    let dw, dh;
    if (rectW / rectH > IMG_ASPECT) { dh = rectH; dw = dh * IMG_ASPECT; }
    else { dw = rectW; dh = dw / IMG_ASPECT; }
    const dx = (rectW - dw) / 2, dy = (rectH - dh) / 2;

    fontSize = Math.max(9, Math.round(dw / 74));
    const cw = fontSize * 0.62, chh = fontSize * 1.15;
    const cols = Math.floor(dw / cw), rows = Math.floor(dh / chh);

    // sample the whale silhouette
    const off = document.createElement("canvas");
    off.width = rectW; off.height = rectH;
    const octx = off.getContext("2d");
    octx.drawImage(img, dx, dy, dw, dh);
    const data = octx.getImageData(0, 0, rectW, rectH).data;

    // remember the grid mapping so we can hit-test the pointer against the shape
    gDx = dx; gDy = dy; gCw = cw; gChh = chh; gCols = cols; gRows = rows;
    mask = new Uint8Array(cols * rows);

    const cells = [];
    let wi = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = Math.floor(dx + c * cw + cw / 2);
        const py = Math.floor(dy + r * chh + chh / 2);
        if (px < 0 || py < 0 || px >= rectW || py >= rectH) continue;
        if (data[(py * rectW + px) * 4 + 3] > 70) {
          mask[r * cols + c] = 1;
          cells.push({ x: dx + c * cw, y: dy + r * chh, ch: WORDS[wi % WORDS.length] });
          wi++;
        }
      }
    }

    baseBuf = renderBuffer(BLUE, cells);
    redBuf = renderBuffer(RED, cells);
    cyanBuf = renderBuffer(CYAN, cells);

    startT = firstBuild ? performance.now() : (performance.now() - 3000);
    firstBuild = false;
    if (reduce) { drawClean(1); return; }
    ensureRunning();
  }

  function ensureRunning() {
    if (running) return;
    running = true;
    lastRender = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }

  // Global RGB split + micro jitter every tick (the constant chromatic shake);
  // most slices stay put, a few tear sideways for the occasional datamosh.
  function updateGlitch(now) {
    const t = Math.floor(now / 70);
    if (t === lastTick) return;
    lastTick = t;
    split = 3 + Math.random() * 3;                                  // 3–6px chromatic offset
    jitter = { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 1.5 };
    slices = [];
    let y = 0;
    while (y < rectH) {
      const h = 8 + Math.floor(Math.random() * 34);
      const dx = Math.random() < 0.16 ? (Math.random() * 2 - 1) * (6 + Math.random() * 22) : 0;
      slices.push({ y: y, h: Math.min(h, rectH - y), dx: dx });
      y += h;
    }
    if (Math.random() < 0.10) { split += 4; jitter.x *= 2.5; }      // occasional big jump
  }

  function drawClean(alpha) {
    ctx.clearRect(0, 0, rectW, rectH);
    ctx.globalAlpha = alpha;
    ctx.drawImage(baseBuf, 0, 0);
    ctx.globalAlpha = 1;
  }

  function drawGlitch() {
    ctx.clearRect(0, 0, rectW, rectH);
    const jx = jitter.x, jy = jitter.y, S = split;
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i];
      const dx = jx + s.dx, dy = jy + s.y;
      // red ghost left, cyan ghost right, then the base on top (chromatic split)
      ctx.globalAlpha = 0.9;
      ctx.drawImage(redBuf,  0, s.y, rectW, s.h, dx - S, dy, rectW, s.h);
      ctx.drawImage(cyanBuf, 0, s.y, rectW, s.h, dx + S, dy, rectW, s.h);
      ctx.globalAlpha = 1;
      ctx.drawImage(baseBuf, 0, s.y, rectW, s.h, dx, dy, rectW, s.h);
    }
  }

  function draw(now) {
    if (now - lastRender < 33) { raf = requestAnimationFrame(draw); return; }  // ~30fps
    lastRender = now;

    const fade = Math.min(1, (now - startT) / 1100);
    const fadingIn = fade < 1;

    if (hovering && !fadingIn) {
      updateGlitch(now);
      drawGlitch();
    } else {
      drawClean(fade);
    }

    if (fadingIn || hovering) {
      raf = requestAnimationFrame(draw);
    } else {
      running = false;   // settle on the clean frame and stop
    }
  }

  // Glitch only while the pointer is over the whale silhouette itself (not the
  // whole hero). Hit-tests the live pointer against the occupancy mask, so it
  // reliably stops the moment the cursor leaves the shape / window.
  function setHover(on) {
    if (on) { if (!hovering) { hovering = true; ensureRunning(); } }
    else { hovering = false; }
  }
  function overWhale(cx, cy) {
    if (!mask) return false;
    const rect = canvas.getBoundingClientRect();
    if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) return false;
    const x = cx - rect.left, y = cy - rect.top;   // canvas renders at dpr=1
    const c = Math.floor((x - gDx) / gCw), r = Math.floor((y - gDy) / gChh);
    for (let rr = r - 1; rr <= r + 1; rr++) {
      for (let cc = c - 1; cc <= c + 1; cc++) {
        if (rr >= 0 && rr < gRows && cc >= 0 && cc < gCols && mask[rr * gCols + cc]) return true;
      }
    }
    return false;
  }
  if (!reduce) {
    window.addEventListener("pointermove", e => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      setHover(overWhale(e.clientX, e.clientY));
    }, { passive: true });
    window.addEventListener("blur", () => setHover(false));
    document.addEventListener("mouseleave", () => setHover(false));
  }

  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(build, 200);
  });
  window.addEventListener("load", build);
});

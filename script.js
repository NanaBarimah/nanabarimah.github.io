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

// Mobile Navigation
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('nav-active');
  hamburger.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
});

// Close mobile menu on link click
navLinksItems.forEach(item => {
  item.addEventListener('click', () => {
    if (navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  });
});

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

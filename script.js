// =============================================
//   MR PAN VLOGS — JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // ---- Active Nav Link on Scroll ----
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ---- Hamburger Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Counter Animation ----
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counterEls.forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 2000);
      });
    }
  }

  window.addEventListener('scroll', startCounters);
  startCounters(); // run on load too

  // ---- Scroll Reveal Animation ----
  const revealElements = document.querySelectorAll(
    '.video-card, .blog-card, .contact-card, .about-image-wrap, .about-content, .skill-tag, .section-header'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Video Card Click (placeholder) ----
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.video-title')?.textContent;
      // In a real site, link to actual YouTube video URL
      window.open('https://www.youtube.com/@MrPanVlogs', '_blank');
    });
  });

  // ---- Contact Form Submit ----
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> পাঠানো হচ্ছে...';
      btn.disabled = true;

      // Simulate form submit (replace with real backend/formspree)
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Message পাঠান';
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1500);
    });
  }

  // ---- Floating Cards Parallax ----
  const floatCards = document.querySelectorAll('.float-card');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    floatCards.forEach((card, i) => {
      const factor = (i % 2 === 0) ? 1 : -1;
      card.style.transform = `translate(${x * factor * 0.5}px, ${y * factor * 0.5}px)`;
    });
  });

  // ---- Page Load Animation ----
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 50);

  console.log('🎬 Mr Pan Vlogs website loaded! Welcome!');
});

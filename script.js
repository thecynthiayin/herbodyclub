/* ============================================================
   HER BODY CLUB — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ----------------------------- */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Show floating CTA after scrolling past hero
    const floatingCta = document.getElementById('floatingCta');
    if (floatingCta) {
      if (window.scrollY > window.innerHeight * 0.8) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ---- Mobile hamburger menu ---------------------------- */
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger)   hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  // Close menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
  });


  /* ---- Active nav link on scroll ----------------------- */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.btn)');

  const activateNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', activateNav, { passive: true });
  activateNav();


  /* ---- Scroll-reveal animation -------------------------- */
  const revealTargets = document.querySelectorAll(
    '.section-title, .eyebrow, .hero-eyebrow, .hero-headline, ' +
    '.hero-sub, .hero-tagline, .pain-list li, .focus-list li, ' +
    '.included-card, .fit-list li, .fit-note, .transform-card, ' +
    '.testimonial-card, .step-card, .faq-item, .about-quote, ' +
    '.section-body, .cta-label, .cta-body, .focus-subhead, ' +
    '.focus-image-placeholder, .about-image-placeholder'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => observer.observe(el));


  /* ---- Staggered child reveals -------------------------- */
  const staggerGroups = [
    '.pain-list',
    '.included-grid',
    '.proof-grid',
    '.band-grid',
    '.testimonials',
    '.steps-grid',
    '.focus-list',
    '.fit-list',
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach(group => {
      group.querySelectorAll('.reveal').forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.08}s`;
      });
    });
  });


  /* ---- FAQ smooth open/close ---------------------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Close other open items
        document.querySelectorAll('.faq-item[open]').forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });


  /* ---- Results lightbox --------------------------------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const closeLb = () => { lightbox.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; };
    document.querySelectorAll('.transform-photo-wrap[data-full]').forEach(btn => {
      btn.addEventListener('click', () => {
        lbImg.src = btn.dataset.full;
        lbImg.alt = btn.querySelector('img').alt;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', closeLb);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLb(); });
  }


  /* ---- Smooth CTA button click feedback ----------------- */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:0; height:0;
        left:${e.clientX - rect.left}px;
        top:${e.clientY - rect.top}px;
        background:rgba(255,255,255,0.2);
        transform:translate(-50%,-50%);
        animation:ripple 0.6s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* Inject ripple keyframe */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { width: 300px; height: 300px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);

});


/**
 * Pastel da Vila - Interactive & Responsive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    const setMenuState = (isOpen) => {
      navMenu.classList.toggle('open', isOpen);
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('open');
      setMenuState(isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuState(false);
        mobileToggle.focus();
      }
    });
  }

  // 2. Active Menu Spy on Scroll (Throttled via requestAnimationFrame to avoid layout thrashing)
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-item');
  let isNavUpdating = false;

  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });

    isNavUpdating = false;
  }

  window.addEventListener('scroll', () => {
    if (!isNavUpdating) {
      isNavUpdating = true;
      requestAnimationFrame(updateActiveNav);
    }
  }, { passive: true });

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. WhatsApp Order Assistant
  // WhatsApp oficial: Ourinhos-SP (14) 99853-6770
  const WHATSAPP_NUMBER = '5514998536770';

  window.sendWhatsAppOrder = function (itemName = '', itemPrice = '') {
    let message = 'Olá, Pastel da Vila! ';
    if (itemName) {
      message += `Gostaria de pedir o delicioso *${itemName}*`;
      if (itemPrice) {
        message += ` (${itemPrice})`;
      }
      message += '. Como posso finalizar o pedido para retirada ou entrega?';
    } else {
      message += 'Gostaria de ver o cardápio do dia e fazer meu pedido!';
    }

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Add click handlers for WhatsApp buttons
  const orderButtons = document.querySelectorAll('[data-order-item]');
  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const item = btn.getAttribute('data-order-item');
      const price = btn.getAttribute('data-order-price');
      window.sendWhatsAppOrder(item, price);
    });
  });

  // 5. Video Autoplay Fallback
  const heroVideo = document.querySelector('.hero-pastel-img-box video');
  if (heroVideo) {
    heroVideo.play().catch(() => {});
  }
});

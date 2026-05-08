(() => {
  const nav = document.querySelector('#site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionMarkers = document.querySelectorAll('.section-observe');
  const revealItems = document.querySelectorAll('.reveal-on-scroll');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-img');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('.photo-item')).filter((item) => item.querySelector('img'));
  let activeImageIndex = 0;

  const setSolidNav = () => {
    nav?.classList.toggle('solid', window.scrollY > 60);
  };

  const closeMenu = () => {
    nav?.classList.remove('menu-active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  const openMenu = () => {
    nav?.classList.add('menu-active');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    const lightboxIsOpen = lightbox?.classList.contains('open');

    if (event.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }

    if (!lightboxIsOpen) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showLightboxImage(activeImageIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showLightboxImage(activeImageIndex + 1);
    }
  });

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    : null;

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    if (revealObserver) {
      revealObserver.observe(item);
    } else {
      item.classList.add('is-visible');
    }
  });

  if ('IntersectionObserver' in window && sectionMarkers.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const activeSection = visible.target.dataset.section;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeSection}`);
      });
    }, { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -55% 0px' });

    sectionMarkers.forEach((section) => sectionObserver.observe(section));
  }

  function showLightboxImage(index) {
    if (!lightboxImage || !galleryItems.length) return;

    activeImageIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeImageIndex];
    const image = item.querySelector('img');
    if (!image) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || item.dataset.category || 'Portfolio image';

    if (lightboxCaption) {
      lightboxCaption.textContent = item.dataset.category || image.alt || '';
    }
  }

  const openLightbox = (index) => {
    if (!lightbox || !lightboxImage || !galleryItems.length) return;

    showLightboxImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    lightboxClose?.focus();
  };

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;

    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');
    document.body.classList.remove('menu-open');
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxPrev?.addEventListener('click', (event) => {
    event.stopPropagation();
    showLightboxImage(activeImageIndex - 1);
  });

  lightboxNext?.addEventListener('click', (event) => {
    event.stopPropagation();
    showLightboxImage(activeImageIndex + 1);
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  setSolidNav();
  window.addEventListener('scroll', setSolidNav, { passive: true });
})();

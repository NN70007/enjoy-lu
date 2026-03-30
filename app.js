/**
 * enjoy.lu — App JavaScript
 * Language toggle, dark mode, smooth scroll, mobile menu, scroll animations
 */

(function () {
  'use strict';

  // ── State ──
  let currentLang = 'fr';
  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const mobileNav = document.getElementById('mobile-nav');

  // ── THEME TOGGLE ──
  function setTheme(theme) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  setTheme(currentTheme);

  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // ── LANGUAGE TOGGLE ──
  function setLang(lang) {
    currentLang = lang;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    // Update toggle button styling
    const frEl = document.querySelector('[data-lang-fr]');
    const enEl = document.querySelector('[data-lang-en]');
    if (frEl && enEl) {
      frEl.classList.toggle('lang-active', lang === 'fr');
      enEl.classList.toggle('lang-active', lang === 'en');
    }
  }

  const langBtn = document.querySelector('[data-lang-toggle]');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setLang(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  // ── MOBILE MENU ──
  const mobileOpenBtn = document.querySelector('[data-mobile-menu-open]');
  const mobileCloseBtn = document.querySelector('[data-mobile-menu-close]');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  function openMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ── HEADER SCROLL BEHAVIOR ──
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 80) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > 300) {
      if (scrollY > lastScrollY + 10) {
        header.classList.add('site-header--hidden');
      } else if (scrollY < lastScrollY - 10) {
        header.classList.remove('site-header--hidden');
      }
    } else {
      header.classList.remove('site-header--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // ── SCROLL ANIMATIONS (IntersectionObserver) ──
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── SMOOTH SCROLL FOR NAV LINKS ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

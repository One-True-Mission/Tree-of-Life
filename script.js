/* =========================================================
   TREE OF LIFE TREE SERVICES - script.js
   Three independent modules (each in its own IIFE so a failure
   in one cannot break the others):
     1. Premium hamburger menu (slide-in panel + backdrop + scroll lock)
     2. Gallery carousel (5-state class-driven peek pattern, 2s auto)
     3. Nav scroll state
   ========================================================= */

'use strict';

/* ===== 1. HAMBURGER MENU ===== */
(function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var backdrop = document.getElementById('navBackdrop');
  if (!hamburger || !navLinks) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    navLinks.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    hamburger.classList.remove('is-open');
    navLinks.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    if (navLinks.classList.contains('is-open')) closeMenu();
    else openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  /* Close menu when a nav link is clicked */
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* Close menu on ESC */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMenu();
  });

  /* Close menu if user resizes back to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && navLinks.classList.contains('is-open')) closeMenu();
  });
})();

/* ===== 2. GALLERY CAROUSEL =====
   5-state class system for clean linear right-to-left motion:
     is-far-left   = exiting off-screen left (opacity 0)
     is-prev       = left peek (opacity 0.7, scale 0.82)
     is-active     = center feature (opacity 1, scale 1, lime ring)
     is-next       = right peek (opacity 0.7, scale 0.82)
     is-far-right  = staged off-screen right (opacity 0)
   Slides cycle through these positions linearly.
*/
(function () {
  var carousel = document.getElementById('carousel');
  var track = document.getElementById('carTrack');
  var dotsWrap = document.getElementById('carDots');
  if (!carousel || !track || !dotsWrap) return;

  var slides = track.querySelectorAll('.car-slide');
  var total = slides.length;
  if (total === 0) return;

  var current = 0;
  var autoInterval = null;
  var ROTATE_MS = 2000;
  var half = Math.floor(total / 2);

  /* ---- build pagination dots ---- */
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.className = 'car-dot';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.dataset.index = i;
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function (e) {
      goTo(parseInt(e.currentTarget.dataset.index, 10));
      restartAuto();
    });
    dotsWrap.appendChild(dot);
  }

  /* ---- core update: assign one of 5 classes by relative index ---- */
  function update() {
    slides.forEach(function (slide, idx) {
      var rel = (idx - current + total) % total;
      slide.classList.remove('is-far-left', 'is-prev', 'is-active', 'is-next', 'is-far-right');
      if (rel === 0) slide.classList.add('is-active');
      else if (rel === 1) slide.classList.add('is-next');
      else if (rel === total - 1) slide.classList.add('is-prev');
      else if (rel <= half) slide.classList.add('is-far-right');
      else slide.classList.add('is-far-left');
    });

    dotsWrap.querySelectorAll('.car-dot').forEach(function (d, idx) {
      d.classList.toggle('is-active', idx === current);
    });
  }

  function goTo(idx) {
    current = (idx + total) % total;
    update();
  }

  /* ---- auto-rotation ---- */
  function startAuto() {
    stopAuto();
    autoInterval = setInterval(function () {
      goTo(current + 1);
    }, ROTATE_MS);
  }
  function stopAuto() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  /* ---- manual controls ---- */
  var prevBtn = carousel.querySelector('.car-prev');
  var nextBtn = carousel.querySelector('.car-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); restartAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); restartAuto(); });

  /* ---- click a peek slide to jump to it ---- */
  slides.forEach(function (slide, idx) {
    slide.addEventListener('click', function () {
      if (idx !== current) {
        goTo(idx);
        restartAuto();
      }
    });
  });

  /* ---- keyboard arrows (when focus is not on a form field) ---- */
  document.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.key === 'ArrowLeft') { goTo(current - 1); restartAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); restartAuto(); }
  });

  /* ---- touch / swipe ---- */
  var startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var endX = e.changedTouches[0].clientX;
    var diff = startX - endX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
    startAuto();
  });

  /* ---- pause on hover, resume on leave ---- */
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  /* ---- initial paint + auto-start ---- */
  update();
  startAuto();
})();

/* ===== 3. NAV SCROLL STATE ===== */
(function () {
  var nav = document.getElementById('siteNav');
  if (!nav) return;
  var onScroll = function () {
    if (window.scrollY > 30) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
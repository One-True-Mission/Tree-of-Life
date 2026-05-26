/* =========================================================
   TREE OF LIFE TREE SERVICES - script.js
   Three independent modules (each in its own IIFE so a failure
   in one cannot break the others):
     1. Hamburger menu
     2. Gallery carousel (class-driven peek pattern, 2s auto)
     3. Nav scroll state
   ========================================================= */

'use strict';

/* ===== 1. HAMBURGER ===== */
(function () {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
    });
  });
})();

/* ===== 2. GALLERY CAROUSEL =====
   No pixel math, no flex layout. CSS handles all positioning
   via three classes: is-prev / is-active / is-next. JS only
   toggles which slide gets which class.
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

  /* ---- core update: just toggle classes ---- */
  function update() {
    var prevIdx = (current - 1 + total) % total;
    var nextIdx = (current + 1) % total;

    slides.forEach(function (slide, idx) {
      slide.classList.remove('is-prev', 'is-active', 'is-next');
      if (idx === current) slide.classList.add('is-active');
      else if (idx === prevIdx) slide.classList.add('is-prev');
      else if (idx === nextIdx) slide.classList.add('is-next');
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
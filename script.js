/* =========================================================
   TREE OF LIFE TREE SERVICES - script.js
   Hamburger, carousel, smooth scroll
   ========================================================= */

(function () {
  'use strict';

  /* ----- HAMBURGER ----- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
      });
    });
  }

  /* ----- GALLERY CAROUSEL ----- */
  var track = document.getElementById('carTrack');
  var dotsWrap = document.getElementById('carDots');
  var carousel = document.getElementById('carousel');

  if (track && dotsWrap && carousel) {
    var slides = track.querySelectorAll('.car-slide');
    var total = slides.length;
    var current = 0;

    // Build dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'car-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.dataset.index = i;
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function (e) {
        goTo(parseInt(e.currentTarget.dataset.index, 10));
      });
      dotsWrap.appendChild(dot);
    }

    function update() {
      track.style.transform = 'translateX(' + (-current * 100) + '%)';
      dotsWrap.querySelectorAll('.car-dot').forEach(function (d, idx) {
        d.classList.toggle('is-active', idx === current);
      });
    }

    function goTo(idx) {
      current = (idx + total) % total;
      update();
    }

    carousel.querySelector('.car-prev').addEventListener('click', function () {
      goTo(current - 1);
    });
    carousel.querySelector('.car-next').addEventListener('click', function () {
      goTo(current + 1);
    });

    // Keyboard arrow support when carousel is focused area
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch / swipe support
    var startX = 0;
    var endX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      endX = e.changedTouches[0].clientX;
      var diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goTo(current + 1);
        else goTo(current - 1);
      }
    });

    // Auto-advance, pauses on hover
    var auto = setInterval(function () { goTo(current + 1); }, 6500);
    carousel.addEventListener('mouseenter', function () { clearInterval(auto); });
  }

  /* ----- NAV SHADOW ON SCROLL ----- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 30) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
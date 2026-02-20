import $ from 'jquery';

export function initAnimations() {
  initCountUp();
  initScrollReveal();
  initBackToTop();
}

function initCountUp() {
  let counted = false;
  const $statsSection = $('.hero-stats');

  function countUp() {
    if (counted || !$statsSection.length) return;

    const scrollPos = $(window).scrollTop() + $(window).height();
    const sectionPos = $statsSection.offset().top + 100;

    if (scrollPos > sectionPos) {
      counted = true;
      $('[data-count]').each(function () {
        const $el = $(this);
        const target = parseInt($el.data('count'), 10);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          $el.text(Math.floor(current));
        }, 16);
      });
    }
  }

  $(window).on('scroll', countUp);
  countUp();
}

function initScrollReveal() {
  const revealElements = [
    '.service-card',
    '.process-step',
    '.work-card',
    '.testimonial-card',
    '.contact-info',
    '.contact-form-wrapper'
  ];

  revealElements.forEach(function (selector) {
    $(selector).addClass('reveal');
  });

  function checkReveal() {
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    $('.reveal').each(function () {
      const $el = $(this);
      const elTop = $el.offset().top;
      if (scrollTop + windowHeight > elTop + 60) {
        $el.addClass('active');
      }
    });
  }

  $(window).on('scroll', checkReveal);
  checkReveal();
}

function initBackToTop() {
  const $btn = $('#backToTop');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $btn.addClass('visible');
    } else {
      $btn.removeClass('visible');
    }
  });

  $btn.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });
}

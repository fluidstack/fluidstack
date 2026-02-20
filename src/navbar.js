const $ = window.jQuery;

export function initNavbar() {
  const $navbar = $('#mainNav');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }
  });

  $('.navbar-nav .nav-link, .scroll-indicator a, .hero-cta a[href^="#"], .footer-links a[href^="#"]').on('click', function (e) {
    const target = $(this).attr('href');
    if (target && target.startsWith('#')) {
      e.preventDefault();
      const $target = $(target);
      if ($target.length) {
        $('html, body').animate({
          scrollTop: $target.offset().top - 80
        }, 600, 'swing');
      }
      const $toggler = $('.navbar-toggler');
      if ($toggler.is(':visible')) {
        const collapse = bootstrap.Collapse.getInstance($('#navbarNav')[0]);
        if (collapse) collapse.hide();
      }
    }
  });
}

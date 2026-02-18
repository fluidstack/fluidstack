$(window).load(function () {
    $(document).on("scroll", onScroll);

    //smoothscroll
    $('.sf-menu').find('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        $(this).addClass('current');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top + 2
        }, 1000, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('.sf-menu').find('a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.length > 0) {
            if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.sf-menu').find('li').removeClass("current");
                currLink.parent().addClass("current");
            }
            else {
                currLink.removeClass("current");
            }
        }
    });
}
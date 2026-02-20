import $ from 'jquery';

export function initPortfolio() {
  const $filterBtns = $('.filter-btn');
  const $workItems = $('.work-item');

  $filterBtns.on('click', function () {
    const filter = $(this).data('filter');

    $filterBtns.removeClass('active');
    $(this).addClass('active');

    $workItems.each(function () {
      const $item = $(this);
      const category = $item.data('category');

      if (filter === 'all' || category === filter) {
        $item.removeClass('hidden').css('opacity', 0).animate({ opacity: 1 }, 400);
      } else {
        $item.animate({ opacity: 0 }, 200, function () {
          $item.addClass('hidden');
        });
      }
    });
  });
}

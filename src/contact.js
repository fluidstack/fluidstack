import $ from 'jquery';

export function initContact() {
  const $form = $('#contactForm');
  const $submitBtn = $('#submitBtn');
  const $btnText = $submitBtn.find('.btn-text');
  const $btnLoader = $submitBtn.find('.btn-loader');
  const $success = $('#formSuccess');
  const $error = $('#formError');

  $form.on('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    $success.addClass('d-none');
    $error.addClass('d-none');

    const name = $('#nameInput').val().trim();
    const email = $('#emailInput').val().trim();
    const phone = $('#phoneInput').val().trim();
    const service = $('#serviceSelect').val();
    const message = $('#messageInput').val().trim();
    const website = $('#websiteInput').val();

    let valid = true;

    if (!name) {
      $('#nameInput').addClass('is-invalid');
      valid = false;
    } else {
      $('#nameInput').removeClass('is-invalid');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      $('#emailInput').addClass('is-invalid');
      valid = false;
    } else {
      $('#emailInput').removeClass('is-invalid');
    }

    if (!message || message.length < 20) {
      $('#messageInput').addClass('is-invalid');
      valid = false;
    } else {
      $('#messageInput').removeClass('is-invalid');
    }

    if (!valid) return;

    $btnText.addClass('d-none');
    $btnLoader.removeClass('d-none');
    $submitBtn.prop('disabled', true);

    $.ajax({
      url: 'php/send-email.php',
      type: 'POST',
      dataType: 'json',
      data: { name, email, phone, service, message, website },
      success: function (response) {
        if (response.success) {
          $success.removeClass('d-none');
          $form[0].reset();
          $form.find('.is-invalid').removeClass('is-invalid');
        } else {
          $error.removeClass('d-none');
        }
      },
      error: function () {
        $error.removeClass('d-none');
      },
      complete: function () {
        $btnText.removeClass('d-none');
        $btnLoader.addClass('d-none');
        $submitBtn.prop('disabled', false);
      }
    });
  });

  $form.find('.form-control, .form-select').on('input change', function () {
    $(this).removeClass('is-invalid');
  });
}

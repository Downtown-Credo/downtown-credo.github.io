$(function ($) {
  $('.popup').on('click', function() {
    var form = $(this).data('form');
    $('*[data-id="' + form + '"]')
      .removeAttr('style')
      .css('display', 'flex');
  });

  $('.x').on('click', function() {
    $(this).parents('.form-pop').css('display', 'none');
  })

  $("#datepicker").datepicker({});
})(jQuery);

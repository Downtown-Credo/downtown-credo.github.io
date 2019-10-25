jQuery('.popup').on('click', function() {
  var form = $(this).data('form');
  jQuery('*[data-id="' + form + '"]').css('display', 'flex');
});

jQuery('.x').on('click', function() {
  jQuery(this).parents('.form-pop').css('display', 'none');
})

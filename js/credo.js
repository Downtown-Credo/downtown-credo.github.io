(function ($) {
  'use strict'

  $('.popup').on('click', function() {
    var form = $(this).data('form');
    $('*[data-id="' + form + '"]')
      .removeAttr('style')
      .css('display', 'flex');
  });

  $('.x').on('click', function() {
    var $container = $(this).parents('.form-pop');
    var $form = $container.find('form');
    var $submit = $(':submit', $form);

    // Hide and reset form.
    $container.css('display', 'none');
    $submit
      .removeAttr('style')
      .prop('value', 'Submit')
      .prop('disabled', false)
      .show();
    $form.show().siblings().hide();
  })

  $("#datepicker").datepicker({});

  $('*[data-post="slack"]').submit(function(e) {
    var $form = $(this);
    var $container = $form.parents('.form-pop');
    var $done = $('.w-form-done', $container);
    var $fail = $('.w-form-fail', $container);
    var $submit = $(':submit', $form);

    $submit
      .css('background-color', '#ddd')
      .prop('value', $submit.data('wait'))
      .prop('disabled', true)
      .hide();

    var v = $(this).serializeArray().reduce(function(a, i) {
      a[i.name] = i.value;
      return a;
    }, {});

    var body = {};
    body['firstname'] = v['First-Name'] || '';
    body['lastname'] = v['Last-Name'] || '';
    body['phone'] = v['Phone'] || '';
    body['email'] = v['Email'] || '';
    body['date'] = v['Event-date'] || '';
    body['start'] = v['Start-time'] || '';
    body['end'] = v['End-time'] || '';
    body['space'] = v['Choose-Space'] || '';
    body['coffee'] = v['coffee'] || '';
    body['espresso'] = v['espresso'] || '';
    body['barista'] = v['barista'] || '';
    body['guests'] = v['Guests'] || '';
    body['notes'] = v['Notes'] || '';
    body['name'] = $(this).data('name');
    body['channel'] = $(this).data('channel');
    body['icon'] = $(this).data('icon');

    $.post('https://9jkbtkjdj8.execute-api.us-east-1.amazonaws.com/dev/postSlack', JSON.stringify(body))
      .always(function() {
        $form.hide();
      })
      .done(function() {
        $done.show();
      })
      .fail(function() {
        $fail.show();
      });

    e.preventDefault();
  });
})(jQuery);

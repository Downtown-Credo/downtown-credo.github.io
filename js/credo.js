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

  var supportsAudio = !!document.createElement('audio').canPlayType;
  if (supportsAudio) {
      // initialize plyr
      var player = new Plyr('#audio1', {
          controls: [
              'restart',
              'play',
              'progress',
              'current-time',
              'duration',
              'mute',
              'volume',
              'download'
          ]
      });
      // initialize playlist and controls
      var index = 0,
          playing = false,
          tracks = [],
          trackCount = 0,
          buildPlaylist = $.getJSON('/podcasts.json', function(data) {
            tracks = data.podcasts;
            trackCount = tracks.length;
            $.each(data.podcasts, function(key, value) {
              var trackName = value.name,
                  trackDuration = value.duration;
              $('#plList').append('<li> \
                  <div class="plItem"> \
                      <span class="plTitle">' + trackName + '</span> \
                      <span class="plLength">' + trackDuration + '</span> \
                  </div> \
              </li>');
            });
          })
          .done(function() {
            loadTrack(index);
          }),
          npAction = $('#npAction'),
          npTitle = $('#npTitle'),
          audio = $('#audio1').on('play', function () {
              playing = true;
              npAction.text('Now Playing...');
          }).on('pause', function () {
              playing = false;
              npAction.text('Paused...');
          }).on('ended', function () {
              npAction.text('Paused...');
              if ((index + 1) < trackCount) {
                  index++;
                  loadTrack(index);
                  audio.play();
              } else {
                  audio.pause();
                  index = 0;
                  loadTrack(index);
              }
          }).get(0),
          btnPrev = $('#btnPrev').on('click', function () {
              if ((index - 1) > -1) {
                  index--;
                  loadTrack(index);
                  if (playing) {
                      audio.play();
                  }
              } else {
                  audio.pause();
                  index = 0;
                  loadTrack(index);
              }
          }),
          btnNext = $('#btnNext').on('click', function () {
              if ((index + 1) < trackCount) {
                  index++;
                  loadTrack(index);
                  if (playing) {
                      audio.play();
                  }
              } else {
                  audio.pause();
                  index = 0;
                  loadTrack(index);
              }
          }),
          li = $('#plList').on('click', 'li', function () {
              var id = parseInt($(this).index());
              if (id !== index) {
                  playTrack(id);
              }
          }),
          loadTrack = function (id) {
              $('.plSel').removeClass('plSel');
              $('#plList li:eq(' + id + ')').addClass('plSel');
              npTitle.text(tracks[id].name);
              index = id;
              audio.src = tracks[id].file;
              updateDownload(id, audio.src);
          },
          updateDownload = function (id, source) {
              player.on('loadedmetadata', function () {
                  $('a[data-plyr="download"]').attr('href', source);
              });
          },
          playTrack = function (id) {
              loadTrack(id);
              audio.play();
          };
  } else {
      // no audio support
      $('.column').addClass('hidden');
      var noSupport = $('#audio1').text();
      $('.container').append('<p class="no-support">' + noSupport + '</p>');
  }
})(jQuery);

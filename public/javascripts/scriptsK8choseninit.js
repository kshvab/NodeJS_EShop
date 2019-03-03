$(window).on('load', function() {
  $('.city-select').chosen({
    no_results_text: 'Вариантов не найдено!',
    width: '100%'
  });

  $('.department-select').chosen({
    no_results_text: 'Вариантов не найдено!',
    width: '100%'
  });
});

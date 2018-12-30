//AUTH toggle forms
$(function() {
  // toggle
  var flag = true;
  $('.switch-button').on('click', function(e) {
    e.preventDefault();
    console.log('AAA');
    if (flag) {
      flag = false;
      $('.register').show('slow');
      $('.login').hide();
    } else {
      flag = true;
      $('.login').show('slow');
      $('.register').hide();
    }
  });
});

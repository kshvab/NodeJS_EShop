//AUTH toggle forms
$(function() {
  // toggle
  var flag = true;
  $('.switch-button').on('click', function(e) {
    e.preventDefault();
    console.log('AAA');
    if (flag) {
      flag = false;
      $('#mainRegisterPanel').show('slow');
      $('#mainLoginPanel').hide();
    } else {
      flag = true;
      $('#mainLoginPanel').show('slow');
      $('#mainRegisterPanel').hide();
    }
  });
});

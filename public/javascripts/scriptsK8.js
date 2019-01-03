/* eslint-disable no-undef */

$(function() {
  //AUTH toggle forms
  var flag = true;
  $('.switch-button').on('click', function(e) {
    e.preventDefault();
    $('input').val('');
    $('input').removeClass('is-invalid');
    $('input').removeClass('is-valid');
    $('#register-error-msg').html('');
    $('#login-error-msg').html('');

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

  // register
  $('#register-button').on('click', function(e) {
    e.preventDefault();

    var data = {
      name: $('#register-name').val(),
      email: $('#register-email').val(),
      login: $('#register-login').val(),
      password: $('#register-password').val(),
      passwordConfirm: $('#register-password-confirm').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/register'
    }).done(function(data) {
      $('input').removeClass('is-invalid');
      $('input').addClass('is-valid');
      console.log(data);

      if (!data.ok) {
        $('#register-error-msg').html(
          '<p class="text-warning">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#' + id).removeClass('is-valid');
            $('#' + id).addClass('is-invalid');
          });
        }
      } else {
        $('#register-error-msg').html('<p class="text-success">Отлично!</p>');
      }
    });
  });

  // register
  $('#login-button').on('click', function(e) {
    e.preventDefault();
    var data = {
      login: $('#login-login').val(),
      password: $('#login-password').val()
    };
    console.log(data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/login'
    }).done(function(data) {
      console.log(data);
      $('input').removeClass('is-invalid');
      $('input').addClass('is-valid');
      if (!data.ok) {
        $('#login-error-msg').html(
          '<p class="text-warning">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#' + id).removeClass('is-valid');
            $('#' + id).addClass('is-invalid');
          });
        }
      } else {
        $('#login-error-msg').html('<p class="text-success">Отлично!</p>');
      }
    });
  });
});

/* eslint-enable no-undef */

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
      phonenumber: $('#register-phonenumber').val(),
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
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#' + id).removeClass('is-valid');
            $('#' + id).addClass('is-invalid');
          });
        }
      } else {
        //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
        $(location).attr('href', '/');
      }
    });
  });
  $('#register-password-confirm').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#register-button')
        .focus()
        .click();
      return false;
    }
  });

  // login
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
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#' + id).removeClass('is-valid');
            $('#' + id).addClass('is-invalid');
          });
        }
      } else {
        //$('#login-error-msg').html('<p class="text-success">Отлично!</p>');
        $(location).attr('href', '/');
      }
    });
  });

  $('#login-password').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#login-button')
        .focus()
        .click();
      return false;
    }
  });

  // User init changes Name
  {
    $('#userinitchangename-button').on('click', function(e) {
      e.preventDefault();
      let newName = $('#userinitchangename-input').val();
      console.log(newName);
      $.ajax({
        type: 'POST',
        data: JSON.stringify({ task: 'changename', newValue: newName }),
        contentType: 'application/json',
        url: '/profile/myprofile'
      }).done(function(data) {
        $('input').removeClass('is-invalid');
        $('input').addClass('is-valid');
        if (!data.ok) {
          $('.form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('input').removeClass('is-valid');
          $('input').addClass('is-invalid');
        } else {
          $(location).attr('href', '/profile/myprofile');
        }
      });
    });

    $('#userinitchangename-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#userinitchangename-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // User init changes E-mail
  {
    $('#userinitchangeemail-button').on('click', function(e) {
      e.preventDefault();
      let newEmail = $('#userinitchangeemail-input').val();
      console.log(newEmail);
      $.ajax({
        type: 'POST',
        data: JSON.stringify({ task: 'changeemail', newValue: newEmail }),
        contentType: 'application/json',
        url: '/profile/myprofile'
      }).done(function(data) {
        $('input').removeClass('is-invalid');
        $('input').addClass('is-valid');
        if (!data.ok) {
          $('.form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('input').removeClass('is-valid');
          $('input').addClass('is-invalid');
        } else {
          $(location).attr('href', '/profile/myprofile');
        }
      });
    });

    $('#userinitchangeemail-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#userinitchangeemail-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // User init changes PhoneNumber
  {
    $('#userinitchangephonenumber-button').on('click', function(e) {
      e.preventDefault();
      let newPhoneNumber = $('#userinitchangephonenumber-input').val();
      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          task: 'changephonenumber',
          newValue: newPhoneNumber
        }),
        contentType: 'application/json',
        url: '/profile/myprofile'
      }).done(function(data) {
        $('input').removeClass('is-invalid');
        $('input').addClass('is-valid');
        if (!data.ok) {
          $('.form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('input').removeClass('is-valid');
          $('input').addClass('is-invalid');
        } else {
          $(location).attr('href', '/profile/myprofile');
        }
      });
    });

    $('#userinitchangephonenumber-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#userinitchangephonenumber-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // User init changes PassWord
  {
    $('#userinitchangepassword-button').on('click', function(e) {
      e.preventDefault();
      let oldPassword = $('#userinitchangepasswordold-input').val();
      let newPassword = $('#userinitchangepasswordnew-input').val();
      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          task: 'changepassword',
          newValue: { oldPassword, newPassword }
        }),
        contentType: 'application/json',
        url: '/profile/myprofile'
      }).done(function(data) {
        $('input').removeClass('is-invalid');
        $('input').addClass('is-valid');
        if (!data.ok) {
          $('.form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('input').removeClass('is-valid');
          $('input').addClass('is-invalid');
        } else {
          $(location).attr('href', '/profile/myprofile');
        }
      });
    });
    $('#userinitchangepasswordnew-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#userinitchangepassword-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // Admin Add New User
  $('#administratorUsersAdd-button').on('click', function(e) {
    e.preventDefault();
    var data = {
      name: $('#register-name').val(),
      email: $('#register-email').val(),
      phonenumber: $('#register-phonenumber').val(),
      login: $('#register-login').val(),
      password: $('#register-password').val(),
      passwordConfirm: $('#register-password-confirm').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/users/add'
    }).done(function(data) {
      $('div.form-group').removeClass('has-error');
      $('div.form-group').addClass('has-success');
      console.log(data);

      if (!data.ok) {
        $('#register-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#div_' + id).removeClass('has-success');
            $('#div_' + id).addClass('has-error');
          });
        }
      } else {
        //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
        $(location).attr('href', '/administrator/users');
      }
    });
  });
  $('#register-password-confirm').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#administratorUsersAdd-button')
        .focus()
        .click();
      return false;
    }
  });


  // Admin Dell One User
  $("[name='admin-users-del-one']").on('click', function(e) {
    e.preventDefault();
    let delUserName = this.value;
    let confirmed = confirm(
      'Вы точно хотите удалить пользователя ' + delUserName + '?'
    );
    if (confirmed) {
      let data = {
        delUserName
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/administrator/users'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $(location).attr('href', '/administrator/users');
        }
      });
    } else return;
  });


  // Admin Edit One User
  $('#administratorUsersEdit-button').on('click', function(e) {
    e.preventDefault();
    var data = {
      login: $('#register-login').val(),
      name: $('#register-name').val(),
      email: $('#register-email').val(),
      phonenumber: $('#register-phonenumber').val(),
      group: $('#admin-edit-user-group').val(),
    };
    console.log("SENT: " + data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/users/edit'
    }).done(function(data) {
      $('div.form-group').removeClass('has-error');
      $('div.form-group').addClass('has-success');
      console.log("ANSWER: " + data);

      if (!data.ok) {
        $('#register-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#div_' + id).removeClass('has-success');
            $('#div_' + id).addClass('has-error');
          });
        }
      } else {
        //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
        $(location).attr('href', '/administrator/users');
      }
    });
  });
  $('#register-password-confirm').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#admin-edit-user-group')
        .focus()
        .click();
      return false;
    }
  });


  // User init changes PassWord
  {
    $('#admininitchangepassword-button').on('click', function(e) {
      e.preventDefault();
      let editUserLogin = this.value;
      let newPassword = $('#admininitchangepassword-input').val();
      let newPasswordConfirm = $('#admininitchangepasswordconfirm-input').val();
      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          editUserLogin,
          newPassword,
          newPasswordConfirm
        }),
        contentType: 'application/json',
        url: '/administrator/users/editusrpsw'
      }).done(function(data) {
        $('.admin-change-user-psw').removeClass('is-invalid');
        $('.admin-change-user-psw').addClass('is-valid');
        if (!data.ok) {
          $('.admin-change-password-form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('.admin-change-user-psw').removeClass('is-valid');
          $('.admin-change-user-psw').addClass('is-invalid');
        } else {
          $(location).attr('href', '/administrator/users');
        }
      });
    });
    $('#admininitchangepasswordconfirm-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#admininitchangepassword-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // Admin Add New Publication
  $('#administratorPublicationAdd-button').on('click', function(e) {
    e.preventDefault();
    var markupStr = $('#adminaddnewpublfulltext').summernote('code');
    var data = {
      title: $('#new-publication-title').val(),
      alias: $('#new-publication-alias').val(),
      status: $('#new-publication-status').val(),
      shorttext: $('#new-publication-short-text').val(),
      fulltext: markupStr,
      picture: $('#new-publication-picture').val(),
      description: $('#new-publication-description').val(),
      keywords: $('#new-publication-keywords').val()
    };

    $
      .ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/administrator/publications/add'
      })
      .done(function(data) {
        
        //дальше перероблять





        $('div.form-group').removeClass('has-error');
        $('div.form-group').addClass('has-success');
        console.log(data);

        if (!data.ok) {
          $('#register-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          if (data.fields) {
            data.fields.forEach(function(id) {
              $('#div_' + id).removeClass('has-success');
              $('#div_' + id).addClass('has-error');
            });
          }
        } else {
          //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
          $(location).attr('href', '/administrator/users');
        }
      });

  });

  $('#new-publication-keywords-tag').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#administratorPublicationAdd-button')
        .focus()
        .click();
      return false;
    }
  });



  


  //Upload image for new publications

  $('#fileinfo').on('submit', function(e) {
    e.preventDefault();
   
 
    var formData = new FormData(this);
    var fullTxtStr = $('#adminaddnewpublfulltext').summernote('code');
    formData.append('fullTxtStr', fullTxtStr);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false, //no dirty data to send
      contentType: false, //no validation
      success: function(result){
        console.log(result);
      },
      error: function(error){
        console.log(error);
      }
    });

  });




});

/* eslint-disable no-undef */
/*
$(window).on('load', function() {
  alert('load');
});

$(document).ready(function() {
  alert('document ready occurred!');
});

*/

//$(function() {

$(window).on('load', function() {
  //AUTH toggle forms
  $('#loading-overlay').hide();
  $('#select-discount-header').removeAttr('disabled');

  if (+$('#topshopbuttonitemsquantity').text()) {
    $('#select-discount-header').attr('disabled', '');
  }

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

  // Admin Edit One User from list redirect
  $("[name='admin-users-list-edit-one']").on('click', function(e) {
    e.preventDefault();
    $(location).attr('href', '/administrator/users/edit/' + this.value);
  });

  // Admin Dell One User from list
  $("[name='admin-users-list-del-one']").on('click', function(e) {
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
      group: $('#admin-edit-user-group').val()
    };
    console.log('SENT: ' + data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/users/edit'
    }).done(function(data) {
      $('div.form-group').removeClass('has-error');
      $('div.form-group').addClass('has-success');
      console.log('ANSWER: ' + data);

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

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/publications/add'
    }).done(function(data) {
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

  //Upload image and fields for new publications
  $('#adminaddnewpubl').on('submit', function(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var newPublFullText = $('#adminaddnewpublfulltext').summernote('code');
    formData.append('newPublicationFullText', newPublFullText);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false, //no dirty data to send
      contentType: false, //no validation
      success: function(result) {
        console.log(result);
        $('#div_new-publication-alias').removeClass('has-error');
        if (!result.ok) {
          $('#nev-publication-error-msg').html(
            '<p class="text-danger">' + result.error + '</p>'
          );
          if (result.alias) {
            $("[name='newPublAlias']").val(result.alias);
            $('#div_new-publication-alias').addClass('has-error');
          }
        } else {
          $(location).attr('href', '/administrator/publications');
        }
      },
      error: function(error) {
        console.log(error);
        $(location).attr('href', '/administrator/error');
      }
    });
  });

  // Admin Edit One Publication from list redirect
  $("[name='admin-publications-list-edit-one']").on('click', function(e) {
    e.preventDefault();
    $(location).attr('href', '/administrator/publications/edit/' + this.value);
  });

  // Admin Dell One Publication from list
  $("[name='admin-publications-list-del-one']").on('click', function(e) {
    e.preventDefault();
    let delPublicationAlias = this.value;
    let confirmed = confirm('Вы точно хотите удалить публикацию?');
    if (confirmed) {
      let data = {
        delPublicationAlias
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/administrator/publications/deleteone'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $(location).attr('href', '/administrator/publications');
        }
      });
    } else return;
  });

  // Admin Edit One Publication
  $('#administratorPublicationEdit-button').on('click', function(e) {
    var markupStr = $('#admineditPublfulltext').summernote('code');
    e.preventDefault();
    var data = {
      title: $('#edit-publication-title').val(),
      alias: $('#edit-publication-alias').val(),
      status: $('#edit-publication-status').val(),
      shorttext: $('#edit-publication-short-text').val(),
      fulltext: markupStr,
      description: $('#edit-publication-description').val(),
      keywords: $('#edit-publication-keywords').val()
    };
    console.log('SENT: ' + data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/publications/editone'
    }).done(function(data) {
      console.log('ANSWER: ' + data);

      if (!data.ok) {
        $('#edit-publication-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
      } else {
        //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
        $(location).attr('href', '/administrator/publications');
      }
    });
  });

  //Upload new image for old publication (EDIT IMAGE in PUBL)
  $('#admineditpublpicture').on('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      type: 'POST',
      url: '/upload/editimage',
      data: formData,
      processData: false, //no dirty data to send
      contentType: false, //no validation
      success: function(result) {
        console.log(result);
        if (!result.ok) {
          $('#div_alert_edit-publication-image').html(
            '<p class="text-danger">' + result.error + '</p>'
          );
        } else {
          $(location).attr(
            'href',
            '/administrator/publications/edit/' + result.publAlias
          );
        }
      },
      error: function(error) {
        console.log(error);
        $(location).attr('href', '/administrator/error');
      }
    });
  });

  $('.carousel').carousel();

  //  SHOP - Items list - ACTIONS
  $('[name="cart-amount-minus"]').click(function() {
    let itemId = this.id;
    let oldVal = $('input[name=' + itemId + ']').val();
    if (oldVal > 1) $('input[name=' + itemId + ']').val(oldVal - 1);
  });

  $('[name="cart-amount-plus"]').click(function() {
    let itemId = this.id;
    let oldVal = $('input[name=' + itemId + ']').val();
    $('input[name=' + itemId + ']').val(Number(oldVal) + 1);
  });

  //****************************** */
  //  SHOP - Items list - add-item */
  //****************************** */

  $('[name="add-item-to-shopcart-button"]').click(function() {
    var itemVendorCode = this.id;
    var quantity = $('input[name=' + itemVendorCode + ']').val();
    var price = +$('#price' + itemVendorCode).text();
    var basePrice = +$('#basePrice' + itemVendorCode).text();

    var data = {
      itemVendorCode,
      quantity,
      price,
      basePrice
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shopcart/additem'
    }).done(function(data) {
      $("[name='shop-cart-new-item-del']").attr(
        'id',
        data.shopCart[0].vendorCode
      );

      $('#newItemPicture').html(
        '<img src="' +
          data.shopCart[0].picture +
          '"class="cart-list-itempicture"/>'
      );
      $('#newItemName').text(data.shopCart[0].name);
      $('#newItemPrice').text(data.shopCart[0].price.toFixed(2) + ' грн');
      $('#topshopbuttonitemsquantity').text(data.shopCart.length);
      $('#select-discount-header').attr('disabled', '');

      var cartTotalSumm = 0;

      for (let i = 0; i < data.shopCart.length; i++)
        cartTotalSumm += data.shopCart[i].price * data.shopCart[i].quantity;
      cartTotalSumm = cartTotalSumm.toFixed(2);
      $('#cart-total').text(cartTotalSumm);

      function fStrQuantityEnd(n) {
        if (((n = Math.abs(n) % 100) > 4 && n < 21) || (n %= 10) > 4 || n === 0)
          return n + ' товаров';
        if (n > 1) return n + ' товара';
        return n + ' товар';
      }
      if (data.shopCart.length > 1) {
        $('.cart-all-items-quantity-insert').html(
          '<span class="fas fa-shopping-cart avesomePaddingRight"></span> В\
        корзине еще ' +
            fStrQuantityEnd(data.shopCart.length - 1)
        );
      }
      $('#addItemToCartModal').modal();
      //console.log('Прилетіло в скрипт від роута: ');
      //console.log(data.shopCart);
    });
  });

  //  SHOP - MODAL new Item - ACTIONS
  $('[name="shop-cart-new-item-del"]').click(function() {
    let itemDelId = this.id;
    var data = {
      itemDelId
    };
    $.ajax({
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shopcart/deleteitem'
    }).done(function(data) {
      $('#topshopbuttonitemsquantity').text(data.shopCart.length);
      $('#addItemToCartModal').modal('hide');
    });
  });

  //  SHOP -ShopCart - ACTIONS
  $('[name="shop-cart-line-one-item-del"]').click(function() {
    let itemDelId = this.id;
    var data = {
      itemDelId
    };
    $.ajax({
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shopcart/deleteitem'
    }).done(function(data) {
      if (data.ok) {
        if (!data.shopCart.length) {
          $(location).attr('href', '/shopcart');
          return;
        }
        let newCartTotal = 0;
        for (let i = 0; i < data.shopCart.length; i++) {
          newCartTotal += data.shopCart[i].price * data.shopCart[i].quantity;
        }
        $('#topshopbuttonitemsquantity').text(data.shopCart.length);
        $('#div_line_' + itemDelId).remove();
        $('#cart-total').text(newCartTotal.toFixed(2));
      }
    });
  });

  $('[name="cart-line-amount-minus"]').click(function() {
    let itemId = this.id;
    let oldVal = $('input[name=' + itemId + ']').val();
    if (oldVal > 1) {
      $('input[name=' + itemId + ']').val(oldVal - 1);
      $('input[name=' + itemId + ']').putNewQquantityToItemLine();
    }
  });

  $('[name="cart-line-amount-plus"]').click(function() {
    let itemId = this.id;
    let oldVal = $('input[name=' + itemId + ']').val();
    $('input[name=' + itemId + ']').val(Number(oldVal) + 1);
    $('input[name=' + itemId + ']').putNewQquantityToItemLine();
  });

  $('.cart-line-amount-input').on('change', function() {
    //alert(this.value + ' ' + this.name);
    $(this).putNewQquantityToItemLine();
  });

  jQuery.fn.extend({
    putNewQquantityToItemLine: function() {
      console.dir(this[0].name + ' -> ' + this[0].value);
      var itemId = this[0].name;
      var newQuantity = this[0].value;
      var data = {
        itemId,
        newQuantity
      };
      $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/shopcart/changeitemquantity'
      }).done(function(data) {
        if (data.ok) {
          console.log('changed!');
          $('input[name=' + itemId + ']').val(newQuantity);
          let newCartTotal = 0;
          let newItemLineTotal = 0;
          for (let i = 0; i < data.shopCart.length; i++) {
            newCartTotal += data.shopCart[i].price * data.shopCart[i].quantity;
            if (data.shopCart[i].vendorCode == itemId)
              newItemLineTotal =
                data.shopCart[i].price * data.shopCart[i].quantity;
          }
          $('.jq-div-itemsumm' + itemId).text(
            newItemLineTotal.toFixed(2) + ' грн'
          );
          $('#cart-total').text(newCartTotal.toFixed(2));
        }
      });
    }
  });

  //  SHOP - ShopCart Customer Forms ACTIONS

  $('#delivery-type-select').on('change', function() {
    if (this.value == 1) {
      $('#city-select-div').show();
      $('#department-select-div').show();
      $('#ordercomment').attr('placeholder', 'Комментарий к заказу...');
    }
    if (this.value == 2) {
      $('#city-select-div').hide();
      $('#department-select-div').hide();
      $('#ordercomment').attr('placeholder', 'Адрес и комментарий к заказу...');
    }
    if (this.value == 3) {
      $('#city-select-div').hide();
      $('#department-select-div').hide();
      $('#ordercomment').attr('placeholder', 'Комментарий к заказу...');
    }
  });

  $('#cities-select').on('change', function() {
    var CityName = this.value;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'https://api.novaposhta.ua/v2.0/json/',
      data: JSON.stringify({
        modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: {
          Language: 'ru',
          CityName
        },
        apiKey: '3f4d62ae70b694179cb58a679cf736c2'
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      xhrFields: {
        // Свойство 'xhrFields' устанавливает дополнительные поля в XMLHttpRequest. // Это можно использовать для установки свойства 'withCredentials'. // Установите значение «true», если вы хотите передать файлы cookie на сервер. // Если это включено, ваш сервер должен ответить заголовком // 'Access-Control-Allow-Credentials: true'.
        withCredentials: false
      },
      success: function(texts) {
        $('#departments-select').empty();
        for (let i = 0; i < texts.data.length; i++) {
          console.log(texts.data[i].DescriptionRu);
          $('#departments-select').append(
            "<option value='" +
              texts.data[i].DescriptionRu +
              "'>" +
              texts.data[i].DescriptionRu +
              '</option>'
          );
        }
        $('.department-select').trigger('chosen:updated');
      }
    });
  });

  //  SHOP - ShopCart Checkout
  $('#shopcartcheckout').on('submit', function(e) {
    e.preventDefault();
    let name = $('#toorder-name').val(),
      login = $('#toorder-login').val(),
      _id = $('#toorder-_id').val(),
      customer = $('#toorder-customer').val(),
      email = $('#toorder-email').val(),
      phonenumber = $('#toorder-phonenumber').val(),
      group = $('#toorder-group').val(),
      deliveryCity = $('#cities-select').val(),
      deliveryDepartment = $('#departments-select').val(),
      ordercomment = $('#ordercomment').val();

    function deliveryTypeStr(typeNumber) {
      switch (typeNumber) {
        case '1':
          return 'Отделение Новой Почты';
          // eslint-disable-next-line no-unreachable
          break;
        case '2':
          return 'Курьером по адресу';
          // eslint-disable-next-line no-unreachable
          break;
        case '3':
          return 'Самовывоз';
          // eslint-disable-next-line no-unreachable
          break;
        default:
          return '';
          // eslint-disable-next-line no-unreachable
          break;
      }
    }

    function paymentMethodStr(typeNumber) {
      switch (typeNumber) {
        case '1':
          return 'Наложенный платеж';
          // eslint-disable-next-line no-unreachable
          break;
        case '2':
          return 'Безналичный расчет';
          // eslint-disable-next-line no-unreachable
          break;
        case '3':
          return 'Оплата на карту Приват банка';
          // eslint-disable-next-line no-unreachable
          break;
        default:
          return '';
          // eslint-disable-next-line no-unreachable
          break;
      }
    }

    let deliveryType = deliveryTypeStr($('#delivery-type-select').val());
    let paymentMethod = paymentMethodStr($('#payment-method-select').val());

    var data = {
      user: {
        name,
        login,
        _id,
        customer,
        email,
        phonenumber,
        group,
        deliveryType,
        deliveryCity,
        deliveryDepartment,
        paymentMethod,
        ordercomment
      }
    };
    console.dir(data);

    $.ajax({
      type: 'POST',
      url: '/shopcart/neworder',
      data: data,
      success: function(result) {
        

        if (result.ok) {
          $('#new-order-number').text(result.newOrderNumber);
          $('#successOrdermodal').modal();
        } else {
          console.log(result.ok);
        }
      },
      error: function(error) {
        console.log(error);
        //$(location).attr('href', '/administrator/error');
      }
    });
  });

  $('#successOrdermodal').on('hidden.bs.modal', function() {
    $(location).attr('href', '/');
  });

  // Admin Shop pricesettings
  $('#shoppricesettings-button').on('click', function(e) {
    e.preventDefault();

    var data = {
      kursDolara: $('#usd-kurs-settings').val(),
      baseNacenka: $('#base-nacenka-settings').val(),
      skidka1: $('#skidka1-settings').val(),
      skidka2: $('#skidka2-settings').val(),
      skidka3: $('#skidka3-settings').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/shop/pricesettings'
    }).done(function(data) {
      $('div.pricesettings').removeClass('has-error');
      $('div.pricesettings').addClass('has-success');

      if (!data.ok) {
        $('#pricesettings-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#div_' + id).removeClass('has-success');
            $('#div_' + id).addClass('has-error');
          });
        }
      } else {
        $('#loading-overlay').show();
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      }
    });
  });

  // Admin Shop itemsviewsettings
  $('#shopitemsviewsettings-button').on('click', function(e) {
    e.preventDefault();
    var data = {
      shopMainPageItemsPerPage: $(
        '#shop-settings-shopmainpage-itemsperpage'
      ).val(),
      shopCategorieItemsPerPage: $(
        '#shop-settings-shopcategorie-itemsperpage'
      ).val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/shop/itemsviewsettings'
    }).done(function(data) {
      $('div.itemsviewsettings').removeClass('has-error');
      $('div.itemsviewsettings').addClass('has-success');

      if (!data.ok) {
        $('#itemsviewsettings-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#div_' + id).removeClass('has-success');
            $('#div_' + id).addClass('has-error');
          });
        }
      } else {
        $('#loading-overlay').show();
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      }
    });
  });

  $('.select-discount-header').on('change', function(e) {
    e.preventDefault();
    var data = {
      newDiscount: this.value
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shop/changediscount'
    }).done(function(data) {
      if (!data.ok) {
        console.log('Error changing discount!');
      } else {
        $('#loading-overlay').show();
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      }
    });
  });

  // User Dell One Order from list
  $("[name='orders-list-del-one']").on('click', function(e) {
    e.preventDefault();
    let delOrder_id = this.value;
    let confirmed = confirm(
      'Вы точно хотите удалить заказ ' + delOrder_id + '?'
    );
    if (confirmed) {
      let data = {
        delOrder_id
      };
      $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/shop/deleteorder'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $('#loading-overlay').show();
          setTimeout(function() {
            window.location.reload(true);
          }, 1500);
        }
      });
    } else return;
  });

  // User Edit One Order from list
  $("[name='orders-list-edit-one']").on('click', function(e) {
    e.preventDefault();
    let editOrder_id = this.value;
    let confirmed = confirm(
      'Вы точно хотите редактировать заказ ' + editOrder_id + '?'
    );
    if (confirmed) {
      let data = {
        editOrder_id
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/shop/editorder'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $('#loading-overlay').show();
          setTimeout(function() {
            window.location.href = '/shopcart';
          }, 1500);
        }
      });
    } else return;
  });

  // User Unload One Order from list
  $("[name='orders-list-unload-one']").on('click', function(e) {
    e.preventDefault();
    let unloadOrder_id = this.value;
    let data = {
      unloadOrder_id
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shop/unloadorder'
    }).done(function(data) {
      if (!data.ok) {
        alert(data.error);
      } else {
        $('#loading-overlay').show();
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      }
    });
  });

  // Main search input
  {
    $('#mainsearch-button').on('click', function(e) {
      e.preventDefault();
      let newSearchQuery = $('#mainsearch-input').val();
      console.log(newSearchQuery);
      $.ajax({
        type: 'POST',
        data: JSON.stringify({ newSearchQuery }),
        contentType: 'application/json',
        url: '/shop/search'
      }).done(function(data) {
        $('mainsearch-input').removeClass('is-invalid');
        $('mainsearch-input').addClass('is-valid');
        if (!data.ok) {
          $('.search-form-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          $('input').removeClass('is-valid');
          $('input').addClass('is-invalid');
        } else {
          $(location).attr(
            'href',
            '/search/shopsearch?searchquery=' + newSearchQuery
          );
        }
      });
    });

    $('#mainsearch-input').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#mainsearch-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  // Post new Testimonial
  {
    $('#newtestimonial-button').on('click', function(e) {
      e.preventDefault();

      let newTestimonialAuthorName = $('#newTestimonialAuthorName').val();
      let newTestimonialContent = $('#newTestimonialContent').val();
      let newTestimonialItemVendorCode = $(
        '#newTestimonialItemVendorCode'
      ).val();

      $.ajax({
        type: 'POST',
        data: JSON.stringify({
          newTestimonialAuthorName,
          newTestimonialContent,
          newTestimonialItemVendorCode
        }),
        contentType: 'application/json',
        url: '/shop/testimonial'
      }).done(function(data) {
        $('#newTestimonialAuthorName').removeClass('is-invalid');
        $('#newTestimonialContent').removeClass('is-invalid');
        $('#newTestimonialAuthorName').addClass('is-valid');
        $('#newTestimonialContent').addClass('is-valid');
        if (!data.ok) {
          $('#newTestimonial-error-msg').html(
            '<p class="text-danger">' + data.error + '</p>'
          );
          if (data.authorNameError) {
            $('#newTestimonialAuthorName').removeClass('is-valid');
            $('#newTestimonialAuthorName').addClass('is-invalid');
          }
          if (data.contentError) {
            $('#newTestimonialContent').removeClass('is-valid');
            $('#newTestimonialContent').addClass('is-invalid');
          }
        } else {
          $('#addNewTestimonialModal').modal();
        }
      });
    });

    $('#finishAddNewTestimonial').on('click', function(e) {
      e.preventDefault();
      $('#loading-overlay').show();
      setTimeout(function() {
        window.location.reload(true);
      }, 1500);
    });

    $('#addNewTestimonialModal').on('hide.bs.modal', function(e) {
      e.preventDefault();
      $('#loading-overlay').show();
      setTimeout(function() {
        window.location.reload(true);
      }, 1500);
    });

    $('#newTestimonialContent').keypress(function(e) {
      if (e.which == 13) {
        jQuery(this).blur();
        jQuery('#newtestimonial-button')
          .focus()
          .click();
        return false;
      }
    });
  }

  {
    // User Dell One Testimonial from list
    $("[name='testimonial-list-del-one']").on('click', function(e) {
      e.preventDefault();
      let delTestimonial_id = this.value;
      let confirmed = confirm(
        'Вы точно хотите удалить отзыв ' + delTestimonial_id + '?'
      );
      if (confirmed) {
        let data = {
          delTestimonial_id
        };
        $.ajax({
          type: 'DELETE',
          data: JSON.stringify(data),
          contentType: 'application/json',
          url: '/shop/deletetestimonial'
        }).done(function(data) {
          if (!data.ok) {
            alert(data.error);
          } else {
            $('#loading-overlay').show();
            setTimeout(function() {
              window.location.reload(true);
            }, 1500);
          }
        });
      } else return;
    });

    // User approve One Testimonial from list
    $("[name='testimonial-list-approve-one']").on('click', function(e) {
      e.preventDefault();
      let testimonial_id = this.value;
      let data = {
        testimonial_id
      };
      $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/shop/approvetestimonial'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $('#loading-overlay').show();
          setTimeout(function() {
            window.location.reload(true);
          }, 1500);
        }
      });
    });
  }

  $('[name="add-item-to-wishlist-button"]').click(function() {
    var itemVendorCode = this.id;

    var data = { itemVendorCode };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shop/additemtowishlist'
    }).done(function(data) {
      console.log(data);
      if (data.ok) {
        $('#additemtowishlistModal').modal();
      }
    });
  });

  // User Dell One Item from Wishlist

  $("[name='dell-item-from-wishlist-button']").on('click', function(e) {
    e.preventDefault();

    let delWishListItemVendorCode = this.id;
    let confirmed = confirm('Вы точно хотите удалить товар из списка желаний?');
    if (confirmed) {
      let data = {
        delWishListItemVendorCode
      };
      $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/shop/deleteitemfromwishlist'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          $('#loading-overlay').show();
          setTimeout(function() {
            window.location.reload(true);
          }, 1500);
        }
      });
    } else return;
  });


  
  $("#manual-import-start-button").on('click', function(e) {
    e.preventDefault();
      $.ajax({
        type: 'POST',
        data: '',
        contentType: 'application/json',
        url: '/administrator/shop/import1s'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          alert('Задание на ручной импорт запущено!')
          $('#loading-overlay').show();
          setTimeout(function() {
            window.location.reload(true);
          }, 1500);
        }
      });

  });



  $('#shop-settings-automatic-import-status').on('change', function(e) {
    e.preventDefault();
    var data = {
      isAutomaticImportOn: this.value
    };
    

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/administrator/shop/changeautomaticimport'
    }).done(function(data) {
      if (!data.ok) {
        console.log('Error changing automatic import!');
      } else {
        $('#loading-overlay').show();
        setTimeout(function() {
          window.location.reload(true);
        }, 1500);
      }
    });



  });



  // Message from Contacts Page
  $('#contacts-mainform-submit').on('click', function(e) {
    e.preventDefault();

    var data = {
      name: $('#contacts-mainform-name').val(),
      email: $('#contacts-mainform-email').val(),
      phonenumber: $('#contacts-mainform-phonenumber').val(),
      message: $('#contacts-mainform-message').val(),
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/messages/maincontactsform'
    }).done(function(data) {
      $('.form-control').removeClass('is-invalid');
      $('.form-control').addClass('is-valid');


      if (!data.ok) {
        $('#contactsform-error-msg').html(
          '<p class="text-danger">' + data.error + '</p>'
        );
        if (data.fields) {
          data.fields.forEach(function(id) {
            $('#' + id).removeClass('is-valid');
            $('#' + id).addClass('is-invalid');
          });
        }
      } else {
        $('#contactsMessageModal').modal();
        //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
       // $(location).attr('href', '/');
      }
    });
  });
  $('#contacts-mainform-message').keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).blur();
      jQuery('#contacts-mainform-submit')
        .focus()
        .click();
      return false;
    }
  });

  $('#contactsMessageModal').on('hidden.bs.modal', function() {

    //$(location).attr('href', '/contacts');
    $('#loading-overlay').show();
    setTimeout(function() {
      window.location.reload(true);
    }, 1000);

  });





 // callmebackform from Main Page
 $('#callmebackform-button').on('click', function(e) {
  e.preventDefault();

  var data = {
    name: $('#callmebackform-name').val(),
    phonenumber: $('#callmebackform-phonenumber').val(),
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/messages/callmebackform'
  }).done(function(data) {
    $('.form-control').removeClass('is-invalid');
    $('.form-control').addClass('is-valid');


    if (!data.ok) {
      $('#callmebackform-error-msg').html(
        '<p class="text-danger">' + data.error + '</p>'
      );
      if (data.fields) {
        data.fields.forEach(function(id) {
          $('#' + id).removeClass('is-valid');
          $('#' + id).addClass('is-invalid');
        });
      }
    } else {
      $('#callmebackformMessageModal').modal();
      //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
     // $(location).attr('href', '/');
    }
  });
});

$('#callmebackform-phonenumber').keypress(function(e) {
  if (e.which == 13) {
    jQuery(this).blur();
    jQuery('#callmebackform-button')
      .focus()
      .click();
    return false;
  }
});

$('#callmebackformMessageModal').on('hidden.bs.modal', function() {
  //$(location).attr('href', '/');
  $('#loading-overlay').show();
  setTimeout(function() {
    window.location.reload(true);
  }, 1000);
});


 // defaultsubscriptionform from Ышвуифк
 $('#defaultSubscriptionFormSubmit').on('click', function(e) {
  e.preventDefault();

  var data = {
    name: $('#defaultSubscriptionFormName').val(),
    email: $('#defaultSubscriptionFormEmail').val(),
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/messages/defaultsubscriptionform'
  }).done(function(data) {
    $('.form-control').removeClass('is-invalid');
    $('.form-control').addClass('is-valid');


    if (!data.ok) {
      $('#defaultSubscriptionForm-error-msg').html(
        '<p class="text-danger">' + data.error + '</p>'
      );
      if (data.fields) {
        data.fields.forEach(function(id) {
          $('#' + id).removeClass('is-valid');
          $('#' + id).addClass('is-invalid');
        });
      }
    } else {
      $('#defaultSubscriptionFormMessageModal').modal();
      //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
     // $(location).attr('href', '/');
    }
  });
});

$('#defaultSubscriptionFormEmail').keypress(function(e) {
  if (e.which == 13) {
    jQuery(this).blur();
    jQuery('#defaultSubscriptionFormSubmit')
      .focus()
      .click();
    return false;
  }
});

$('#defaultSubscriptionFormMessageModal').on('hidden.bs.modal', function() {
  //$(location).attr('href', '/');
  $('#loading-overlay').show();
  setTimeout(function() {
    window.location.reload(true);
  }, 1000);
});



// Message from Partners Page
$('#partners-mainform-submit').on('click', function(e) {
  e.preventDefault();

  var data = {
    name: $('#partners-mainform-name').val(),
    companyname: $('#partners-mainform-companyname').val(),
    email: $('#partners-mainform-email').val(),
    phonenumber: $('#partners-mainform-phonenumber').val(),
    address: $('#partners-mainform-address').val(),
    message: $('#partners-mainform-message').val(),
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/messages/partnersform'
  }).done(function(data) {
    $('.form-control').removeClass('is-invalid');
    $('.form-control').addClass('is-valid');


    if (!data.ok) {
      $('#partnersform-error-msg').html(
        '<p class="text-danger">' + data.error + '</p>'
      );
      if (data.fields) {
        data.fields.forEach(function(id) {
          $('#' + id).removeClass('is-valid');
          $('#' + id).addClass('is-invalid');
        });
      }
    } else {
      $('#partnersMessageModal').modal();
      //$('#register-error-msg').html('<p class="text-success">Отлично!</p>');
     // $(location).attr('href', '/');
    }
  });
});
$('#partners-mainform-message').keypress(function(e) {
  if (e.which == 13) {
    jQuery(this).blur();
    jQuery('#partners-mainform-submit')
      .focus()
      .click();
    return false;
  }
});

$('#partnersMessageModal').on('hidden.bs.modal', function() {

  //$(location).attr('href', '/partners');
  $('#loading-overlay').show();
  setTimeout(function() {
    window.location.reload(true);
  }, 1000);

});


$('#gps-filter-date-input').on('change', function(e) {
  e.preventDefault();
  $('#loading-overlay').show();

  let gpsAgent = $('#gps-filter-agent-select').val();
  if (gpsAgent == null)gpsAgent = '0';
  let startTime = $('#gps-filter-starttime-select').val();
  let endTime = $('#gps-filter-endtime-select').val();

  window.location.href = `?gpsDate=${e.target.value}&gpsAgent=${gpsAgent}&startTime=${startTime}&endTime=${endTime}`
})

$('#gps-filter-agent-select').on('change', function(e) {
  e.preventDefault();
  $('#loading-overlay').show();

  let gpsDate = $('#gps-filter-date-input').val();
  let startTime = $('#gps-filter-starttime-select').val();
  let endTime = $('#gps-filter-endtime-select').val();

  window.location.href = `?gpsDate=${gpsDate}&gpsAgent=${e.target.value}&startTime=${startTime}&endTime=${endTime}`

  
})

$('#gps-filter-starttime-select').on('change', function(e) {
  e.preventDefault();
  $('#loading-overlay').show();
  let gpsDate = $('#gps-filter-date-input').val();
  let gpsAgent = $('#gps-filter-agent-select').val();
  if (gpsAgent == null)gpsAgent = '0';
  let endTime = $('#gps-filter-endtime-select').val();
  window.location.href = `?gpsDate=${gpsDate}&gpsAgent=${gpsAgent}&startTime=${e.target.value}&endTime=${endTime}`
})

$('#gps-filter-endtime-select').on('change', function(e) {
  e.preventDefault();
  $('#loading-overlay').show();
  let gpsDate = $('#gps-filter-date-input').val();
  let gpsAgent = $('#gps-filter-agent-select').val();
  if (gpsAgent == null)gpsAgent = '0';
  let startTime = $('#gps-filter-starttime-select').val();
  window.location.href = `?gpsDate=${gpsDate}&gpsAgent=${gpsAgent}&startTime=${startTime}&endTime=${e.target.value}`
})




$('#convertShopCartInXLSButton').on('click', function(e) {
  e.preventDefault();
  $('#loading-overlay').show();
  var data = { isTrue: true };
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    url: '/shop/shopcarttoxls'
  }).done(function(data) {

    if (!data.ok) {
      $('#loading-overlay').hide();
      alert ('Server error, Повідомте Колі:)')
    } else {
      $('#convertShopCartInXLSButton').hide();
      let link = data.link
      $('#shopcartxlsdownload').html(`<a href="${link}" class = "btn btn-success btn-sm"> <span class="fas fa-file-download avesomePaddingRight"></span>Скачать</a>`)
      console.log(link)
      $('#loading-overlay').hide();
    }
  });

})




$('#forumAddNewSectionModalInit').on('click', function(e) {
  e.preventDefault();
  $('#forumAddNewSectionModal').modal();
  //$('#forumAddNewSectionModal').modal('hide');

});

$('#forumAddNewSectionButton').on('click', function(e) {
  e.preventDefault();

  let data = {
    title: $('#forumNewSectionTitle').val(),
    description: $('#forumNewSectionDescription').val(),
  };

  if (data.title.length <5) {
    alert('Введите корректное название для раздела!');
    return null;
  }

  if (data.title.length >60) {
    alert('Введите название для раздела покороче!');
    return null;
  }
  

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/forum/addnewsection'
  }).done(function(data) {

    if (!data.ok) {
      alert(data.error)
    } else {
      $('#loading-overlay').show();
      setTimeout(function() {
        window.location.reload(true);
      }, 1000);

    }
  

  })





});



$('#adminaddnewpublfulltext').summernote({
  placeholder: 'Полный текст для публикации...',
  tabsize: 2,
  height: 200
});

$('#addnewtopicfulltext').summernote({
  placeholder: 'Полный текст темы...',
  tabsize: 2,
  height: 200
});

$('#addnewpostfulltext').summernote({
  placeholder: 'Текст поста...',
  tabsize: 2,
  height: 200
});

 //Upload image and fields for new topic
 $('#addnewtopicform').on('submit', function(e) {
  e.preventDefault();


  $('#loading-overlay').show();
  var formData = new FormData(this);
  var newTopicFullText = $('#addnewtopicfulltext').summernote('code');
  formData.append('newTopicFullText', newTopicFullText);
  $.ajax({
    type: 'POST',
    url: '/upload/topic',
    data: formData,
    processData: false, //no dirty data to send
    contentType: false, //no validation
    success: function(result) {

      //console.log(result);
      
      let topicAlias = result.alias;
      if (!result.ok) {
        $('#new-topic-error-msg').html(
          '<p class="text-danger">' + result.error + '</p>'
        );
        $('#loading-overlay').hide();
      } else {
        $(location).attr('href', '/forum/topic/' + topicAlias);
      }
      
    },
    error: function(error) {
      console.log(error);
      $(location).attr('href', '/administrator/error');
    }
  });
});





 //Upload image and fields for new post

 $('#addnewpostform').on('submit', function(e) {
  e.preventDefault();

  $('#loading-overlay').show();
  var formData = new FormData(this);

  var newPostFullText = $('#addnewpostfulltext').summernote('code');
  formData.append('newPostFullText', newPostFullText);
  $.ajax({
    type: 'POST',
    url: '/upload/post',
    data: formData,
    processData: false, //no dirty data to send
    contentType: false, //no validation
    success: function(result) {

      
      if (!result.ok) {
        $('#new-post-error-msg').html(
          '<p class="text-danger">' + result.error + '</p>'
        );
        $('#loading-overlay').hide();
      } else {
        window.location.reload(true);
      }
      
    },
    error: function(error) {
      console.log(error);
      $(location).attr('href', '/administrator/error');
    }
  });
});

  // Admin Dell One Post from forum
  $("[name='forum-admin-delete-one-post']").on('click', function(e) {
    e.preventDefault();
    let _id = this.value;
    let confirmed = confirm(
      'Вы точно хотите удалить пост?'
    );
    if (confirmed) {
      $('#loading-overlay').show();
      let data = {
        _id
      };
      $.ajax({
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/forum/dellpost'
      }).done(function(data) {
        if (!data.ok) {
          alert(data.error);
        } else {
          window.location.reload(true);
        }
      });
    } else return;
  });


// Admin Dell One topic from forum with all the posts
$("[name='forum-admin-delete-one-topic']").on('click', function(e) {
  e.preventDefault();
  let _id = this.value;
  let confirmed = confirm(
    'Вы точно хотите удалить тему со всеми постами?'
  );
  if (confirmed) {
    let data = {
      _id
    };
    $.ajax({
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/forum/delltopic'
    }).done(function(data) {
      if (!data.ok) {
        alert(data.error);
      } else {
        $(location).attr('href', '/forum');
      }
    });
  } else return;
});


// Admin Dell One section from forum with all the topics and posts
$("[name='forum-admin-delete-one-section']").on('click', function(e) {
  e.preventDefault();

  let _id = this.value;
  let confirmed = confirm(
    'Вы точно хотите удалить раздел со всеми темами и постами?'
  );
  if (confirmed) {
    let data = {
      _id
    };
    $.ajax({
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/forum/dellsection'
    }).done(function(data) {
      if (!data.ok) {
        alert(data.error);
      } else {
        window.location.reload(true);
      }
    });
  } else return;
});




$('#forumEditSectionModalInit').on('click', function(e) {
  e.preventDefault();
  let curSectionId = this.value;
  let curSectionTitle = $(`#sectiontitle${curSectionId}`).text();
  let curSectionDescription = $(`#sectiondescription${curSectionId}`).text();
  $('#forumEditSectionTitle').val(curSectionTitle);
  $('#forumEditSectionDescription').val(curSectionDescription);
  $('#forumEditSectionButton').val(curSectionId);
  $('#forumEditSectionModal').modal();
  //$('#forumEditSectionModal').modal('hide');

});

$('#forumEditSectionButton').on('click', function(e) {
  e.preventDefault();

  let data = {
    _id:$('#forumEditSectionButton').val(),
    title: $('#forumEditSectionTitle').val(),
    description: $('#forumEditSectionDescription').val(),
  };


  if (data.title.length <5) {
    alert('Введите корректное название для раздела!');
    return null;
  }

  if (data.title.length >60) {
    alert('Введите название для раздела покороче!');
    return null;
  }
  

  $.ajax({
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/forum/editsection'
  }).done(function(data) {

    if (!data.ok) {
      alert(data.error)
    } else {
      $('#loading-overlay').show();
      setTimeout(function() {
        window.location.reload(true);
      }, 1000);
    }
  })
});











});

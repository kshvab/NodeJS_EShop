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

    var data = {
      itemVendorCode,
      quantity
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
      $('#newItemPrice').text(data.shopCart[0].price + ' грн');
      $('#topshopbuttonitemsquantity').text(data.shopCart.length);

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
        console.log(result);

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
        setTimeout(function() {window.location.reload(true);}, 1500);
      }
    });
  });

  // Admin Shop itemsviewsettings
  $('#shopitemsviewsettings-button').on('click', function(e) {
      e.preventDefault();
      var data = {
        shopMainPageItemsPerPage: $('#shop-settings-shopmainpage-itemsperpage').val(),
        shopCategorieItemsPerPage: $('#shop-settings-shopcategorie-itemsperpage').val(),
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
          setTimeout(function() {window.location.reload(true);}, 1500);
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
          console.log("Error changing discount!")
        } else {
          $('#loading-overlay').show();
          setTimeout(function() {window.location.reload(true);}, 1500);
        }
      });
    });






});

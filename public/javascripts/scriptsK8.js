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

  /*
  $("[name='add-item-to-shopcart-button']").on('click', function(e) {
    e.preventDefault();
    console.log(this);
    var itemVendorCode = this.id;
    var quantity = this.value;
    var data={
      itemVendorCode,
      quantity
    };
    console.log(data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shopcart/additem'
    }).done(function(data) {
      console.log('serer answer:' + data.shopCart[0].name);

      $('#topshopbuttonitemsquantity').text(data.shopCart.length);

      //console.log(data.shopCart[0].length);
      
      //modal.find('.modal-title').text('Вы добавили товар в корзину: ' + itemVendorCode);
      //modal.find('#newItemName').text(data.shopCart[0].name);
      //modal.find('#newItemPrice').text(data.shopCart[0].price);
      //modal.find('#newItemQuantity').text(data.shopCart[0].quantity);
      //modal.find('#newItemSumm').text(data.shopCart[0].price*data.shopCart[0].quantity);
      
    });

  })
  */

  $('[name="add-item-to-shopcart-button"]').click(function() {
    var itemVendorCode = this.id;
    var quantity = this.value;

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
      shopCartListUpdate(data.shopCart);
      $('#addItemToCartModal').modal();
    });
  });

  $('[name="shop-cart-new-item-del"]').click(function() {
    let itemDelId = this.id;
    shopCartDelOne(itemDelId);
  });

  $('[name="cart-amount-minus"]').click(function() {
    let itemId = this.id;
    shopCartMinus(itemId);
  });

  $('[name="cart-amount-plus"]').click(function() {
    let itemId = this.id;
    shopCartPlus(itemId);
  });
});

function shopCartListUpdate(shopCart) {
  if (!shopCart.length) {
    $('#addItemToCartModal').modal('hide');
    return;
  }

  $('.modal-title').text('Вы добавили товар в корзину:');
  $("[name='shop-cart-new-item-del']").attr('id', shopCart[0].vendorCode);
  $("[name='cart-amount-minus']").attr('id', shopCart[0].vendorCode);
  $("[name='cart-amount-plus']").attr('id', shopCart[0].vendorCode);
  $('#newItemPicture').html(
    '<img src="/import_foto/' +
      shopCart[0].picture.slice(13) +
      '"class="cart-list-itempicture"/>'
  );
  $('#newItemName').text(shopCart[0].name);
  $('#newItemPrice').text(shopCart[0].price + ' грн');
  $("[name='newItemQuantity']").val(shopCart[0].quantity);

  $('#newItemSumm').text(
    (shopCart[0].price * shopCart[0].quantity).toFixed(2) + ' грн'
  );
  $('#topshopbuttonitemsquantity').text(shopCart.length);

  var cartTotalSumm = 0;

  for (let i = 0; i < shopCart.length; i++)
    cartTotalSumm += shopCart[i].price * shopCart[i].quantity;
  cartTotalSumm = cartTotalSumm.toFixed(2);
  $('#cart-total').text(cartTotalSumm);

  var htmlInjection = '';

  if (shopCart.length > 1) {
    htmlInjection +=
      '<H5>Другие товары в корзине</H5>\
  <BR /><table class="shopcart-items-table">';
    for (let i = 1; i < shopCart.length; i++)
      htmlInjection +=
        '\
      <tr>\
        <td rowspan="2" class="cart-del-button-td">\
          <a href="#" type="button" onclick="shopCartDelOne(' +
        shopCart[i].vendorCode +
        ')" name= "" class="" id="">\
            <img\
              src="/images/k8design/shopcartdelbuttons/deleteactive.png"\
              class="cartdelitem" id="8888"\
            />\
          </a>\
        </td>\
        <td rowspan="2" class="cart-info-col-td" style="width: 150px; height: 100px;">\
          <div class="cart-i-img">\
            <img\
              src="/import_foto/' +
        shopCart[i].picture.slice(13) +
        '"\
              class="cart-list-itempicture"\
            />\
          </div>\
        </td>\
        <td colspan="3">\
          <div class="cart-i-title">' +
        shopCart[i].name +
        '</div>\
        </td>\
      </tr>\
      <tr>\
        <td class="cart-i-price">\
          <div class="cart-uah" id="newItemPrice">' +
        shopCart[i].price +
        ' грн' +
        '</div>\
        </td>\
        <td>\
          <div class="cart-amount">\
            <a href="#" class="cart-amount-minus" onclick="shopCartMinus(' +
        shopCart[i].vendorCode +
        ')" name="cart-amount-minus">\
              <img\
                src="/images/k8design/shopcartvalueinput/minusactive.png"\
                class="cart-amount-minus-icon sprite"\
              />\
            </a>\
            <input\
              name="quantity"\
              type="text"\
              class="input-text cart-amount-input-text"\
              readonly=""\
              value="' +
        shopCart[i].quantity +
        '"\
            />\
            <a href="#" class="cart-amount-plus" onclick="shopCartPlus(' +
        shopCart[i].vendorCode +
        ')" name="cart-amount-plus">\
              <img\
                src="/images/k8design/shopcartvalueinput/plusactive.png"\
                class="cart-amount-plus-icon sprite"\
              />\
            </a>\
          </div>\
        </td>\
        <td class="cart-sum">\
          <div class="cart-list-newItemSumm" id="newItemSumm">' +
        (shopCart[i].price * shopCart[i].quantity).toFixed(2) +
        ' грн' +
        '</div>\
        </td>\
      </tr>\
    ';
  }
  htmlInjection += '</table>';
  $('.cart-other').html(htmlInjection);
}

function shopCartDelOne(itemDelId) {
  var data = {
    itemDelId
  };
  $.ajax({
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/shopcart/deleteitem'
  }).done(function(data) {
    shopCartListUpdate(data.shopCart);
  });
}

function shopCartMinus(itemId) {
  console.log('FIRED shopCartMinus ' + itemId);
  var data = {
    itemId
  };
  $.ajax({
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/shopcart/minusone'
  }).done(function(data) {
    shopCartListUpdate(data.shopCart);
  });
}

function shopCartPlus(itemId) {
  console.log('FIRED shopCartPlus ' + itemId);
  var data = {
    itemId
  };
  $.ajax({
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/shopcart/plusone'
  }).done(function(data) {
    shopCartListUpdate(data.shopCart);
  });
}

/*
function shopCartChangeQuantity(itemId, newQuantity) {
  console.log('FIRED shopCartChangeQuantity ' + itemId);
  console.log('newQuantity ' + newQuantity);
  
  var data = {
    itemId,
    newQuantity
  };
  $.ajax({
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/shopcart/changequantity'
  }).done(function(data) {
    shopCartListUpdate(data.shopCart);
  });
  
}
*/

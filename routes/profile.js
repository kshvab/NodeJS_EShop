//var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const user = models.user;
const order = models.order;
const wishlist = models.wishlist;
const moment = require('moment');
const fs = require('fs');

let p_shopItemsArr = new Promise(function(resolve, reject) {
  var shopItemsArrStr = fs.readFileSync(
    './public/datafiles/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  if (shopItemsArr) resolve(shopItemsArr);
  else reject('Can not read ./public/datafiles/shopItemsArrFile.txt');
});

let p_shopUsersArr = new Promise(function(resolve, reject) {
  let shopUsersArrStr = fs.readFileSync(
    './public/datafiles/shopUsersArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  let shopUsersArr = JSON.parse(shopUsersArrStr);

  if (shopUsersArr) resolve(shopUsersArr);
  else reject('Can not read ./public/datafiles/shopUsersArrFile.txt');
});

router.get('/myprofile', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const login = req.session.userLogin;
    const path = '/myprofile';
    let shopCart = req.session.shopCart;
    user.findOne({ login }).then(userFromDB => {
      //console.log(userFromDB);

      if (userFromDB) {
        p_shopUsersArr.then(shopUsersArr => {
          let userFrom1S = shopUsersArr.find(x => x.email === userFromDB.email);
          //console.log(userFrom1S);
          let discount = 0;
          if (userFrom1S) discount = userFrom1S.discount;
          let transData = {
            pageTitle: 'Мой профиль',
            path,
            user: {
              group: userFromDB.group,
              _id: userFromDB._id,
              name: userFromDB.name,
              email: userFromDB.email,
              phonenumber: userFromDB.phonenumber,
              login: userFromDB.login,
              password: userFromDB.password,
              createdAt: moment(userFromDB.createdAt).format(
                'DD.MM.YYYY, HH:mm'
              ),
              updatedAt: moment(userFromDB.updatedAt).format(
                'DD.MM.YYYY, HH:mm'
              ),
              discount
            },
            shopCart
          };
          res.render('profile/myprofile', {
            transData: transData
          });
        });
      } else {
        console.error('Профиль пользователя в базе не найден!');
      }
    });
  } else {
    console.log('юзер незалогинен!');
    res.render('loginForm');
  }
});

router.post('/myprofile', (req, res) => {
  if (!req.session.userId || !req.session.userLogin) return;
  const login = req.session.userLogin;

  let task = req.body.task;
  let newValue = req.body.newValue;

  switch (task) {
    case 'changename':
      changeName(newValue);
      break;
    case 'changeemail':
      changeEmail(newValue);
      break;
    case 'changephonenumber':
      changePhoneNumber(newValue);
      break;
    case 'changepassword':
      changePassword(newValue);
      break;
    default:
    // code block
  }

  function changePassword(fromFormValue) {
    let oldPassword = fromFormValue.oldPassword;
    let newPassword = fromFormValue.newPassword;
    if (!oldPassword || !newPassword) {
      res.json({
        ok: false,
        error: 'Все поля должны быть заполнены!'
      });
    } else {
      user
        .findOne({ login })
        .then(userFromDB => {
          if (!userFromDB) {
            console.log('Неавторизованное обращение к базе');
            res.json({
              ok: false,
              error: 'Ошибка, попробуйте позже!'
            });
          } else {
            bcrypt.compare(oldPassword, userFromDB.password, function(
              err,
              result
            ) {
              if (!result) {
                res.json({
                  ok: false,
                  error: 'Старый пароль введен неверно!'
                });
              } else {
                bcrypt.hash(newPassword, null, null, (err, hash) => {
                  userFromDB.password = hash;
                  userFromDB.save();
                  res.json({
                    ok: true
                  });
                });
              }
            });
          }
        })
        .catch(err => {
          console.log('K8 ERROR: Не получилось изменить имя!');
          console.log(err);
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже!'
          });
        });
    }
  }

  function changePhoneNumber(newPhoneNumber) {
    if (!newPhoneNumber || newPhoneNumber.length !== 10) {
      res.json({
        ok: false,
        error: 'После +38 должно быть 10 символов!'
      });
    } else if (!(newPhoneNumber[0] == '0')) {
      res.json({
        ok: false,
        error: 'Номер телефона должен начинаться с 0!'
      });
    } else {
      user
        .findOne({ login })
        .then(userFromDB => {
          if (!userFromDB) {
            console.log('Неавторизованное обращение к базе');
            res.json({
              ok: false,
              error: 'Ошибка, попробуйте позже!'
            });
          } else {
            userFromDB.phonenumber = newPhoneNumber;
            userFromDB.save();
            res.json({
              ok: true
            });
          }
        })
        .catch(err => {
          console.log('K8 ERROR: Не получилось изменить имя!');
          console.log(err);
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже!'
          });
        });
    }
  }

  function changeEmail(newEmail) {
    let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
    if (emailReg.test(newEmail) == false) {
      res.json({
        ok: false,
        error: 'Введите корректный E-mail!'
      });
    } else {
      user
        .findOne({ login })
        .then(userFromDB => {
          if (!userFromDB) {
            console.log('Неавторизованное обращение к базе');
            res.json({
              ok: false,
              error: 'Ошибка, попробуйте позже!'
            });
          } else {
            userFromDB.email = newEmail;
            userFromDB.save();
            res.json({
              ok: true
            });
          }
        })
        .catch(err => {
          console.log('K8 ERROR: Не получилось изменить имя!');
          console.log(err);
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже!'
          });
        });
    }
  }

  function changeName(newName) {
    if (newName < 1 || newName > 20) {
      res.json({
        ok: false,
        error: 'Длина должна быть от 1 до 20 символов!'
      });
    } else {
      user
        .findOne({ login })
        .then(userFromDB => {
          if (!userFromDB) {
            console.log('Неавторизованное обращение к базе');
            res.json({
              ok: false,
              error: 'Ошибка, попробуйте позже!'
            });
          } else {
            userFromDB.name = newName;
            userFromDB.save();
            res.json({
              ok: true
            });
          }
        })
        .catch(err => {
          console.log('K8 ERROR: Не получилось изменить имя!');
          console.log(err);
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже!'
          });
        });
    }
  }
});

router.get('/myorders', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const _id = req.session.userId;
    const login = req.session.userLogin;
    const group = req.session.userGroup;
    const path = '/myorders';
    let shopCart = req.session.shopCart;

    order.find({ 'user.login': login }).then(ordersArr => {
      ordersArr.reverse();
      res.render('profile/myorders', {
        transData: {
          pageTitle: 'Мои заказы',
          user: { _id, login, group },
          path,
          shopCart,
          ordersArr
        }
      });
    });
  } else console.log('юзер незалогинен!');
});

router.get('/mywishlist', function(req, res) {
  let _id = req.session.userId;
  let login = req.session.userLogin;
  let path = '/mywishlist';
  let group = req.session.userGroup;
  let shopCart = req.session.shopCart;

  function fRenderWishlist(wishlistFromDB) {
    p_shopItemsArr.then(function(shopItemsArr) {
      let wishlist = [];

      for (let i = 0; i < wishlistFromDB.length; i++) {
        let markerUsed = false;
        for (let k = 0; k < shopItemsArr.length; k++) {
          if (wishlistFromDB[i].vendorCode == shopItemsArr[k].vendorCode) {
            if (!markerUsed) {
              wishlist.push(shopItemsArr[k]);
              markerUsed = true;
            }
          }
        }
      }

      res.render('profile/mywishlist', {
        transData: {
          wishlist,
          pageTitle: 'Мой список желаний',
          user: { _id, login, group },
          path,
          shopCart
        }
      });
    });
  }

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    path = '/mywishlist';
    group = req.session.userGroup;
    shopCart = req.session.shopCart;

    wishlist
      .findOne({ userLogin: login })
      .then(wishlistFromDB => {
        if (!wishlistFromDB) wishlistFromDB = { wishlist: [{}] };
        fRenderWishlist(wishlistFromDB.wishlist);
      })
      .catch(err => {
        res.render('error', {
          transData: {
            user: { _id, login }
          },
          message: err,
          error: {}
        });
      });
  } else console.log('юзер незалогинен!');
  //console.dir(req);
});

router.get('/user/:targetlogin', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;
  let targetLogin = req.params.targetlogin;
  //********** Def main params of the router *********** */

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  let targetUser;

  user.findOne({ login: targetLogin }).then(userFromDB => {
    //console.log(userFromDB);

    if (userFromDB) {
      targetUser = {};
      targetUser.group = userFromDB.group;
      targetUser.name = userFromDB.name;
      targetUser.email = userFromDB.email;
      targetUser.phonenumber = userFromDB.phonenumber;
      targetUser.login = userFromDB.login;
      targetUser.createdAt = moment(userFromDB.createdAt).format(
        'DD.MM.YYYY, HH:mm'
      );
      targetUser.updatedAt = moment(userFromDB.updatedAt).format(
        'DD.MM.YYYY, HH:mm'
      );
    }

    res.render('profile/target_profile', {
      transData: {
        user: { _id, login, group },
        shopCart,
        pageTitle: 'Профиль пользователя',
        targetUser
      }
    });
  });
});

module.exports = router;

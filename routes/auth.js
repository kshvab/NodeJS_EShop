const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const user = models.user;

// POST is authorized
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (
    !email ||
    !phonenumber ||
    !name ||
    !login ||
    !password ||
    !passwordConfirm
  ) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('register-name');
    if (!email) fieldsForRes.push('register-email');
    if (!phonenumber) fieldsForRes.push('register-phonenumber');
    if (!login) fieldsForRes.push('register-login');
    if (!password) fieldsForRes.push('register-password');
    if (!passwordConfirm) fieldsForRes.push('register-password-confirm');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (!(phonenumber[0] == '0')) {
    res.json({
      ok: false,
      error: 'Номер телефона должен начинаться с 0!',
      fields: ['register-phonenumber']
    });
  } else if (emailReg.test(email) == false) {
    res.json({
      ok: false,
      error: 'Введите корректный E-mail!',
      fields: ['register-email']
    });
  } else if (!(phonenumber.length == 10)) {
    res.json({
      ok: false,
      error: 'Проверьте Ваш номер телефона!',
      fields: ['register-phonenumber']
    });
  } else if (login.length < 3 || login.length > 16) {
    res.json({
      ok: false,
      error: 'Длина логина от 3 до 16 символов!',
      fields: ['register-login']
    });
  } else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['register-login']
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: 'Минимальная длина пароля 5 символов!',
      fields: ['register-password']
    });
  } else if (password !== passwordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!',
      fields: ['register-password', 'register-password-confirm']
    });
  } else {
    user.findOne({ login }).then(userFromDB => {
      if (!userFromDB) {
        bcrypt.hash(password, null, null, (err, hash) => {
          user
            .create({
              _id: new mongoose.Types.ObjectId(),
              name,
              email,
              phonenumber,
              login,
              password: hash
            })
            .then(userToDB => {
              console.log('Добавлен новый пользователь:\n' + userToDB);
              req.session.userId = userToDB._id;
              req.session.userLogin = userToDB.login;
              req.session.userGroup = 'Registered';
              res.json({
                ok: true
              });
            })
            .catch(err => {
              console.log(
                'K8 ERROR: Не получилось добавить пользоваттеля в базу'
              );
              console.log(err);
              res.json({
                ok: false,
                error: 'Ошибка, попробуйте позже!'
              });
            });
        });
      } else {
        res.json({
          ok: false,
          error: 'Такой логин уже занят!',
          fields: ['register-login']
        });
      }
    });
  }
});

// POST is login
router.post('/login', (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  if (!login || !password) {
    const fields = [];
    if (!login) fields.push('login-login');
    if (!password) fields.push('login-password');

    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields
    });
  } else {
    user
      .findOne({ login })
      .then(userFromDB => {
        if (!userFromDB) {
          res.json({
            ok: false,
            error: 'Логин и пароль неверны!',
            fields: ['login-login', 'login-password']
          });
        } else {
          bcrypt.compare(password, userFromDB.password, function(err, result) {
            if (!result) {
              res.json({
                ok: false,
                error: 'Логин и пароль неверны!',
                fields: ['login-login', 'login-password']
              });
            } else {
              req.session.userId = userFromDB._id;
              req.session.userLogin = userFromDB.login;
              req.session.userGroup = userFromDB.group;
              res.json({
                ok: true
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка доступа к базе, попробуйте позже!'
        });
      });
  }
});

// GET for logout
router.get('/logout', (req, res) => {
  if (req.session) {
    // delete session object
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;

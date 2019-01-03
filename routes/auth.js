var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const user = models.User;

// POST is authorized
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if (!email || !name || !login || !password || !passwordConfirm) {
    console.log(name);
    //Треба обробити всі поля!!!
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('register-name');
    if (!email) fieldsForRes.push('register-email');
    if (!login) fieldsForRes.push('register-login');
    if (!password) fieldsForRes.push('register-password');
    if (!passwordConfirm) fieldsForRes.push('register-password-confirm');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
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
              login,
              password: hash
            })
            .then(userToDB => {
              console.log('Добавлен новый пользователь:\n' + userToDB);
              req.session.userId = userFromDB._id;
              req.session.userLogin = userFromDB.login;
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

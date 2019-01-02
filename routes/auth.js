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
  console.dir('==========>' + req.body.login);

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
          error: 'Имя занято!',
          fields: ['login']
        });
      }
    });
  }
});

module.exports = router;

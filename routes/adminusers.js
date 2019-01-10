const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const models = require('../models');
const user = models.user;

router.get('/', function(req, res) {
  let _id;
  let login;
  const path = '/users';
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        user.find().then(usersObj => {
          res.render('administrator/adm_users', {
            transData: {
              pageTitle: 'Управление пользователями',
              usersObj,
              path,
              user: { _id, login }
            }
          });
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login }
          },
          message: 'У Вас нет прав для доступа к этому разделу',
          error: {}
        });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login }
      }
    });
  }
});

router.get('/add', function(req, res) {
  let _id;
  let login;
  const path = '/users';
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        user.find().then(usersObj => {
          res.render('administrator/adm_users_add', {
            transData: {
              pageTitle: 'Добавление пользователя',
              usersObj,
              path,
              user: { _id, login }
            }
          });
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login }
          },
          message: 'У Вас нет прав для доступа к этому разделу',
          error: {}
        });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login }
      }
    });
  }
});

// GET Administrator edit user
router.get('/edit/:editUser', function(req, res) {
  let _id;
  let login;
  const path = '/users';
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
          let editUser = req.params.editUser;
          
          user.findOne({ login: editUser }).then(userFromDB => {
            if (userFromDB) {
              res.render('administrator/adm_users_edit', {
                transData: {
                  pageTitle: 'Редактирование данных пользователя',
                  path,
                  user: { _id, login },
                  editUser: {
                    name: userFromDB.name,
                    login: userFromDB.login,
                    email: userFromDB.email,
                    phonenumber: userFromDB.phonenumber,
                    group: userFromDB.group,
                  }
                }
              });
            } else {
              //Незнайдений у базі, або не адмін
              res.render('error', {
                transData: {
                  user: { _id, login }
                },
                message: 'Пользователь не найден',
                error: {}
              });
            }
          });
      } else {
          //Незнайдений у базі, або не адмін
          res.render('error', {
            transData: {
              user: { _id, login }
            },
            message: 'У Вас нет прав для доступа к этому разделу',
            error: {}
          });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login }
      }
    });
  }

});

// POST Administrator add new user
router.post('/add', (req, res) => {
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
              //console.log('Добавлен новый пользователь:\n' + userToDB);
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

// POST Administrator dell One user
router.post('/', (req, res) => {
  const login = req.body.delUserName;
  user
    .deleteOne({ login })
    .then(DBanswer => {
      //console.dir(DBanswer);
      res.json({
        ok: true
      });
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось удалить' + err);
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось удалить' + err
      });
    });
});

// POST Administrator edit One user
router.post('/edit', (req, res) => {
  const login = req.body.login;
  const email = req.body.email;
  const name = req.body.name;
  const phonenumber = req.body.phonenumber;
  const group = req.body.group;
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (
    !email ||
    !phonenumber ||
    !name ||
    !group
    ) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('register-name');
    if (!email) fieldsForRes.push('register-email');
    if (!phonenumber) fieldsForRes.push('register-phonenumber');
    if (!group) fieldsForRes.push('admin-edit-user-group');
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
      error: 'Проверьте номер телефона!',
      fields: ['register-phonenumber']
    });
  } else {
    user
      .findOne({ login })
      .then(userFromDB => {
        if (userFromDB) {
          userFromDB.email = email;
          userFromDB.name = name;
          userFromDB.phonenumber = phonenumber;
          userFromDB.group = group;
          userFromDB.save();
          res.json({
            ok: true
          });
        }
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
  };
});

// POST Administrator change user password
router.post('/editusrpsw', (req, res) => {
  let editUserLogin = req.body.editUserLogin;
  let newPassword = req.body.newPassword;
  let newPasswordConfirm = req.body.newPasswordConfirm;
  if (!newPassword || !newPasswordConfirm) {
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!'
    });

  } else if (newPassword !== newPasswordConfirm) {
    res.json({
      ok: false,
      error: 'Пароли не совпадают!'
    });
  } else {
    user
      .findOne({ login: editUserLogin })
      .then(userFromDB => {
        if (!userFromDB) {
          console.log('Невозможно найти пользователя в базе');
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже!'
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
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось изменить пароль!');
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  }




});


module.exports = router;

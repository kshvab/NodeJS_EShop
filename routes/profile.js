//var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const user = models.user;
const moment = require('moment');

router.get('/myprofile', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const _id = req.session.userId;
    const login = req.session.userLogin;
    console.log(login + ' ' + _id);
    const path = '/myprofile';

    user.findOne({ login }).then(userFromDB => {
      console.log(userFromDB);

      if (userFromDB) {
        let transData = {
          path,
          user: {
            group: userFromDB.group,
            _id: userFromDB._id,
            name: userFromDB.name,
            email: userFromDB.email,
            phonenumber: userFromDB.phonenumber,
            login: userFromDB.login,
            password: userFromDB.password,
            createdAt: moment(userFromDB.createdAt).format('DD.MM.YYYY, HH:mm'),
            updatedAt: moment(userFromDB.updatedAt).format('DD.MM.YYYY, HH:mm')
          }
        };
        res.render('myprofile', {
          transData: transData
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

router.get('/mycart', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const id = req.session.userId;
    const login = req.session.userLogin;
    const path = '/mycart';

    res.render('mycart', {
      user: { id, login },
      path
    });
  } else console.log('юзер незалогинен!');
  //console.dir(req);
});

router.get('/mywishlist', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const id = req.session.userId;
    const login = req.session.userLogin;
    const path = '/mywishlist';

    res.render('mywishlist', {
      user: { id, login },
      path
    });
  } else console.log('юзер незалогинен!');
  //console.dir(req);
});

module.exports = router;

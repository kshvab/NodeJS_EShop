//const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const models = require('../models');
const user = models.user;
const order = models.order;
const moment = require('moment');

router.get('/', function(req, res) {
  let _id;
  let login;
  let group;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;
    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        res.render('administrator/adm_shop', {
          transData: {
            pageTitle: 'Магазин',
            user: { _id, login, group }
          }
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
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
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

router.get('/orders', function(req, res) {
  let _id;
  let login;
  let group;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;
    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        order.find().then(ordersArr => {
          ordersArr.reverse();

          for (let i = 0; i < ordersArr.length; i++) {
            ordersArr[i].formatedTime = moment(ordersArr[i].createdAt).format(
              'DD.MM.YYYY, HH:mm'
            );
          }

          res.render('administrator/adm_shop_orders', {
            transData: {
              pageTitle: 'Заказы пользователей',
              user: { _id, login, group },
              ordersArr
            }
          });
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
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
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

module.exports = router;

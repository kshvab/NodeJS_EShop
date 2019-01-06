const express = require('express');
const router = express.Router();
const models = require('../models');
const user = models.user;

router.get('/', function(req, res) {
  let _id;
  let login;
  const path = '/';
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        res.render('administrator/administrator', {
          transData: {
            pageTitle: 'Панель управления - Dashboard',
            path,
            user: { _id, login }
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

router.get('/publications', function(req, res) {
  let _id;
  let login;
  const path = '/publications';
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        res.render('administrator/administrator_publications', {
          transData: {
            pageTitle: 'Управление публикациями',
            path,
            user: { _id, login }
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

module.exports = router;

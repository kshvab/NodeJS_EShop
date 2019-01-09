const express = require('express');
const router = express.Router();

const models = require('../models');
const user = models.user;
const publication = models.publication;

const moment = require('moment');

router.get('/', function(req, res) {
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
        publication.find().then(publicationsObj => {
          res.render('administrator/adm_publications', {
            transData: {
              pageTitle: 'Управление публикациями',
              publicationsObj,
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
        res.render('administrator/adm_publications_add', {
          transData: {
            pageTitle: 'Создание публикации',
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

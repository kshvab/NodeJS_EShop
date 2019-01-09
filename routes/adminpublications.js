const express = require('express');
const router = express.Router();
const config = require('../config');
const models = require('../models');
const user = models.user;

const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;

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
        res.render('administrator/adm_publications', {
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


/*
// POST Administrator add new user
router.post('/add', (req, res) => {
  const title = req.body.title;
  let alias;
  if (req.body.alias) alias = slugify(req.body.alias);
  else alias = slugify(req.body.title);
  const status = req.body.status;
  const shorttext = req.body.shorttext;
  const fulltext = req.body.fulltext;
  const picture = req.body.picture;
  const description = req.body.description;
  const keywords = req.body.keywords;

  let recievedData = {
    title,
    alias,
    status,
    shorttext,
    fulltext,
    picture,
    description,
    keywords
  };

  console.log(recievedData);
});
*/



module.exports = router;

const express = require('express');
const router = express.Router();
const moment = require('moment');
const models = require('../models');
const user = models.user;
const publication = models.publication;
var fs = require('fs');

router.get('/', function(req, res) {
  let _id;
  let login;
  const path = '/publications';
  let page;
  let itemsPerPage = 15;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

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
          for (let i = 0; i < publicationsObj.length; i++) {
            publicationsObj[i].formatedTime = moment(
              publicationsObj[i].createdAt
            ).format('DD.MM.YYYY, HH:mm');
          }
          res.render('administrator/adm_publications', {
            transData: {
              pageTitle: 'Управление публикациями',
              publicationsObj,
              path,
              user: { _id, login },
              page,
              itemsPerPage
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

// GET Administrator edit publication
router.get('/edit/:targetPublAlias', function(req, res) {
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
        let targetPublAlias = req.params.targetPublAlias;

        publication.findOne({ alias: targetPublAlias }).then(publFromDB => {
          if (publFromDB) {
            res.render('administrator/adm_publications_edit', {
              transData: {
                pageTitle: 'Редактирование публикации',
                path,
                user: { _id, login },
                publFromDB
              },
              publBodyHtmlCode: publFromDB.fulltext
            });
          } else {
            //Незнайдена у базі
            res.render('error', {
              transData: {
                user: { _id, login }
              },
              message: 'Публикация не найдена',
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

// POST Administrator dell One publication
router.post('/deleteone', (req, res) => {
  const alias = req.body.delPublicationAlias;
  publication
    .findOne({ alias })
    .then(publFromDB => {
      let picturePath = publFromDB.picture;
      fs.unlink(picturePath, err => {
        if (err) console.log('Не получиловь удалить файл ' + err);
        else console.log(picturePath + ' was deleted');
      });
      publFromDB.remove(DBanswer => {
        res.json({
          ok: true
        });
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

router.post('/editone', (req, res) => {
  const title = req.body.title;
  const alias = req.body.alias;
  const status = req.body.status;
  const shorttext = req.body.shorttext;
  const fulltext = req.body.fulltext;
  const description = req.body.description;
  const keywords = req.body.keywords;
  if (!fulltext || fulltext == '<p><br></p>') {
    res.json({
      ok: false,
      error: 'Напишите полный текст для публикации!'
    });
  } else if (!title) {
    res.json({
      ok: false,
      error: 'Заполните поле Заголовок!'
    });
  } else {
    publication
      .findOne({ alias })
      .then(publicationFromDB => {
        if (!publicationFromDB) {
          res.json({
            ok: false,
            error: 'Не могу найти публикацию в базе, попробуйте позже!'
          });
        } else {
          publicationFromDB.title = title;
          publicationFromDB.status = status;
          publicationFromDB.shorttext = shorttext;
          publicationFromDB.fulltext = fulltext;
          publicationFromDB.description = description;
          publicationFromDB.keywords = keywords;
          publicationFromDB.save();
          res.json({
            ok: true
          });
        }
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось добавить публикацию в базу');
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  }
});

module.exports = router;

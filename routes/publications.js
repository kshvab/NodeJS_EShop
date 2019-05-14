const express = require('express');
const router = express.Router();
const moment = require('moment');
const models = require('../models');
const publication = models.publication;

router.get('/', function(req, res) {
  //Temporary redirect to E-Shop
  //res.redirect('/shop');

  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;
  let itemsPerPage = 5;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  let page;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

  let p_publArr = new Promise(function(resolve, reject) {
    publication.find({ status: 'Опубликовано' }).then(publicationsObj => {
      for (let i = 0; i < publicationsObj.length; i++) {
        publicationsObj[i].formatedTime = moment(
          publicationsObj[i].createdAt
        ).format('DD.MM.YYYY, HH:mm');
      }

      if (publicationsObj) resolve(publicationsObj);
      else reject('Can not read the publications DB');
    });
  });

  p_publArr.then(function(publicationsObj) {
    res.render('publications/publ_list', {
      transData: {
        publicationsObj,
        itemsPerPage,
        page,
        pageTitle: 'Публикации',
        user: { _id, login, group },
        shopCart
      }
    });
  });
});

router.get('/:targetPublAlias', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;
  let itemsPerPage = 5;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  let p_publToShow = new Promise(function(resolve, reject) {
    let targetPublAlias = req.params.targetPublAlias;

    publication.findOne({ alias: targetPublAlias }).then(publToShow => {
      if (publToShow) resolve(publToShow);
      else reject('Can not find the publication in DB');
    });
  });

  p_publToShow
    .then(function(publToShow) {
      let pageTitle = publToShow.title,
        description = publToShow.description,
        keywords = publToShow.keywords;

      res.render('publications/publ_show_one', {
        transData: {
          publToShow,
          itemsPerPage,
          pageTitle,
          description,
          keywords,
          user: { _id, login, group },
          shopCart
        }
      });
    })
    .catch(function(error) {
      console.log(error);
      res.render('error', {
        transData: {
          user: { _id, login }
        },
        message: 'Публикация не найдена',
        error: { error }
      });
    });
});

module.exports = router;

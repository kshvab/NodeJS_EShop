const express = require('express');
const router = express.Router();
const models = require('../models');
const publication = models.publication;
const moment = require('moment');

router.get('/', function(req, res) {
  //Temporary redirect to E-Shop
  //res.redirect('/shop');

  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  let p_publArr = new Promise(function(resolve, reject) {
    publication
      .find({ status: 'Опубликовано' })
      .sort({ $natural: -1 })
      .limit(3)
      .then(publicationsObj => {
        //publication.find({ status: 'Опубликовано' }).then(publicationsObj => {
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
    res.render('mainpage', {
      transData: {
        pageTitle: 'Главная',
        user: { _id, login, group },
        shopCart,
        publicationsObj
      }
    });
  });
});

router.get('/login', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }
  res.render('loginForm', {
    transData: {
      pageTitle: 'Форма входа',
      user: { _id, login, group },
      shopCart
    }
  });
});

router.get('/contacts', function(req, res) {
  //Temporary redirect to E-Shop
  //res.redirect('/shop');

  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }
  res.render('contacts', {
    transData: {
      pageTitle: 'Контакты',
      user: { _id, login, group },
      shopCart
    }
  });
});

router.get('/partners', function(req, res) {
  //Temporary redirect to E-Shop
  //res.redirect('/shop');

  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }
  res.render('partners', {
    transData: {
      pageTitle: 'Партнерам',
      user: { _id, login, group },
      shopCart
    }
  });
});

module.exports = router;

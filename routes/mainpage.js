const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
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
  res.render('mainpage', {
    transData: {
      pageTitle: 'Главная',
      user: { _id, login, group },
      shopCart
    }
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

module.exports = router;

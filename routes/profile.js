var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const models = require('../models');
const user = models.User;

router.get('/myprofile', function(req, res) {
  if (req.session.userId && req.session.userLogin) {
    const id = req.session.userId;
    const login = req.session.userLogin;
    const path = '/myprofile';

    res.render('myprofile', {
      user: { id, login },
      path
    });
  } else console.log('юзер незалогинен!');
  //console.dir(req);
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

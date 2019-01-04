const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  let _id;
  let login;
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
  } else {
    console.log('юзер незалогинен!');
    _id = 0;
    login = 0;
  }
  res.render('mainpage', {
    transData: {
      user: { _id, login }
    }
  });
});

module.exports = router;

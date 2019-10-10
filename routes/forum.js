const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../models');
const forumsection = models.forumsection;
const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;

router.get('/', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  //********** Def main params of the router *********** */

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  forumsection.find().then(sections => {
    //console.log(sections);
    res.render('forum/forum_mainpage', {
      transData: {
        user: { _id, login, group },
        shopCart,
        sections
      }
    });
  });
});

function pGetSectionByAliasFromDb(alias) {
  return new Promise(function(resolve, reject) {
    forumsection.findOne({ alias }).then(forumsectionFromDB => {
      if (forumsectionFromDB) resolve(forumsectionFromDB);
      else reject('Не могу достать раздел форума из базы!');
    });
  });
}

router.get('/sections/:sectionalias', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;

  //********** Def main params of the router *********** */

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  let sectionAlias = req.params.sectionalias;

  pGetSectionByAliasFromDb(sectionAlias).then(section => {
    console.log(section);

    res.render('forum/forum_section', {
      transData: {
        user: { _id, login, group },
        shopCart,
        section
      }
    });
  });
});

router.get('/topics', function(req, res) {
  let _id;
  let login;
  let group;

  //********** Def main params of the router *********** */

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  res.render('forum/forum_topic', {
    transData: {
      user: { _id, login, group }
    }
  });
});

router.post('/addnewsection', (req, res) => {
  console.log(req.body);

  let title = req.body.title;
  let description = req.body.description;
  let alias = slugify(title);
  forumsection
    .create({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      alias
    })
    .then(forumsectionToDB => {
      //console.log('Добавлен новый раздел на форум:\n' + forumsectionToDB);
      res.json({
        ok: true
      });
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось добавить forumsection в базу');
      console.log(err);
      res.json({
        ok: false,
        error: 'Ошибка, попробуйте позже!'
      });
    });
});

module.exports = router;

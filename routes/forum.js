const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('../models');
const forumsection = models.forumsection;
const forumtopic = models.forumtopic;
const forumpost = models.forumpost;

const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;
const moment = require('moment');
moment.locale('ru');
var fs = require('fs');

//------------- Functions Area ---------//
function fDeleteForumPicture(picturePath) {
  fs.unlink(picturePath, err => {
    if (err) console.log('Не получиловь удалить файл ' + err);
    else console.log(picturePath + ' was deleted');
  });
}

function pGetSectionByAliasFromDb(alias) {
  return new Promise(function(resolve, reject) {
    forumsection.findOne({ alias }).then(forumsectionFromDB => {
      if (forumsectionFromDB) resolve(forumsectionFromDB);
      else reject('Не могу достать раздел форума из базы!');
    });
  });
}

function pGetTopicsInSectionFromDb(sectionalias) {
  return new Promise(function(resolve, reject) {
    forumtopic.find({ sectionalias }).then(topicsFromDB => {
      if (topicsFromDB) resolve(topicsFromDB);
      else reject('Не могу достать темы раздела из базы!');
    });
  });
}

function pGetPostsInTopicFromDb(topicalias) {
  return new Promise(function(resolve, reject) {
    forumpost.find({ topicalias }).then(postsFromDB => {
      if (postsFromDB) resolve(postsFromDB);
      else reject('Не могу достать посты темы из базы!');
    });
  });
}

function pGetTopicByAliasFromDb(alias) {
  return new Promise(function(resolve, reject) {
    forumtopic.findOne({ alias }).then(forumTopicFromDB => {
      if (forumTopicFromDB) resolve(forumTopicFromDB);
      else reject('Не могу достать topic форума из базы!');
    });
  });
}

function pDelOnePostFromDb(_id) {
  return new Promise(function(resolve, reject) {
    forumpost
      .findOne({ _id })
      .then(postFromDB => {
        if (postFromDB.picture.length) {
          let picturePath = postFromDB.picture;
          fDeleteForumPicture(picturePath);
        }

        postFromDB.remove(DBanswer => {
          resolve({ ok: true });
        });
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось удалить' + err);
        reject({
          ok: false,
          error: 'K8 ERROR: Не получилось удалить' + err
        });
      });
  });
}

function pDelOneTopicFromDb(_id) {
  return new Promise(function(resolve, reject) {
    forumtopic
      .findOne({ _id })
      .then(topicFromDB => {
        if (topicFromDB.picture.length) {
          let picturePath = topicFromDB.picture;
          fDeleteForumPicture(picturePath);
        }

        topicFromDB.remove(DBanswer => {
          console.log('Тема удалена');
          resolve({ ok: true, topicalias: topicFromDB.alias });
        });
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось удалить Topic' + err);
        reject({
          ok: false,
          error: 'K8 ERROR: Не получилось удалить Topic' + err
        });
      });
  });
}

function pDeletePostsOfTheTopic(topicalias) {
  return new Promise(function(resolve, reject) {
    forumpost
      .find({ topicalias: topicalias }) //для удаления фоток готовим архив
      .then(resultArr => {
        //console.log(resultArr);
        let picsArr = [];
        for (let i = 0; i < resultArr.length; i++) {
          picsArr.push(resultArr[i].picture);
        }
        ////-----------------------Рекурсию удаления фоток вставить
      })
      .deleteMany({ topicalias: topicalias })
      .then(result => {
        console.log('В теме удалено ' + result.n + ' постов.');

        resolve({
          ok: true
        });
      })
      .catch(err => {
        console.error(`Delete posts failed with error: ${err}`);
        reject({
          ok: false,
          error: err
        });
      });
  });
}

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
    console.log(sections);
    res.render('forum/forum_mainpage', {
      transData: {
        user: { _id, login, group },
        shopCart,
        sections
      }
    });
  });
});

router.get('/section/:sectionalias', function(req, res) {
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
    //console.log(section);
    pGetTopicsInSectionFromDb(sectionAlias).then(topics => {
      console.log(topics);
      res.render('forum/forum_section', {
        transData: {
          user: { _id, login, group },
          shopCart,
          section,
          topics
        }
      });
    });
  });
});

router.post('/addnewsection', (req, res) => {
  //console.log(req.body);

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

//page for creating topic in current section
router.get('/addnewtopic/:sectionalias', function(req, res) {
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

  let sectionAlias = req.params.sectionalias;

  pGetSectionByAliasFromDb(sectionAlias).then(section => {
    let sectionTitle = section.title;
    res.render('forum/forum_topic_add', {
      transData: {
        user: { _id, login, group },
        sectionAlias,
        sectionTitle
      }
    });
  });
});

//page for creating topic in current section
router.get('/topic/:topicalias', function(req, res) {
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

  let topicAlias = req.params.topicalias;

  pGetTopicByAliasFromDb(topicAlias).then(topic => {
    let topicDate = moment(topic.updatedAt).format('dddd, DD.MM.YYYY, HH:mm');
    topic.date = topicDate;

    pGetPostsInTopicFromDb(topic.alias).then(posts => {
      //console.log(posts);
      //console.log(topic);
      for (let i = 0; i < posts.length; i++) {
        let postDate = moment(posts[i].updatedAt).format(
          'dddd, DD.MM.YYYY, HH:mm'
        );
        posts[i].date = postDate;
      }

      res.render('forum/forum_topic', {
        transData: {
          user: { _id, login, group },
          topic,
          posts
        }
      });
    });
  });
});

// POST Administrator dell One publication
router.delete('/dellpost', (req, res) => {
  const _id = req.body._id;

  pDelOnePostFromDb(_id)
    .then(postDelResult => {
      res.json(postDelResult);
    })
    .catch(postDelErrorResult => {
      res.json(postDelErrorResult);
    });
});

router.delete('/delltopic', (req, res) => {
  const _id = req.body._id;

  pDelOneTopicFromDb(_id)
    .then(topicDelResult => {
      if (topicDelResult.ok)
        return pDeletePostsOfTheTopic(topicDelResult.topicalias);
    })
    .then(postsDelResult => {
      if (postsDelResult.ok) res.json(postsDelResult);
    })
    .catch(errRes => {
      res.json(errRes);
    });
});

router.delete('/dellsection', (req, res) => {
  const _id = req.body._id;
  console.log(_id);

  forumsection
    .findOne({ _id })
    .then(sectionFromDB => {
      sectionFromDB.remove(DBanswer => {
        console.log('Раздел удален успешно');
        //---------Добавить рекурсию удаления всех тем и постов в разделе
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

router.put('/editsection', (req, res) => {
  const _id = req.body._id;
  let title = req.body.title;
  let description = req.body.description;
  let alias = slugify(title);

  forumsection
    .findOne({ _id })
    .then(sectionFromDB => {
      sectionFromDB.title = title;
      sectionFromDB.description = description;
      sectionFromDB.alias = alias;

      sectionFromDB.save().then(() => {
        console.log('Раздел отредактирован успешно');
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
module.exports = router;

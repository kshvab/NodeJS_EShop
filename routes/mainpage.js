const express = require('express');
const router = express.Router();
const models = require('../models');
const publication = models.publication;
const moment = require('moment');
const fs = require('fs');

const {
  imagesMap,
  mainSourceImagesArr
} = require('../public/javascripts/forgedDrawScript/mainSourceImagesArr');

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

router.get('/forgeddraw', function(req, res) {
  let p_shopItemsArr = new Promise(function(resolve, reject) {
    var shopItemsArrStr = fs.readFileSync(
      './public/datafiles/shopItemsArrFile.txt',
      {
        encoding: 'UTF-8'
      }
    );
    var shopItemsArr = JSON.parse(shopItemsArrStr);

    if (shopItemsArr) resolve(shopItemsArr);
    else reject('Can not read ./public/datafiles/shopItemsArrFile.txt');
  });

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
  //console.log(imagesMap);

  p_shopItemsArr.then(shopItemsArr => {
    //console.log(mainSourceImagesArr);

    for (let i = 0; i < mainSourceImagesArr.length; i++) {
      let styleItemsArr = mainSourceImagesArr[i].styleItems;

      for (let k = 0; k < styleItemsArr.length; k++) {
        let itemsArr = styleItemsArr[k].items;

        for (let s = 0; s < itemsArr.length; s++) {
          //console.log(itemsArr[s].vendorId);
          for (let m = 0; m < shopItemsArr.length; m++) {
            //console.log(shopItemsArr[m].vendorCode);
            if (shopItemsArr[m].vendorCode == itemsArr[s].vendorId) {
              mainSourceImagesArr[i].styleItems[k].items[s].price =
                shopItemsArr[m].price;
              mainSourceImagesArr[i].styleItems[k].items[s].basePrice =
                shopItemsArr[m].price;
            }
          }
        }
      }
    }

    //

    //imagesMap,
    //mainSourceImagesArr

    //var price
    //var basePrice

    res.render('forgeddraw', {
      transData: {
        pageTitle: 'Forged Draw',
        user: { _id, login, group },
        shopCart,
        mainSourceImagesArr,
        imagesMap
      }
    });
  });
});

//forgeddraw

module.exports = router;

const express = require('express');
const router = express.Router();
const fs = require('fs');
const models = require('../models');
const order = models.order;
const xml2js = require('xml2js');
const services = require('../services');
//********* Promises ***************/

let p_itemsViewSettings = new Promise(function(resolve, reject) {
  let itemsViewSettingsStr = fs.readFileSync(
    './settings/itemsviewsettings.json',
    {
      encoding: 'UTF-8'
    }
  );
  let itemsViewSettings = JSON.parse(itemsViewSettingsStr);
  if (itemsViewSettings) resolve(itemsViewSettings);
  else reject('Can not read ./settings/itemsviewsettings.json');
});

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

let p_shopCategoriesArr = new Promise(function(resolve, reject) {
  var shopCategoriesArrStr = fs.readFileSync(
    './public/datafiles/shopCategoriesArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopCategoriesArr = JSON.parse(shopCategoriesArrStr);
  if (shopCategoriesArr) resolve(shopCategoriesArr);
  else reject('Can not read ./public/datafiles/shopCategoriesArrFile.txt');
});

let p_priceSettings = new Promise(function(resolve, reject) {
  let priceSettingsStr = fs.readFileSync('./settings/pricesettings.json', {
    encoding: 'UTF-8'
  });
  let priceSettings = JSON.parse(priceSettingsStr);

  if (priceSettings) resolve(priceSettings);
  else reject('Can not read ./settings/pricesettings.json');
});

router.get('/shopsearch', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;
  let page;
  let showDiscountChooser = false;
  let discount = 0;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
    if (group != 'Guest' && group != 'Registered') showDiscountChooser = true;
  } else {
    _id = 0;
    login = 0;
    group = 0;
  }

  if (req.session.discount) discount = req.session.discount;

  let searchQuery;
  if (req.query.hasOwnProperty('searchquery') && req.query.searchquery) {
    searchQuery = req.query.searchquery;
    renderResults(searchQuery);
  } else renderError;

  function renderResults(searchQuery) {
    Promise.all([
      p_shopCategoriesArr,
      p_shopItemsArr,
      p_itemsViewSettings,
      p_priceSettings
    ]).then(function(values) {
      let shopCategoriesArr = values[0];
      let shopItemsArr = values[1];
      let itemsViewSettings = values[2];
      let priceSettings = values[3];

      let itemsPerPage = itemsViewSettings.shopCategorieItemsPerPage;

      let priceKoef = fpriceKoefDef(priceSettings, discount);

      let newshopItemsArr = [];
      for (let i = 0; i < shopItemsArr.length; i++) {
        if (shopItemsArr[i].name.indexOf(searchQuery) != -1) {
          newshopItemsArr.push(shopItemsArr[i]);
        }
      }

      shopItemsArr = newshopItemsArr;
      shopItemsArr = fItemsArrRecalc(
        shopItemsArr,
        priceSettings.kursDolara,
        priceSettings.baseNacenka,
        priceKoef
      );
      let breadcrumbArr = ['Поиск'];
      res.render('shop/shop_search', {
        transData: {
          searchQuery,
          shopCategoriesArr,
          shopItemsArr,
          user: { _id, login, group },
          breadcrumbArr,
          shopCart,
          page,
          itemsPerPage,
          showDiscountChooser,
          discount,
          priceSettings
        }
      });
    });
  }

  function renderError() {
    res.render('error', {
      transData: {
        user: { _id, login, group }
      },
      message: 'Такой страницы не существует!',
      error: { code: 404 }
    });
  }

  //console.log(searchQuery);
});

//************* FUNCTIONS ****** */
function fpriceKoefDef(priceSettings, discount) {
  let koef;
  if (discount == 0) koef = 1;
  else if (discount == 1) koef = 1 - priceSettings.skidka1 / 100;
  else if (discount == 2) koef = 1 - priceSettings.skidka2 / 100;
  else if (discount == 3) koef = 1 - priceSettings.skidka3 / 100;
  return koef;
}

function fItemsArrRecalc(arr, kurs, nacenka, priceKoef) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].basePrice = +(arr[i].price * (1 + nacenka / 100)).toFixed(2);
    arr[i].price = +(arr[i].basePrice * priceKoef).toFixed(2);
  }

  return arr;
}

module.exports = router;

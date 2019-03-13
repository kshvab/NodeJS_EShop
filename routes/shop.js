const express = require('express');
const router = express.Router();
var fs = require('fs');
const models = require('../models');
const order = models.order;

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
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  if (shopItemsArr) resolve(shopItemsArr);
  else reject('Can not read ./public/import_foto/shopItemsArrFile.txt');
});

let p_shopCategoriesArr = new Promise(function(resolve, reject) {
  var shopCategoriesArrStr = fs.readFileSync(
    './public/import_foto/shopCategoriesArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopCategoriesArr = JSON.parse(shopCategoriesArrStr);
  if (shopCategoriesArr) resolve(shopCategoriesArr);
  else reject('Can not read ./public/import_foto/shopCategoriesArrFile.txt');
});

let p_priceSettings = new Promise(function(resolve, reject) {
  let priceSettingsStr = fs.readFileSync('./settings/pricesettings.json', {
    encoding: 'UTF-8'
  });
  let priceSettings = JSON.parse(priceSettingsStr);

  if (priceSettings) resolve(priceSettings);
  else reject('Can not read ./settings/pricesettings.json');
});

router.get(
  '(?:/:pathPart0)(?:/:pathPart1)?(?:/:pathPart2)?(?:/:pathPart3)?(?:/:pathPart4)?(?:/:pathPart5)?(?:/:pathPart6)?',
  function(req, res) {
    let _id;
    let login;
    let group;
    let shopCart = req.session.shopCart;
    let page;
    let showDiscountChooser = false;
    let discount = 0;
    if (req.query.hasOwnProperty('page') && req.query.page)
      page = req.query.page;
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

      shopItemsArr = fItemsArrRecalc(
        shopItemsArr,
        priceSettings.kursDolara,
        priceSettings.baseNacenka,
        priceKoef
      );

      //URL PARSING
      let urlArr = Object.values(req.params); //to array
      urlArr = urlArr.filter(function(x) {
        //delete undefined elements
        return x !== undefined && x !== null;
      });

      let viewsView;
      //The last element in URL is cat or item?
      var isItInCatArr = shopCategoriesArr.filter(function(cat) {
        return cat.catAlias == urlArr[urlArr.length - 1];
      });

      var isItInItemArr = shopItemsArr.filter(function(item) {
        return item.vendorCode == urlArr[urlArr.length - 1];
      });

      if (isItInCatArr[0]) {
        viewsView = 'shop/shop_categorie';
        showCategorie(isItInCatArr[0]);
      } else if (isItInItemArr[0]) {
        viewsView = 'shop/shop_item';
        showItem(isItInItemArr[0]);
      } else {
        res.render('error', {
          transData: {
            user: { _id, login, group }
          },
          message: 'Такой страницы не существует!',
          error: { code: 404 }
        });
      }

      //  if it is Cat :
      function showCategorie(shownCat) {
        let shownCatItems = shopItemsArr.filter(function(item) {
          return item.groups == shownCat.catId;
        });

        var breadcrumbArr = [];

        fullBreadcrumbArr();
        // let us make a Breadcrumb arr
        function fullBreadcrumbArr() {
          let active = true;
          recursBreadcrumbArrPush(shownCat.catId);

          function recursBreadcrumbArrPush(currentCatId) {
            let currentCat = shopCategoriesArr.filter(function(cat) {
              return cat.catId == currentCatId;
            });
            let breadcrumbPart = {
              name: currentCat[0].catName,
              url: '/' + currentCat[0].catAlias,
              active
            };
            active = false;
            breadcrumbArr.push(breadcrumbPart);
            if (
              currentCat[0].catFatherId &&
              !(currentCat[0].catFatherId == 'absent')
            )
              recursBreadcrumbArrPush(currentCat[0].catFatherId);
          }

          var breadcrumbShop = {
            name: 'Каталог',
            url: 'shop',
            active: false
          };
          breadcrumbArr.push(breadcrumbShop);
          var breadcrumbMainPage = {
            name: 'Главная',
            url: '/',
            active: false
          };
          breadcrumbArr.push(breadcrumbMainPage);
          breadcrumbArr.reverse();

          //urls in arr are not full yet, so:
          let fullUrl = '';
          for (let i = 0; i < breadcrumbArr.length; i++) {
            breadcrumbArr[i].url = fullUrl + breadcrumbArr[i].url;
            fullUrl = breadcrumbArr[i].url;
          }
        }

        res.render(viewsView, {
          transData: {
            shopItemsArr,
            shopCategoriesArr,
            user: { _id, login, group },
            shownCat,
            shownCatItems,
            breadcrumbArr,
            shopCart,
            page,
            itemsPerPage,
            showDiscountChooser,
            discount,
            priceSettings
          }
        });
        //console.log(shownCat);
      }

      //  if it is Item :
      function showItem(shownItem) {
        var breadcrumbArr = [];

        fullBreadcrumbArr();
        // let us make a Breadcrumb arr
        function fullBreadcrumbArr() {
          var breadcrumbEnd = {
            name: shownItem.name,
            url: '/' + shownItem.vendorCode,
            active: true
          };
          breadcrumbArr.push(breadcrumbEnd);

          recursBreadcrumbArrPush(shownItem.groups);

          function recursBreadcrumbArrPush(currentCatId) {
            let currentCat = shopCategoriesArr.filter(function(cat) {
              return cat.catId == currentCatId;
            });
            let breadcrumbPart = {
              name: currentCat[0].catName,
              url: '/' + currentCat[0].catAlias,
              active: false
            };
            breadcrumbArr.push(breadcrumbPart);
            if (
              currentCat[0].catFatherId &&
              !(currentCat[0].catFatherId == 'absent')
            )
              recursBreadcrumbArrPush(currentCat[0].catFatherId);
          }

          var breadcrumbShop = {
            name: 'Каталог',
            url: 'shop',
            active: false
          };
          breadcrumbArr.push(breadcrumbShop);
          var breadcrumbMainPage = {
            name: 'Главная',
            url: '/',
            active: false
          };
          breadcrumbArr.push(breadcrumbMainPage);
          breadcrumbArr.reverse();

          //urls in arr are not full yet, so:
          let fullUrl = '';
          for (let i = 0; i < breadcrumbArr.length; i++) {
            breadcrumbArr[i].url = fullUrl + breadcrumbArr[i].url;
            fullUrl = breadcrumbArr[i].url;
          }
        }
        //console.log(breadcrumbArr);

        res.render(viewsView, {
          transData: {
            shopItemsArr,
            shopCategoriesArr,
            user: { _id, login, group },
            shownItem,
            breadcrumbArr,
            shopCart,
            showDiscountChooser,
            discount,
            priceSettings
          }
        });
        //console.log(shownItem);
      }
    });
  }
);

router.get('/', function(req, res) {
  let _id;
  let login;
  let group;
  let shopCart = req.session.shopCart;
  let page;
  let showDiscountChooser = false;
  let discount = 0;

  //********** Def main params of the router *********** */
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

    let itemsPerPage = itemsViewSettings.shopMainPageItemsPerPage;

    let priceKoef = fpriceKoefDef(priceSettings, discount);

    shopItemsArr = fItemsArrRecalc(
      shopItemsArr,
      priceSettings.kursDolara,
      priceSettings.baseNacenka,
      priceKoef
    );

    res.render('shop/shop_mainpage', {
      transData: {
        shopItemsArr,
        shopCategoriesArr,
        user: { _id, login, group },
        shopCart,
        page,
        itemsPerPage,
        showDiscountChooser,
        discount,
        priceSettings
      }
    });
  });
});

router.post('/changediscount', (req, res) => {
  req.session.discount = req.body.newDiscount;

  res.json({
    ok: true
  });
});

// DELETE order
router.delete('/deleteorder', (req, res) => {
  const _id = req.body.delOrder_id;
  order
    .findOne({ _id })
    .then(orderFromDB => {
      orderFromDB.remove(DBanswer => {
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

router.post('/editorder', (req, res) => {
  const _id = req.body.editOrder_id;
  order
    .findOne({ _id })
    .then(orderFromDB => {
      console.log();
      req.session.shopCart = orderFromDB.shopcart;
      req.session.discount = +orderFromDB.discount;
      req.session.editedOrder_id = +orderFromDB._id;

      req.session.editedOrderOrdercomment = orderFromDB.user.ordercomment;
      req.session.editedOrderCustomer = orderFromDB.user.customer;
      res.json({
        ok: true
      });
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось редактировать заказ' + err);
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось редактировать заказ' + err
      });
    });
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
    arr[i].basePrice = +((arr[i].inputPriceUsd * kurs * nacenka) / 100).toFixed(
      2
    );
    arr[i].price = +(arr[i].basePrice * priceKoef).toFixed(2);
  }
  return arr;
}

module.exports = router;

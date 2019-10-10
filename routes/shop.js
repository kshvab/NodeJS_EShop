const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongoose = require('mongoose');
const models = require('../models');
const order = models.order;
const wishlist = models.wishlist;
const testimonial = models.testimonial;
const xml2js = require('xml2js');
const services = require('../services');
const excel = require('excel4node');
//********* Promises ***************/

router.get(
  '(?:/:pathPart0)(?:/:pathPart1)?(?:/:pathPart2)?(?:/:pathPart3)?(?:/:pathPart4)?(?:/:pathPart5)?(?:/:pathPart6)?',

  function(req, res) {
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

    let p_shopUsersArr = new Promise(function(resolve, reject) {
      let shopUsersArrStr = fs.readFileSync(
        './public/datafiles/shopUsersArrFile.txt',
        {
          encoding: 'UTF-8'
        }
      );
      let shopUsersArr = JSON.parse(shopUsersArrStr);

      if (shopUsersArr) resolve(shopUsersArr);
      else reject('Can not read ./public/datafiles/shopUsersArrFile.txt');
    });

    let p_priceSettings = new Promise(function(resolve, reject) {
      let priceSettingsStr = fs.readFileSync('./settings/pricesettings.json', {
        encoding: 'UTF-8'
      });
      let priceSettings = JSON.parse(priceSettingsStr);

      if (priceSettings) resolve(priceSettings);
      else reject('Can not read ./settings/pricesettings.json');
    });

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
      p_priceSettings,
      p_shopUsersArr
    ]).then(function(values) {
      let shopCategoriesArr = values[0];
      let shopItemsArr = values[1];
      let itemsViewSettings = values[2];
      let priceSettings = values[3];
      let shopUsersArr = values[4];

      let itemsPerPage = itemsViewSettings.shopCategorieItemsPerPage;

      let userFrom1S = shopUsersArr.find(x => x.email === req.session.email);

      let priceKoef;

      if (userFrom1S != undefined && userFrom1S.discount) {
        discount = userFrom1S.discount;
        priceKoef = 1 - userFrom1S.discount / 100;
      } else {
        priceKoef = fpriceKoefDef(priceSettings, discount);
      }

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

        //console.log(shownCatItems[0]);
        //console.log(shopCategoriesArr);
        //console.log(discount);
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
            priceSettings,
            pageTitle: shownCat.catTitle,
            description: shownCat.catDescription,
            keywords: shownCat.catKeywords
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

        testimonial
          .find({ shopitemid: shownItem.vendorCode, approved: true })
          .then(testimonialArr => {
            testimonialArr.reverse();
            //console.log(shownItem);
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
                priceSettings,
                testimonialArr
              }
            });
          })
          .catch(err => {
            console.log('K8 ERROR: Нет доступа к базе.' + err);
            res.render('error', {
              transData: {
                user: { _id, login, group }
              },
              message: 'Ошибка сервера, попробуйте позже!',
              error: { code: 503 }
            });
          });

        //console.log(shownItem);
      }
    });
  }
);

router.get('/', function(req, res) {
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

  let p_shopUsersArr = new Promise(function(resolve, reject) {
    let shopUsersArrStr = fs.readFileSync(
      './public/datafiles/shopUsersArrFile.txt',
      {
        encoding: 'UTF-8'
      }
    );
    let shopUsersArr = JSON.parse(shopUsersArrStr);

    if (shopUsersArr) resolve(shopUsersArr);
    else reject('Can not read ./public/datafiles/shopUsersArrFile.txt');
  });

  let p_priceSettings = new Promise(function(resolve, reject) {
    let priceSettingsStr = fs.readFileSync('./settings/pricesettings.json', {
      encoding: 'UTF-8'
    });
    let priceSettings = JSON.parse(priceSettingsStr);

    if (priceSettings) resolve(priceSettings);
    else reject('Can not read ./settings/pricesettings.json');
  });

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
    p_priceSettings,
    p_shopUsersArr
  ]).then(function(values) {
    let shopCategoriesArr = values[0];
    let shopItemsArr = values[1];
    let itemsViewSettings = values[2];
    let priceSettings = values[3];
    let shopUsersArr = values[4];

    let itemsPerPage = itemsViewSettings.shopMainPageItemsPerPage;

    let userFrom1S = shopUsersArr.find(x => x.email === req.session.email);

    let priceKoef;
    if (userFrom1S != undefined && userFrom1S.discount) {
      discount = userFrom1S.discount;
      priceKoef = 1 - userFrom1S.discount / 100;
    } else {
      priceKoef = fpriceKoefDef(priceSettings, discount);
    }

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

router.post('/unloadorder', (req, res) => {
  const _id = req.body.unloadOrder_id;
  order
    .findOne({ _id })
    .then(orderFromDB => {
      let orderStr = JSON.stringify(orderFromDB);
      let order = JSON.parse(orderStr);
      var myXmlBuilder = new xml2js.Builder();
      var orderXml = myXmlBuilder.buildObject(order);
      //console.log(orderXml);

      fs.writeFile(
        './ftpshared/orders/order_' + orderFromDB._id + '.xml',
        orderXml,
        function(err) {
          if (err) {
            console.log('ERROR Order XML Saving!');
          } else {
            orderFromDB.unloaded = true;
            orderFromDB.save();

            services.order2xls.order2XLS(orderFromDB);
            console.log('Saved Order XML!');
            res.json({
              ok: true
            });
          }
        }
      );
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось выгрузить заказ' + err);
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось выгрузить заказ' + err
      });
    });
});

router.post('/search', function(req, res) {
  const newSearchQuery = req.body.newSearchQuery;

  if (newSearchQuery.length < 3) {
    res.json({
      ok: false,
      error: 'Длина запроса - минимум 3 символа!'
    });
  } else {
    res.json({
      ok: true
    });
  }
});

router.post('/testimonial', (req, res) => {
  const shopitemid = req.body.newTestimonialItemVendorCode;
  const authorname = req.body.newTestimonialAuthorName;
  const content = req.body.newTestimonialContent;

  let ok = true,
    authorNameError = false,
    contentError = false,
    error = '';

  if (authorname.length < 3) {
    ok = false;
    authorNameError = true;
    error = 'Проверьте имя автора!';
  }
  if (content.length < 10) {
    ok = false;
    contentError = true;
    error = error + ' Отзыв не содержательный!';
  }

  if (ok) {
    testimonial
      .create({
        _id: new mongoose.Types.ObjectId(),
        shopitemid,
        authorname,
        content
      })
      .then(testimonialToDB => {
        res.json({
          ok,
          authorNameError,
          contentError,
          error
        });
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось добавить комментарий в базу');
        console.log(err);
        res.json({
          ok: false,
          authorNameError,
          contentError,
          error: 'Ошибка на стороне сервера,попробуйте позже!'
        });
      });
  } else {
    res.json({
      ok,
      authorNameError,
      contentError,
      error
    });
  }
});

// DELETE deletetestimonial
router.delete('/deletetestimonial', (req, res) => {
  const _id = req.body.delTestimonial_id;
  testimonial
    .findOne({ _id })
    .then(testimonialFromDB => {
      testimonialFromDB.remove(DBanswer => {
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

router.post('/approvetestimonial', (req, res) => {
  const _id = req.body.testimonial_id;
  testimonial
    .findOne({ _id })
    .then(testimonialFromDB => {
      testimonialFromDB.approved = true;
      testimonialFromDB.save();
      res.json({
        ok: true
      });
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось одобрить отзыв' + err);
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось одобрить отзыв' + err
      });
    });
});

router.post('/additemtowishlist', (req, res) => {
  let userLogin;
  if (req.session.userLogin) userLogin = req.session.userLogin;
  const itemVendorCode = req.body.itemVendorCode;

  function fResOk() {
    res.json({
      ok: true
    });
  }

  function fCreateNewWishlist() {
    wishlist
      .create({
        userLogin,
        wishlist: [{ vendorCode: itemVendorCode }]
      })
      .then(wishlistFromDB => {
        fResOk();
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось создать wishlist в базе');
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  }

  wishlist
    .findOne({ userLogin })
    .then(wishlistFromDB => {
      if (!wishlistFromDB) fCreateNewWishlist();
      else {
        let isInWishList = false;
        for (let i = 0; i < wishlistFromDB.wishlist.length; i++) {
          if (wishlistFromDB.wishlist[i].vendorCode == itemVendorCode) {
            isInWishList = true;
          }
        }
        if (isInWishList) fResOk();
        else {
          wishlistFromDB.wishlist.push({ vendorCode: itemVendorCode });
          wishlistFromDB
            .save()
            .then(wishlistEdited => {
              fResOk();
            })
            .catch(err => {
              console.log(
                'K8 ERROR: Не получилось редактировать wishlist в базе'
              );
              console.log(err);
              res.json({
                ok: false,
                error: 'Ошибка, попробуйте позже!'
              });
            });
        }
      }
    })
    .catch(err => {
      console.log('K8 ERROR: Не получилось найти wishlistFromDB' + err);
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось удалить' + err
      });
    });
});

router.delete('/deleteitemfromwishlist', (req, res) => {
  const vendorCode = req.body.delWishListItemVendorCode;
  let userLogin;
  if (req.session.userLogin) userLogin = req.session.userLogin;

  wishlist
    .findOne({ userLogin })
    .then(wishListFromDB => {
      for (let i = 0; i < wishListFromDB.wishlist.length; i++) {
        if (wishListFromDB.wishlist[i].vendorCode == vendorCode)
          wishListFromDB.wishlist.splice(i, 1);
      }

      wishListFromDB.save();

      res.json({
        ok: true
      });
    })
    .catch(err => {
      console.log(
        'K8 ERROR: Не получилось удалить товар из списка желаний' + err
      );
      res.json({
        ok: false,
        error: 'K8 ERROR: Не получилось удалить товар из списка желаний' + err
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
    arr[i].basePrice = +(arr[i].price * (1 + nacenka / 100)).toFixed(2);
    arr[i].price = +(arr[i].basePrice * priceKoef).toFixed(2);
  }

  return arr;
}

router.post('/shopcarttoxls', (req, res) => {
  let shopCart = req.session.shopCart;
  fCreateXLSFromShopCart(shopCart)
    .then(result => {
      //console.log('result ' + result);
      if (result) {
        res.json({
          ok: true,
          link: result
        });
      } else {
        res.json({
          ok: false
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.json({
        ok: false,
        error
      });
    });
});

function fCreateXLSFromShopCart(shopCart) {
  return new Promise((resolve, reject) => {
    //console.log('shopCart \n' + shopCart);

    // Create a new instance of a Workbook class
    var workbook = new excel.Workbook();

    // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.column(1).setWidth(30);
    worksheet.column(2).setWidth(12);
    worksheet.column(3).setWidth(15);
    worksheet.column(4).setWidth(15);
    worksheet.column(5).setWidth(15);
    worksheet.column(6).setWidth(12);
    worksheet.column(7).setWidth(12);
    worksheet.column(8).setWidth(12);

    //worksheet.row(1).setHeight(20);

    // Create a reusable style
    var userStyle = workbook.createStyle({
      font: {
        bold: true,
        color: '#FF0800',
        size: 12
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    var shopcartStyle = workbook.createStyle({
      font: {
        bold: true,
        color: '#001684',
        size: 12
      },
      numberFormat: '$#,##0.00; ($#,##0.00); -'
    });

    var summStyle = workbook.createStyle({
      font: {
        bold: true
      },
      numberFormat: '#,##0.00; (#,##0.00); -'
    });

    worksheet
      .cell(1, 1)
      .string('КОРЗИНА ТОВАРОВ')
      .style(shopcartStyle);

    worksheet
      .cell(2, 1)
      .string('Наименование')
      .style(shopcartStyle);

    worksheet
      .cell(2, 2)
      .string('vendorCode')
      .style(shopcartStyle);

    worksheet
      .cell(2, 3)
      .string('Цена, грн')
      .style(shopcartStyle);

    worksheet
      .cell(2, 4)
      .string('Количество')
      .style(shopcartStyle);

    worksheet
      .cell(2, 5)
      .string('Сумма')
      .style(shopcartStyle);

    let totalUah = 0;
    for (let i = 0; i < shopCart.length; i++) {
      worksheet.cell(2 + 1 + i, 1).string(shopCart[i].name);

      worksheet.cell(2 + 1 + i, 2).string(shopCart[i].vendorCode);

      worksheet.cell(2 + 1 + i, 3).number(+shopCart[i].price);

      worksheet.cell(2 + 1 + i, 4).number(+shopCart[i].quantity);

      worksheet
        .cell(2 + 1 + i, 5)
        .number(shopCart[i].quantity * shopCart[i].price)
        .style(summStyle);
      totalUah += shopCart[i].quantity * shopCart[i].price;
    }
    worksheet
      .cell(2 + 2 + shopCart.length, 4)
      .string('ИТОГО:')
      .style(userStyle);
    worksheet
      .cell(2 + 2 + shopCart.length, 5)
      .number(totalUah)
      .style(summStyle);

    var d = new Date();
    var t = d.getTime();
    let savePath = './ftpshared/xls_shopcarts/' + t + '.xlsx';
    let downloadPath = './xls_shopcarts/' + t + '.xlsx';
    workbook.write(savePath, function(err, stats) {
      if (err) {
        console.error(err);
        reject(null);
      } else {
        //console.log('XLS saved (k.8)');
        resolve(downloadPath);
      }
    });
  });
}
module.exports = router;

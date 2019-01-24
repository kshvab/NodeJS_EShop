const express = require('express');
const router = express.Router();
var fs = require('fs');
const models = require('../models');
const user = models.user;

// POST Add item to shopCart
router.post('/additem', (req, res) => {
  const itemVendorCode = req.body.itemVendorCode;
  const quantity = req.body.quantity;
  if (!req.session.shopCart) req.session.shopCart = [];
  var shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  var itemForAdding = shopItemsArr.filter(function(item) {
    return item.vendorCode == itemVendorCode;
  });
  itemForAdding = itemForAdding[0];
  itemForAdding.quantity = quantity;

  let existInshopCart = false;
  let index = 0;
  for (var i = 0; i < req.session.shopCart.length; i++) {
    if (req.session.shopCart[i].vendorCode == itemVendorCode) {
      req.session.shopCart[i].quantity =
        parseInt(req.session.shopCart[i].quantity) + parseInt(quantity);
      existInshopCart = true;
      index = i;
    }
  }

  if (!existInshopCart) req.session.shopCart.unshift(itemForAdding);
  else
    req.session.shopCart.splice(0, 0, req.session.shopCart.splice(index, 1)[0]);
  console.log('сесія у роуті перед респондом');
  console.log(req.session);
  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});

// DELETE Delete item from shopCart
router.delete('/deleteitem', (req, res) => {
  const itemDelId = req.body.itemDelId;
  var delIndex;
  if (req.session.shopCart) {
    for (var i = 0; i < req.session.shopCart.length; i++) {
      if (req.session.shopCart[i].vendorCode == itemDelId) {
        delIndex = i;
      }
    }
    req.session.shopCart.splice(delIndex, 1);
  }

  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});

/*
// PUT minus item quantity in shopCart
router.put('/minusone', (req, res) => {
  const itemId = req.body.itemId;
  if (req.session.shopCart) {
    for (var i = 0; i < req.session.shopCart.length; i++) {
      if (req.session.shopCart[i].vendorCode == itemId) {
        req.session.shopCart[i].quantity--;
      }
    }
  }
  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});

// PUT plus item quantity in shopCart
router.put('/plusone', (req, res) => {
  const itemId = req.body.itemId;
  if (req.session.shopCart) {
    for (var i = 0; i < req.session.shopCart.length; i++) {
      if (req.session.shopCart[i].vendorCode == itemId) {
        req.session.shopCart[i].quantity++;
      }
    }
  }
  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});
*/

// PUT Change Item Quantity in shopCart
router.put('/changeitemquantity', (req, res) => {
  const itemId = req.body.itemId;
  const newQuantity = req.body.newQuantity;
  if (req.session.shopCart) {
    for (var i = 0; i < req.session.shopCart.length; i++) {
      if (req.session.shopCart[i].vendorCode == itemId) {
        req.session.shopCart[i].quantity = newQuantity;
      }
    }
  }
  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});

router.get('/', function(req, res) {
  let _id, login, group, shopCart;
  shopCart = req.session.shopCart;
  /*
  var shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  var shopCategoriesArrStr = fs.readFileSync(
    './public/import_foto/shopCategoriesArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopCategoriesArr = JSON.parse(shopCategoriesArrStr);
    */
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (userFromDB) {
        group = userFromDB.group;
        //Тут іде основний блок для рендерінга
        res.render('shop/shop_cart', {
          transData: {
            //shopItemsArr,
            //shopCategoriesArr,
            pageTitle: 'Оформление заказа',
            user: { _id, login, group },
            shopCart
          }
        });
      } else {
        //Незнайдений у базі
        res.render('error', {
          transData: {
            user: { _id, login }
          },
          message: 'Ошибка, попробуйте позже!',
          error: {}
        });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    group = 0;
    //Тут іде основний блок для рендерінга
    res.render('shop/shop_cart', {
      transData: {
        //shopItemsArr,
        //shopCategoriesArr,
        pageTitle: 'Оформление заказа',
        user: { _id, login, group },
        shopCart
      }
    });
  }
});

module.exports = router;

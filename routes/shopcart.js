const express = require('express');
const router = express.Router();
var fs = require('fs');
const models = require('../models');
const user = models.user;

// POST Add item to shopCart
router.post('/additem', (req, res) => {
  const itemVendorCode = req.body.itemVendorCode;
  const quantity = req.body.quantity;

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

  if (!req.session.shopCart) req.session.shopCart = [];

  let existInshopCart = false;

  for (var i = 0; i < req.session.shopCart.length; i++) {
    if (req.session.shopCart[i].vendorCode == itemVendorCode) {
      req.session.shopCart[i].quantity =
        parseInt(req.session.shopCart[i].quantity) + parseInt(quantity);
      existInshopCart = true;
    }
  }

  if (!existInshopCart) req.session.shopCart.unshift(itemForAdding);
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

/*
// PUT Change Quantity in shopCart
router.put('/changequantity', (req, res) => {
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
*/

router.get('/', function(req, res) {
  let _id;
  let login;
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
    let shopCart = req.session.shopCart;

    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager' ||
        userFromDB.group == 'Agent'
      ) {
        //Тут іде основний блок для рендерінга
        res.render('shop/shop_cart', {
          transData: {
            //shopItemsArr,
            //shopCategoriesArr,
            pageTitle: 'Оформление заказа',
            user: { _id, login },
            shopCart
          }
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login }
          },
          message: 'У Вас нет прав для доступа к этому разделу',
          error: {}
        });
      }
    });
  } else {
    //нема сесії
    _id = 0;
    login = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login }
      }
    });
  }
});

module.exports = router;

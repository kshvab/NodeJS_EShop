const express = require('express');
const router = express.Router();
var fs = require('fs');
const models = require('../models');
const user = models.user;
const order = models.order;
const counter = models.counter;

function getNextSequenceValue(sequenceName) {
  return new Promise(function(resolve, reject) {
    counter.findOne({ _id: sequenceName }).then(counterFromDB => {
      let currentNumber = counterFromDB.sequence_value;
      counterFromDB.sequence_value = currentNumber + 1;
      counterFromDB.save();
      resolve(counterFromDB.sequence_value);
    });
  });
}

// POST Add item to shopCart
router.post('/additem', (req, res) => {
  const itemVendorCode = req.body.itemVendorCode;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const basePrice = req.body.basePrice;
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
  itemForAdding.price = price;
  itemForAdding.basePrice = basePrice;

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
    req.session.shopCart.splice(0, 0, req.session.shopCart.splice(index, 1)[0]); //move element to start of Arr
  console.log('сесія у роуті перед респондом');
  console.log(req.session.shopCart);
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

  //Delivery Service data

  var citiesArrJson = fs.readFileSync(
    './public/datafiles/deliveryservice/citiesArr.json',
    {
      encoding: 'UTF-8'
    }
  );
  var cities = JSON.parse(citiesArrJson);

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;

    user.findOne({ login }).then(userFromDB => {
      if (userFromDB) {
        group = userFromDB.group;
        //Тут іде основний блок для рендерінга
        res.render('shop/shop_cart', {
          transData: {
            pageTitle: 'Оформление заказа',
            user: userFromDB,
            shopCart,
            cities
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
        shopCart,
        cities
      }
    });
  }
});

router.post('/neworder', (req, res) => {
  let discount;
  if (req.session.hasOwnProperty('discount')) discount = req.session.discount;
  else discount = 0;

  console.dir(req.session.shopCart);
  console.dir(req.body.user);

  getNextSequenceValue('order_id').then(_id => {
    _id = Number(_id);
    console.log('_id ' + _id);
    order
      .create({
        _id,
        user: req.body.user,
        shopcart: req.session.shopCart,
        discount
      })

      .then(orderToDB => {
        req.session.shopCart = [];
        res.json({
          ok: true,
          newOrderNumber: orderToDB._id
        });
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось добавить orderToDB в базу');
        console.log(err);
        res.json({
          ok: false,
          error: 'Ошибка, попробуйте позже!'
        });
      });
  });
});

module.exports = router;

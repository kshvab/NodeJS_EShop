const express = require('express');
const router = express.Router();
var fs = require('fs');
const models = require('../models');
const user = models.user;
const order = models.order;
const counter = models.counter;
const xml2js = require('xml2js');
const services = require('../services');

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

function fOrderOnload(orderToDB) {
  let orderStr = JSON.stringify(orderToDB);
  let order = JSON.parse(orderStr);
  var myXmlBuilder = new xml2js.Builder();
  var orderXml = myXmlBuilder.buildObject(order);
  fs.writeFile(
    './ftpshared/orders/order_' + orderToDB._id + '.xml',
    orderXml,
    function(err) {
      if (err) {
        console.log('ERROR Order XML Saving!');
      } else {
        orderToDB.unloaded = true;
        orderToDB.save();
        console.log('Saved Order ' + orderToDB._id + ' XML!');
      }
    }
  );
}

// POST Add item to shopCart
router.post('/additem', (req, res) => {
  const itemVendorCode = req.body.itemVendorCode;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const basePrice = req.body.basePrice;
  if (!req.session.shopCart) req.session.shopCart = [];

  var shopItemsArrStr = fs.readFileSync(
    './public/datafiles/shopItemsArrFile.txt',
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

  let ordercomment;
  let customer;
  let editedOrder_id;
  if (req.session.hasOwnProperty('editedOrder_id'))
    editedOrder_id = req.session.editedOrder_id;
  if (req.session.hasOwnProperty('editedOrderOrdercomment'))
    ordercomment = req.session.editedOrderOrdercomment;
  if (req.session.hasOwnProperty('editedOrderCustomer'))
    customer = req.session.editedOrderCustomer;

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
            cities,
            ordercomment,
            customer,
            editedOrder_id
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

  if (
    req.session.hasOwnProperty('editedOrder_id') &&
    req.session.editedOrder_id != undefined
  ) {
    const _id = req.session.editedOrder_id;
    order
      .findOne({ _id })
      .then(orderFromDB => {
        orderFromDB.shopcart = req.session.shopCart;
        orderFromDB.user = req.body.user; //Jq gives a new data
        //clean session data
        req.session.shopCart = [];
        req.session.editedOrder_id = undefined;
        req.session.editedOrderOrdercomment = undefined;
        req.session.editedOrderCustomer = undefined;

        orderFromDB.save();
        res.json({
          ok: true,
          newOrderNumber: _id
        });
      })
      .catch(err => {
        console.log('K8 ERROR: Не получилось редактировать заказ' + err);
        res.json({
          ok: false,
          error: 'K8 ERROR: Не получилось редактировать заказ' + err
        });
      });
  } else {
    getNextSequenceValue('order_id').then(_id => {
      _id = Number(_id);

      order
        .create({
          _id,
          user: req.body.user,
          shopcart: req.session.shopCart,
          discount
        })

        .then(orderToDB => {
          req.session.shopCart = [];

          if (
            orderToDB.user.group == 'Registered' ||
            orderToDB.user.group == 'Guest'
          ) {
            fOrderOnload(orderToDB);
            services.order2xls.order2XLS(orderToDB);
            services.mailorderconfirmtouser.sendOrderMail(
              orderToDB._id,
              orderToDB.user.email
            );
          }

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
  }
});

module.exports = router;

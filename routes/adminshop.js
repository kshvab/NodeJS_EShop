//const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();
const models = require('../models');
const user = models.user;
const order = models.order;
const testimonial = models.testimonial;
const services = require('../services');
const moment = require('moment');

var fs = require('fs');

router.get('/', function(req, res) {
  let _id;
  let login;
  let group;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;

    let priceSettingsStr = fs.readFileSync('./settings/pricesettings.json', {
      encoding: 'UTF-8'
    });
    let priceSettings = JSON.parse(priceSettingsStr);

    let itemsViewSettingsStr = fs.readFileSync(
      './settings/itemsviewsettings.json',
      {
        encoding: 'UTF-8'
      }
    );
    let itemsViewSettings = JSON.parse(itemsViewSettingsStr);

    let importSettingsStr = fs.readFileSync('./settings/importsettings.json', {
      encoding: 'UTF-8'
    });

    let importSettings = JSON.parse(importSettingsStr);
    importSettings.updateTime = moment(importSettings.updateTime).format(
      'DD.MM.YYYY, HH:mm:ss'
    );

    //console.log(priceSettings);
    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        res.render('administrator/adm_shop', {
          transData: {
            pageTitle: 'Магазин - настройки',
            user: { _id, login, group },
            priceSettings,
            itemsViewSettings,
            importSettings
          }
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
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
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

router.get('/orders', function(req, res) {
  let _id;
  let login;
  let group;
  let page;
  let itemsPerPage = 15;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;
    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        order.find().then(ordersArr => {
          ordersArr.reverse();

          for (let i = 0; i < ordersArr.length; i++) {
            ordersArr[i].formatedTime = moment(ordersArr[i].createdAt).format(
              'DD.MM.YYYY, HH:mm'
            );
          }

          res.render('administrator/adm_shop_orders', {
            transData: {
              pageTitle: 'Заказы пользователей',
              user: { _id, login, group },
              ordersArr,
              page,
              itemsPerPage
            }
          });
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
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
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

// POST Admin Shop pricesettings
router.post('/pricesettings', (req, res) => {
  const kursDolara = req.body.kursDolara;
  const baseNacenka = req.body.baseNacenka;
  const skidka1 = req.body.skidka1;
  const skidka2 = req.body.skidka2;
  const skidka3 = req.body.skidka3;

  let priceSettingsArr = {
    kursDolara,
    baseNacenka,
    skidka1,
    skidka2,
    skidka3
  };

  let floatReg = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

  if (!kursDolara || !baseNacenka || !skidka1 || !skidka2 || !skidka3) {
    let fieldsForRes = [];
    if (!kursDolara) fieldsForRes.push('usd-kurs');
    if (!baseNacenka) fieldsForRes.push('base-nacenka');
    if (!skidka1) fieldsForRes.push('skidka1');
    if (!skidka2) fieldsForRes.push('skidka2');
    if (!skidka3) fieldsForRes.push('skidka3');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (floatReg.test(kursDolara) == false) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['usd-kurs']
    });
  } else if (floatReg.test(baseNacenka) == false) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['base-nacenka']
    });
  } else if (floatReg.test(skidka1) == false) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['skidka1']
    });
  } else if (floatReg.test(skidka2) == false) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['skidka2']
    });
  } else if (floatReg.test(skidka3) == false) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['skidka3']
    });
  } else {
    let priceSettingsStr = JSON.stringify(priceSettingsArr);

    fs.writeFile('./settings/pricesettings.json', priceSettingsStr, function(
      err
    ) {
      if (err) {
        console.log('ERROR Saving!');
      } else {
        console.log('Saved priceSettingsStr!');
        res.json({
          ok: true
        });
      }
    });
  }
});

// POST Admin Shop pricesettings
router.post('/itemsviewsettings', (req, res) => {
  const shopMainPageItemsPerPage = req.body.shopMainPageItemsPerPage;
  const shopCategorieItemsPerPage = req.body.shopCategorieItemsPerPage;

  let itemsViewSettingsArr = {
    shopMainPageItemsPerPage,
    shopCategorieItemsPerPage
  };

  if (!shopMainPageItemsPerPage || !shopCategorieItemsPerPage) {
    let fieldsForRes = [];
    if (!shopMainPageItemsPerPage)
      fieldsForRes.push('shop-settings-shopmainpage-itemsperpage');
    if (!shopCategorieItemsPerPage)
      fieldsForRes.push('shop-settings-shopcategorie-itemsperpage');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (shopMainPageItemsPerPage < 5) {
    res.json({
      ok: false,
      error: 'Введите число больше 5!',
      fields: ['shop-settings-shopmainpage-itemsperpage']
    });
  } else if (shopCategorieItemsPerPage < 5) {
    res.json({
      ok: false,
      error: 'Введите число с плавающей точкой!',
      fields: ['shop-settings-shopcategorie-itemsperpage']
    });
  } else {
    let itemsViewSettingsStr = JSON.stringify(itemsViewSettingsArr);

    fs.writeFile(
      './settings/itemsviewsettings.json',
      itemsViewSettingsStr,
      function(err) {
        if (err) {
          console.log('ERROR Saving!');
        } else {
          console.log('Saved itemsViewSettingsStr!');
          res.json({
            ok: true
          });
        }
      }
    );
  }
});

router.get('/testimonials', function(req, res) {
  let _id;
  let login;
  let group;
  let page;
  let itemsPerPage = 15;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.group;
    user.findOne({ login }).then(userFromDB => {
      if (
        userFromDB.group == 'Administrator' ||
        userFromDB.group == 'Manager'
      ) {
        //Тут іде основний блок для рендерінга
        testimonial.find().then(testimonialsArr => {
          testimonialsArr.reverse();

          for (let i = 0; i < testimonialsArr.length; i++) {
            testimonialsArr[i].formatedTime = moment(
              testimonialsArr[i].createdAt
            ).format('DD.MM.YYYY, HH:mm');
          }

          res.render('administrator/adm_shop_testimonials', {
            transData: {
              pageTitle: 'Отзывы пользователей',
              user: { _id, login, group },
              testimonialsArr,
              page,
              itemsPerPage
            }
          });
        });
      } else {
        //Незнайдений у базі, або не адмін
        res.render('error', {
          transData: {
            user: { _id, login, group }
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
    group = 0;
    res.render('loginForm', {
      transData: {
        user: { _id, login, group }
      }
    });
  }
});

// POST Admin Shop pricesettings
router.post('/import1s', (req, res) => {
  services.shopxmlparsing.runXmlParsing();
  //Цю функцію треба переробити на промісі і показати клієнту результат оновлення.
  res.json({
    ok: true,
    error: '',
    fields: ''
  });
});

// POST Admin Shop Automatic Import settings
router.post('/changeautomaticimport', (req, res) => {
  const isAutomaticImportOn = req.body.isAutomaticImportOn;

  let importSettingsStr = fs.readFileSync('./settings/importsettings.json', {
    encoding: 'UTF-8'
  });

  let importSettings = JSON.parse(importSettingsStr);

  importSettings.autoImport = isAutomaticImportOn;

  importSettingsStr = JSON.stringify(importSettings);
  fs.writeFile('./settings/importsettings.json', importSettingsStr, function(
    err
  ) {
    if (err) {
      console.log('ERROR Saving!');
    } else {
      if (importSettings.autoImport == 'true')
        services.cronautoimport.runCronAutoImport();

      res.json({
        ok: true
      });
    }
  });
});

module.exports = router;

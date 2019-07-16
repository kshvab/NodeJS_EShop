const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/maincontactsform', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const message = req.body.message;
  console.log(req.body);
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (!email || !phonenumber || !name || !message) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('contacts-mainform-name');
    if (!email) fieldsForRes.push('contacts-mainform-email');
    if (!phonenumber) fieldsForRes.push('contacts-mainform-phonenumber');
    if (!message) fieldsForRes.push('contacts-mainform-message');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (!(phonenumber[0] == '0')) {
    res.json({
      ok: false,
      error: 'Номер телефона должен начинаться с 0!',
      fields: ['contacts-mainform-phonenumber']
    });
  } else if (emailReg.test(email) == false) {
    res.json({
      ok: false,
      error: 'Введите корректный E-mail!',
      fields: ['contacts-mainform-email']
    });
  } else if (!(phonenumber.length == 10)) {
    res.json({
      ok: false,
      error: 'Проверьте Ваш номер телефона!',
      fields: ['contacts-mainform-phonenumber']
    });
  } else {
    console.log('УСПЕХ!');
    let htmlMsg =
      'Посетитель написал сообщение используя форму обратной связи<br>на странице Контакты.<br><br>';
    htmlMsg += 'Имя: ' + name + '<br>';
    htmlMsg += 'E-mail: ' + email + '<br>';
    htmlMsg += 'Телефон: ' + phonenumber + '<br>';
    htmlMsg += 'Сообщение: ' + message;
    //console.log(htmlMsg);
    services.mailformtoadmins.sendFormMail(htmlMsg);

    res.json({
      ok: true
    });
  }
});

router.post('/callmebackform', (req, res) => {
  const name = req.body.name;
  const phonenumber = req.body.phonenumber;
  console.log(req.body);

  if (!phonenumber || !name) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('callmebackform-name');
    if (!phonenumber) fieldsForRes.push('callmebackform-phonenumber');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (!(phonenumber[0] == '0')) {
    res.json({
      ok: false,
      error: 'Номер телефона должен начинаться с 0!',
      fields: ['callmebackform-phonenumber']
    });
  } else if (!(phonenumber.length == 10)) {
    res.json({
      ok: false,
      error: 'Проверьте Ваш номер телефона!',
      fields: ['callmebackform-phonenumber']
    });
  } else {
    console.log('УСПЕХ!');
    let htmlMsg =
      'Посетитель сайта просит перезвонить ему! <br> Он заполнил форму на главной странице сайта.<br><br>';
    htmlMsg += 'Имя: ' + name + '<br>';
    htmlMsg += 'Телефон: ' + phonenumber + '<br>';
    //console.log(htmlMsg);
    services.mailformtoadmins.sendFormMail(htmlMsg);

    res.json({
      ok: true
    });
  }
});

router.post('/defaultsubscriptionform', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  console.log(req.body);
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (!name || !email) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('defaultSubscriptionFormName');
    if (!email) fieldsForRes.push('defaultSubscriptionFormEmai');
    res.json({
      ok: false,
      error: 'Все поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (emailReg.test(email) == false) {
    res.json({
      ok: false,
      error: 'Введите корректный E-mail!',
      fields: ['defaultSubscriptionFormEmai']
    });
  } else {
    //console.log('УСПЕХ!');
    let htmlMsg =
      'Посетитель сайта подписалсяна рассылку! <br> Он заполнил форму подписки в сайдбаре сайта.<br><br>';
    htmlMsg += 'Имя: ' + name + '<br>';
    htmlMsg += 'E-mail!: ' + email + '<br>';
    //console.log(htmlMsg);
    services.mailformtoadmins.sendFormMail(htmlMsg);

    res.json({
      ok: true
    });
  }
});

router.post('/partnersform', (req, res) => {
  const name = req.body.name;
  const companyname = req.body.companyname;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const address = req.body.address;
  const message = req.body.message;
  console.log(req.body);
  let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;
  if (!email || !phonenumber || !name || !message) {
    let fieldsForRes = [];
    if (!name) fieldsForRes.push('contacts-mainform-name');
    if (!email) fieldsForRes.push('contacts-mainform-email');
    if (!phonenumber) fieldsForRes.push('contacts-mainform-phonenumber');
    if (!message) fieldsForRes.push('contacts-mainform-message');
    res.json({
      ok: false,
      error: 'Поля должны быть заполнены!',
      fields: fieldsForRes
    });
  } else if (!(phonenumber[0] == '0')) {
    res.json({
      ok: false,
      error: 'Номер телефона должен начинаться с 0!',
      fields: ['contacts-mainform-phonenumber']
    });
  } else if (emailReg.test(email) == false) {
    res.json({
      ok: false,
      error: 'Введите корректный E-mail!',
      fields: ['contacts-mainform-email']
    });
  } else if (!(phonenumber.length == 10)) {
    res.json({
      ok: false,
      error: 'Проверьте Ваш номер телефона!',
      fields: ['contacts-mainform-phonenumber']
    });
  } else {
    console.log('УСПЕХ!');
    let htmlMsg =
      'Регистрация нового партнера!<br>Посетитель заполнил форму регистрации<br>на странице Партнерам.<br><br>';
    htmlMsg += 'Имя: ' + name + '<br>';
    htmlMsg += 'Компания: ' + companyname + '<br>';
    htmlMsg += 'E-mail: ' + email + '<br>';
    htmlMsg += 'Телефон: ' + phonenumber + '<br>';
    htmlMsg += 'Адрес: ' + address + '<br>';
    htmlMsg += 'Сообщение: ' + message;
    //console.log(htmlMsg);
    services.mailformtoadmins.sendFormMail(htmlMsg);

    res.json({
      ok: true
    });
  }
});
module.exports = router;

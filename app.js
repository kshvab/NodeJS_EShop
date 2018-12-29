const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const request = require('request');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //Щоб експрес віддавав статичні файли з папки public, скрипти будуть доступні просто через слеш
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/vhod', function(req, res) {
  res.render('loginForm');
});

const arr = ['Коля', 'Галя', 'Валя'];
app.get('/typo', function(req, res) {
  res.render('typo', { arr: arr });
});

module.exports = app;

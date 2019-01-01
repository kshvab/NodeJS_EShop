const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');
const request = require('request');

const mongoose = require('mongoose');
const config = require('./config');

// database
mongoose.connection
  .on('error', error => console.log(error))
  .on('close', () => console.log('Database connection closed.'))
  .once('open', () => {
    let info = mongoose.connections;
    if (info)
      console.log(
        `Connected to MongoDB\nhost: ${info[0].host}\nport: ${
          info[0].port
        }\nuser: ${info[0].user}\n`
      );
  });

mongoose.connect(
  config.MONGO_URL,
  { useNewUrlParser: true }
);

// express
const app = express();
app.listen(config.PORT, () =>
  console.log(
    `\n-----------------------------------------------------\nExample app listening on port ${
      config.PORT
    }!\n`
  )
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //Щоб експрес віддавав статичні файли з папки public, скрипти будуть доступні просто через слеш
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

// routers
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

//======================================================================
//створюю JSON з категорії 76
{
  /*
  //Отримумо текст
  var data = fs.readFileSync('./import/import.xml', { encoding: 'UTF-8' });
  //console.dir(data);

  var parseString = xml2js.parseString;
  parseString(data, function(err, result) {
    //console.dir(result);
    let categoriesArr = result.yml_catalog.shop[0].categories[0].category;
    let offersArr = result.yml_catalog.shop[0].offers[0].offer;
    //console.dir(categoriesArr[0]);
    //console.dir(offersArr[0]);
    console.log(offersArr.length);
    let myBd76 = [];
    console.dir(offersArr[0].categoryId[0]);
    for (let i = 0; i < offersArr.length; i++) {
      if (offersArr[i].categoryId[0] == '76') {
        myBd76.push({
          categoryId: offersArr[i].categoryId[0],
          url: offersArr[i].picture[0],
          price: offersArr[i].price[0],
          picture: offersArr[i].picture[0],
          //vendor: offersArr[i].vendor[0],
          model: offersArr[i].model[0],
          name: offersArr[i].name[0],
          id: offersArr[i]['$'].id
        });

        //console.log(offersArr[i].name[0]);
      }
    }
    let textObj = JSON.stringify(myBd76);
    fs.writeFile('./import/myBd76.txt', textObj, function(err) {
      if (err) throw err;
      console.log('Saved!');
    });
  });
  */
}

app.get('/shop', function(req, res) {
  let string = fs.readFileSync('./import/myBd76.txt', { encoding: 'UTF-8' });

  //console.log(string);
  let arr = JSON.parse(string);
  ///console.dir(arr);
  res.render('shop', { arr: arr });
});

let string = fs.readFileSync('./import/myBd76.txt', { encoding: 'UTF-8' });

//console.log(string);
let arr2 = JSON.parse(string);
//console.dir(arr2);

for (let i = 0; i < arr2.length; i++) {
  let adr = '/shop/' + arr2[i].id;
  app.get(adr, function(req, res) {
    res.render('item', { item: arr2[i] });
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {}
  });
});

module.exports = app;

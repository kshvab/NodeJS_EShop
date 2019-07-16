const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
let fs = require('fs');
const mongoose = require('mongoose');
const config = require('./config');
const routes = require('./routes');

const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

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

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

// express
const app = express();
app.listen(config.PORT, () =>
  console.log(
    `\n-----------------------------------------------------\nExample app listening on port ${
      config.PORT
    }!\n`
  )
);

// sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

// sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); //Щоб експрес віддавав статичні файли з папки public, скрипти будуть доступні просто через слеш
app.use(express.static(path.join(__dirname, 'ftpshared')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

app.use('/', routes.mainpage);
app.use('/administrator', routes.administrator);
app.use('/administrator/users', routes.adminusers);
app.use('/administrator/publications', routes.adminpublications);
app.use('/administrator/shop', routes.adminshop);

app.use('/api/auth', routes.auth);
app.use('/profile', routes.profile);
app.use('/publications', routes.publications);
app.use('/upload', routes.upload);
app.use('/search', routes.search);
app.use('/shop', routes.shop);
app.use('/shopcart', routes.shopcart);
app.use('/messages', routes.messages);
app.use('/sitemap', routes.sitemap);
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

//  --- SERVICES ---
//const services = require('./services');
//services.cronautoimport.runCronAutoImport();
//services.shopxmlparsing.runXmlParsing();
//services.novaposhta.updateDeliveryServiceCitiesList();
//services.catscreating.runCategoriesParsing();
//services.itemscreating.runItemsParsing();
//services.photoparsing.runPhotoParsing();
//services.mailorderconfirmtouser.sendOrderMail(87, 'kshvab@gmail.com');

//Сброс настроек автоимпорта
let importSettings = {
  autoImport: 'false',
  updateTime: ''
};
fs.writeFileSync(
  './settings/importsettings.json',
  JSON.stringify(importSettings)
);

module.exports = app;

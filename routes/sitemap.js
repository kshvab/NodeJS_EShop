const express = require('express');
const router = express.Router();
const fs = require('fs');
const models = require('../models');
const publication = models.publication;

const sm = require('sitemap');

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

let p_publicationsArr = new Promise(function(resolve, reject) {
  publication.find({ status: 'Опубликовано' }).then(publicationsObj => {
    if (publicationsObj) resolve(publicationsObj);
    else reject('Can not get Publications from db');
  });
});

let sitemap = sm.createSitemap({
  hostname: 'http://svarka.club',
  cacheTime: 600000, // 600 sec cache period
  urls: [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/shop', changefreq: 'weekly', priority: 0.7 },
    { url: '/publications', changefreq: 'daily', priority: 0.9 },
    { url: '/contacts', changefreq: 'monthly', priority: 0.5 },
    { url: '/partners', changefreq: 'monthly', priority: 0.5 }
  ]
});

router.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');

  Promise.all([p_shopItemsArr, p_shopCategoriesArr, p_publicationsArr]).then(
    function(values) {
      let shopItemsArr = values[0];
      let shopCategoriesArr = values[1];
      let publicationsArr = values[2];
      //console.log(publicationsArr);

      //Shop Items Urls
      shopItemsArr.forEach(function(item) {
        sitemap.add({
          url: '/shop/' + item.vendorCode,
          changefreq: 'weekly',
          priority: 0.6
        });
      });

      //Shop Categories Urls
      shopCategoriesArr.forEach(function(item) {
        sitemap.add({
          url: '/shop/' + item.catAlias,
          changefreq: 'weekly',
          priority: 0.6
        });
      });

      //Shop Publications Urls
      publicationsArr.forEach(function(item) {
        sitemap.add({
          url: '/publications/' + item.alias,
          changefreq: 'weekly',
          priority: 0.5
        });
      });

      res.send(sitemap.toString());
    }
  );
});

module.exports = router;

var request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');
const config = require('../config');

const picSaveDest = config.SHOP_PICTURE_SAVE_DESTINATION.slice(6);

function fPriceNorm(price) {
  let priceln = price.length;
  let pos = price.indexOf('$');
  return parseFloat(price.slice(-(priceln - pos - 1)));
}

function runItemsParsing() {
  var catArrJson = fs.readFileSync(
    './public/datafiles/shopCategoriesArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );

  let catArr = JSON.parse(catArrJson);

  var itemsArr = [];
  var catArrLen = catArr.length;
  // var catArrLen = 8;
  var counter = 0;
  nextCat(counter);

  function nextCat(n) {
    catItemsParsing(catArr[n].catUrl, catArr[n].catId).then(
      iCatItemsArr => {
        console.log('Parsing Cat #:' + n);
        if (iCatItemsArr) {
          for (var i = 0; i < iCatItemsArr.length; i++) {
            itemsArr.push(iCatItemsArr[i]);
          }
        }
        counter++;
        if (counter < catArrLen) nextCat(counter);
        if (counter == catArrLen) {
          console.log('Parsing is complet');
          saveItemsArr(itemsArr);
        }
      },
      error => console.log(error)
    );
  }
}

function saveItemsArr(itemsArr) {
  //console.dir(itemsArr);

  let shopItemsArrStr = JSON.stringify(itemsArr);

  fs.writeFile(
    './public/datafiles/shopItemsArrFile.txt',
    shopItemsArrStr,
    function(err) {
      if (err) console.log('ERROR Saving!');
      console.log('Saved Items!');
    }
  );
}

function catItemsParsing(catUrl, catId) {
  return new Promise(function(resolve, reject) {
    catUrl += '/?limit=500';

    request(catUrl, function(error, response, body) {
      if (error) {
        console.log(error);
        reject(error);
      }

      var $ = cheerio.load(body, { decodeEntities: false });

      let catItemsLen = $('.product-list .name-product a').length;

      if (!catItemsLen) resolve(0);
      let catItemsArr = [];

      for (let i = 0; i < catItemsLen; i++) {
        let item = {};
        let murovdagUrl = $('.product-list .name-product a')
          .eq(i)
          .attr('href');
        let name = $('.product-list .name-product a')
          .eq(i)
          .text();

        let vendorCode = $('.product-list .models')
          .eq(i)
          .text();
        vendorCode = vendorCode.slice(10);
        let notSingleItem = false;
        let manufacturer = '';
        let notAvailableForSale = false;
        let inputPriceUsd = $('.product-list .price-product')
          .eq(i)
          .text();
        //

        inputPriceUsd = fPriceNorm(inputPriceUsd);

        let stock = 10;
        let baseUnit = 'шт';
        let picture = $('.product-list img')
          .eq(i)
          .attr('src');
        let id = vendorCode;

        let groups = catId;
        let price = 0;
        let basePrice = 0;

        let dir = '/picfolder_' + vendorCode.slice(vendorCode.length - 2);

        let picture_220x220 =
          picSaveDest + dir + '/img_' + vendorCode + '_220x220.png';
        let picture_800x800 =
          picSaveDest + dir + '/img_' + vendorCode + '_800x800.png';

        item = {
          murovdagUrl,
          name,
          vendorCode,
          notSingleItem,
          manufacturer,
          notAvailableForSale,
          inputPriceUsd,
          price,
          basePrice,
          stock,
          baseUnit,
          picture,
          picture_220x220,
          picture_800x800,
          id,
          groups
        };

        catItemsArr.push(item);
      }

      resolve(catItemsArr);
    });
  });
}

module.exports = {
  runItemsParsing
};

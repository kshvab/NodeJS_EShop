var request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');

function runPhotoParsing() {
  console.log('Photoparsing');

  let shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );

  let shopItemsArr = JSON.parse(shopItemsArrStr);

  let catUrl = shopItemsArr[0].murovdagUrl;
  console.log(catUrl);
  request(catUrl, function(error, response, body) {
    if (error) {
      console.log(error);
    }

    var $ = cheerio.load(body, { decodeEntities: false });

    let lookingFor = $('#gallery_zoom').attr('src');

    console.log(lookingFor);
    /*
    let catItemsLen; 

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
        id,
        groups
      };
      catItemsArr.push(item);
    }

    resolve(catItemsArr);


    */
  });
}

module.exports = {
  runPhotoParsing
};

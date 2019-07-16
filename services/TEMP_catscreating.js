var request = require('request');
var fs = require('fs');
const cheerio = require('cheerio');
var slugify = require('slugify');

function runCategoriesParsing() {
  var apiUrl = 'http://murovdag.com.ua/sitemap/';

  request(apiUrl, function(error, response, body) {
    if (error) {
      console.log(error);
      return;
    }

    var $ = cheerio.load(body, { decodeEntities: false });

    var sitemapHtml = $('#tm_menu div').html();
    console.log('SitemapHtml recieved...');
    fCreateCatArr(sitemapHtml);
  });

  function fCreateCatArr(sitemapHtml) {
    var $ = cheerio.load(sitemapHtml, { decodeEntities: false });

    // Quantity of 1lvl Cats
    let firstLvlQuantity = $('.menu').children().length;

    let firstLvlCatsArr = [];
    let secondLvlCatsArr = [];
    let thirdLvlCatsArr = [];

    for (let i = 0; i < firstLvlQuantity; i++) {
      let catUrl = $('.menu > li > a')
        .eq(i)
        .attr('href');
      let catName = $('.menu > li > a')
        .eq(i)
        .text();
      let catId = 'firstlvl' + i;
      let catSort = i;
      let catPicture = 0;
      let catFatherName = 'absent';
      let catFatherId = 'absent';
      let catHasChildren = false;
      let catAlias = slugify(catName);
      firstLvlCatsArr.push({
        catName,
        catUrl,
        catId,
        catSort,
        catPicture,
        catFatherName,
        catFatherId,
        catHasChildren,
        catAlias
      });
    }

    for (let i = 0; i < firstLvlCatsArr.length; i++) {
      //inside html of each 1st lvl cats:
      let tempInsHtml = $('.menu > li')
        .eq(i)
        .html();
      //console.log(i + '***********\n' + tempInsHtml);

      let $2 = cheerio.load(tempInsHtml, { decodeEntities: false });
      let childrenLength = $2('ul')
        .first()
        .children().length;
      //console.log(i + '**-->' + childrenLength);

      if (childrenLength > 0) {
        firstLvlCatsArr[i].catHasChildren = true;

        for (var k = 0; k < childrenLength; k++) {
          let catUrl = $2('ul > li a')
            .not('ul li ul a')
            .eq(k)
            .attr('href');

          let catName = $2('ul > li a')
            .not('ul li ul a')
            .eq(k)
            .text();

          let catId = firstLvlCatsArr[i].catId + '-' + k;

          let catSort = k;
          let catPicture = 0;

          //let catFatherName = firstLvlCatsArr[i].catName;
          //let catFatherId = firstLvlCatsArr[i].catId;

          let catFatherName = 0;
          let catFatherId = 0;

          let catHasChildren;
          if (
            $2('ul > li a')
              .not('ul li ul a')
              .eq(k)
              .parent()
              .children('ul').length
          ) {
            catHasChildren = true;
          } else catHasChildren = 0;
          let catAlias = slugify(catName);

          secondLvlCatsArr.push({
            catName,
            catUrl,
            catId,
            catSort,
            catPicture,
            catFatherName,
            catFatherId,
            catHasChildren,
            catAlias
          });

          let trdLvlChldrLen = $2('ul > li a')
            .not('ul li ul a')
            .eq(k)
            .parent()
            //.html();
            .children('ul').length;
          if (trdLvlChldrLen) {
            //console.log(catName + ' has ch= ' + trdLvlChldrLen);
            let tempInsHtml3 = $2('ul > li a')
              .not('ul li ul a')
              .eq(k)
              .parent()
              .html();

            let $3 = cheerio.load(tempInsHtml3, { decodeEntities: false });
            let childrenLength3 = $3('ul')
              .first()
              .children().length;
            //console.log('**-->' + childrenLength3);

            for (let l = 0; l < childrenLength3; l++) {
              let catUrl_3 = $3('ul > li a')
                .eq(l)
                .attr('href');

              let catName_3 = $3('ul > li a')
                .eq(l)
                .text();

              let catId_3 = catId + '-' + l;
              let catSort_3 = k;
              let catPicture_3 = 0;
              let catFatherName_3 = catName;
              let catFatherId_3 = catId;
              let catHasChildren_3 = false;
              let catAlias_3 = slugify(catName_3);

              thirdLvlCatsArr.push({
                catName: catName_3,
                catUrl: catUrl_3,
                catId: catId_3,
                catSort: catSort_3,
                catPicture: catPicture_3,
                catFatherName: catFatherName_3,
                catFatherId: catFatherId_3,
                catHasChildren: catHasChildren_3,
                catAlias: catAlias_3
              });
            }
          }
        }
      }
    }

    /*
    console.log(firstLvlCatsArr);
    console.log('\n\n\n\n\n\n');
    console.log(secondLvlCatsArr);
    console.log('\n\n\n\n\n\n');
    console.log(thirdLvlCatsArr);
    */

    let catArr = [];

    for (let i = 0; i < firstLvlCatsArr.length; i++) {
      catArr.push(firstLvlCatsArr[i]);
    }
    for (let i = 0; i < secondLvlCatsArr.length; i++) {
      catArr.push(secondLvlCatsArr[i]);
    }
    for (let i = 0; i < thirdLvlCatsArr.length; i++) {
      catArr.push(thirdLvlCatsArr[i]);
    }

    //console.log(catArr.length);

    let shopCategoriesArrStr = JSON.stringify(catArr);

    fs.writeFile(
      './public/datafiles/shopCategoriesArrFile.txt',
      shopCategoriesArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        console.log('Saved Categories!');
      }
    );
  }
}

module.exports = {
  runCategoriesParsing
};

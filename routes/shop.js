const express = require('express');
const router = express.Router();
var fs = require('fs');
const xml2js = require('xml2js');
var parseString = xml2js.parseString;
const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;

//runShop();

router.get(
  '(?:/:pathPart0)(?:/:pathPart1)?(?:/:pathPart2)?(?:/:pathPart3)?(?:/:pathPart4)?(?:/:pathPart5)?(?:/:pathPart6)?',
  function(req, res) {
    let _id;
    let login;
    let shopCart = req.session.shopCart;

    /*
    req.session.destroy(() => {
      res.redirect('/');
    });
    */

    console.dir(req.session);
    if (req.session.userId && req.session.userLogin) {
      _id = req.session.userId;
      login = req.session.userLogin;
    } else {
      _id = 0;
      login = 0;
    }
    //READ FILES
    var shopItemsArrStr = fs.readFileSync(
      './public/import_foto/shopItemsArrFile.txt',
      {
        encoding: 'UTF-8'
      }
    );
    var shopItemsArr = JSON.parse(shopItemsArrStr);

    var shopCategoriesArrStr = fs.readFileSync(
      './public/import_foto/shopCategoriesArrFile.txt',
      {
        encoding: 'UTF-8'
      }
    );
    var shopCategoriesArr = JSON.parse(shopCategoriesArrStr);

    //URL PARSING
    let urlArr = Object.values(req.params); //to array
    urlArr = urlArr.filter(function(x) {
      //delete undefined elements
      return x !== undefined && x !== null;
    });

    let viewsView;
    //The last element in URL is cat or item?
    var isItInCatArr = shopCategoriesArr.filter(function(cat) {
      return cat.catAlias == urlArr[urlArr.length - 1];
    });

    var isItInItemArr = shopItemsArr.filter(function(item) {
      return item.vendorCode == urlArr[urlArr.length - 1];
    });

    if (isItInCatArr[0]) {
      viewsView = 'shop/shop_categorie';
      showCategorie(isItInCatArr[0]);
    } else if (isItInItemArr[0]) {
      viewsView = 'shop/shop_item';
      showItem(isItInItemArr[0]);
    } else {
      res.render('error', {
        transData: {
          user: { _id, login }
        },
        message: 'Такой страницы не существует!',
        error: { code: 404 }
      });
    }

    //  if it is Cat :
    function showCategorie(shownCat) {
      let shownCatItems = shopItemsArr.filter(function(item) {
        return item.groups == shownCat.catId;
      });

      var breadcrumbArr = [];

      fullBreadcrumbArr();
      // let us make a Breadcrumb arr
      function fullBreadcrumbArr() {
        let active = true;
        recursBreadcrumbArrPush(shownCat.catId);

        function recursBreadcrumbArrPush(currentCatId) {
          let currentCat = shopCategoriesArr.filter(function(cat) {
            return cat.catId == currentCatId;
          });
          let breadcrumbPart = {
            name: currentCat[0].catName,
            url: '/' + currentCat[0].catAlias,
            active
          };
          active = false;
          breadcrumbArr.push(breadcrumbPart);
          if (currentCat[0].catFatherId)
            recursBreadcrumbArrPush(currentCat[0].catFatherId);
        }

        var breadcrumbShop = {
          name: 'Каталог',
          url: 'shop',
          active: false
        };
        breadcrumbArr.push(breadcrumbShop);
        var breadcrumbMainPage = {
          name: 'Главная',
          url: '/',
          active: false
        };
        breadcrumbArr.push(breadcrumbMainPage);
        breadcrumbArr.reverse();

        //urls in arr are not full yet, so:
        let fullUrl = '';
        for (let i = 0; i < breadcrumbArr.length; i++) {
          breadcrumbArr[i].url = fullUrl + breadcrumbArr[i].url;
          fullUrl = breadcrumbArr[i].url;
        }
      }

      res.render(viewsView, {
        transData: {
          shopItemsArr,
          shopCategoriesArr,
          user: { _id, login },
          shownCat,
          shownCatItems,
          breadcrumbArr,
          shopCart
        }
      });
      //console.log(shownCat);
    }

    //  if it is Item :
    function showItem(shownItem) {
      var breadcrumbArr = [];

      fullBreadcrumbArr();
      // let us make a Breadcrumb arr
      function fullBreadcrumbArr() {
        var breadcrumbEnd = {
          name: shownItem.name,
          url: '/' + shownItem.vendorCode,
          active: true
        };
        breadcrumbArr.push(breadcrumbEnd);

        recursBreadcrumbArrPush(shownItem.groups);

        function recursBreadcrumbArrPush(currentCatId) {
          let currentCat = shopCategoriesArr.filter(function(cat) {
            return cat.catId == currentCatId;
          });
          let breadcrumbPart = {
            name: currentCat[0].catName,
            url: '/' + currentCat[0].catAlias,
            active: false
          };
          breadcrumbArr.push(breadcrumbPart);
          if (currentCat[0].catFatherId)
            recursBreadcrumbArrPush(currentCat[0].catFatherId);
        }

        var breadcrumbShop = {
          name: 'Каталог',
          url: 'shop',
          active: false
        };
        breadcrumbArr.push(breadcrumbShop);
        var breadcrumbMainPage = {
          name: 'Главная',
          url: '/',
          active: false
        };
        breadcrumbArr.push(breadcrumbMainPage);
        breadcrumbArr.reverse();

        //urls in arr are not full yet, so:
        let fullUrl = '';
        for (let i = 0; i < breadcrumbArr.length; i++) {
          breadcrumbArr[i].url = fullUrl + breadcrumbArr[i].url;
          fullUrl = breadcrumbArr[i].url;
        }
      }
      //console.log(breadcrumbArr);

      res.render(viewsView, {
        transData: {
          shopItemsArr,
          shopCategoriesArr,
          user: { _id, login },
          shownItem,
          breadcrumbArr,
          shopCart
        }
      });
      //console.log(shownItem);
    }
  }
);

router.get('/', function(req, res) {
  let _id;
  let login;
  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
  } else {
    _id = 0;
    login = 0;
  }

  var shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  var shopCategoriesArrStr = fs.readFileSync(
    './public/import_foto/shopCategoriesArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopCategoriesArr = JSON.parse(shopCategoriesArrStr);

  res.render('shop/shop_mainpage', {
    transData: {
      shopItemsArr,
      shopCategoriesArr,
      user: { _id, login }
    }
  });
});

function runShop() {
  //======================== Парсим XML із 1С ==========================//

  //Отримумо текст
  var data = fs.readFileSync('./public/import_foto/import.xml', {
    encoding: 'UTF-8'
  });
  //console.dir(data);

  parseString(data, function(err, result) {
    let upgradeDate = result['КоммерческаяИнформация']['$']['ДатаФормирования'];
    console.log('Дата обновления: ' + upgradeDate);

    let catDirtyArr =
      result['КоммерческаяИнформация']['Классификатор'][0]['Группы'][0][
        'Группа'
      ][0]['Группы'][0]['Группа'][0]['Группы'][0]['Группа'][0]['Группы'][0][
        'Группа'
      ];
    //console.dir(catDirtyArr);

    let isChangesOnly =
      result['КоммерческаяИнформация']['Каталог'][0]['СодержитТолькоИзменения'];
    console.log('isChangesOnly: ' + isChangesOnly);

    let offersArr =
      result['КоммерческаяИнформация']['Каталог'][0]['Товары'][0]['Товар'];

    //console.dir(offersArr[0]);

    let shopItemsArr = [];

    for (let i = 0; i < offersArr.length; i++) {
      let shopItem = {};
      shopItem.id = offersArr[i]['Ид'][0];
      shopItem.vendorCode = offersArr[i]['Артикул'][0];
      shopItem.name = offersArr[i]['Наименование'][0];
      shopItem.notSingleItem = offersArr[i]['НеШтучныйТовар'][0];
      shopItem.manufacturer = offersArr[i]['Производитель'][0];
      shopItem.notAvailableForSale = offersArr[i]['НеДоступенДляПродажи'][0];
      shopItem.price = offersArr[i]['Цена'][0];
      shopItem.stock = offersArr[i]['Остаток'][0];
      shopItem.baseUnit = offersArr[i]['БазоваяЕдиница'][0]['_'];
      shopItem.groups = offersArr[i]['Группы'][0]['Ид'][0];
      shopItem.picture = offersArr[i]['Картинка'][0];
      shopItemsArr.push(shopItem);
    }

    let shopItemsArrStr = JSON.stringify(shopItemsArr);

    fs.writeFile(
      './public/import_foto/shopItemsArrFile.txt',
      shopItemsArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        console.log('Saved Items!');
      }
    );

    createCatOrder(catDirtyArr);
  });

  function createCatOrder(catDirtyArr) {
    console.dir(catDirtyArr.length);
    /*
    console.dir(catDirtyArr[0]['Группы'][0]['Группа'].length);
    console.dir(catDirtyArr[2]['Группы'][0]['Группа'][3]);
    console.dir(
      catDirtyArr[2]['Группы'][0]['Группа'][3]['Группы'][0]['Группа'].length
    );
    console.dir(
      catDirtyArr[2]['Группы'][0]['Группа'][2]['Группы'][0]['Группа'][2]
    );
*/
    let mass = [];

    function recursPush(a, catFatherName = 0, catFatherId = 0) {
      for (let i = 0; i < a.length; i++) {
        let catHasChildren = a[i].hasOwnProperty('Группы');
        mass.push({
          catId: a[i]['Ид'][0],
          catName: a[i]['Наименование'][0],
          catSort: a[i]['Сортировка'][0],
          catFatherName,
          catFatherId,
          catHasChildren,
          catAlias: slugify(a[i]['Наименование'][0])
        });

        if (a[i].hasOwnProperty('Группы')) {
          let deep = a[i]['Группы'][0]['Группа'];
          //let father = a[i]["Ид"][0];
          let catFatherName = a[i]['Наименование'][0];
          let catFatherId = a[i]['Ид'][0];
          recursPush(deep, catFatherName, catFatherId);
        }
      }
    }

    recursPush(catDirtyArr);

    console.dir(mass);
    let shopCategoriesArrStr = JSON.stringify(mass);

    fs.writeFile(
      './public/import_foto/shopCategoriesArrFile.txt',
      shopCategoriesArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        console.log('Saved Categories!');
      }
    );
  }
}

module.exports = router;

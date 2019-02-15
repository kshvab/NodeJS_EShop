const express = require('express');
const router = express.Router();
var fs = require('fs');

router.get(
  '(?:/:pathPart0)(?:/:pathPart1)?(?:/:pathPart2)?(?:/:pathPart3)?(?:/:pathPart4)?(?:/:pathPart5)?(?:/:pathPart6)?',
  function(req, res) {
    let _id;
    let login;
    let group;
    let shopCart = req.session.shopCart;

    //console.dir(req.session);
    if (req.session.userId && req.session.userLogin) {
      _id = req.session.userId;
      login = req.session.userLogin;
      group = req.session.userGroup;
    } else {
      _id = 0;
      login = 0;
      group = 0;
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
          user: { _id, login, group }
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
          user: { _id, login, group },
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
          user: { _id, login, group },
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
  let group;
  let shopCart = req.session.shopCart;
  let page;
  let itemsPerPage = 18;
  if (req.query.hasOwnProperty('page') && req.query.page) page = req.query.page;
  else page = 1;

  if (req.session.userId && req.session.userLogin) {
    _id = req.session.userId;
    login = req.session.userLogin;
    group = req.session.userGroup;
  } else {
    _id = 0;
    login = 0;
    group = 0;
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
  //console.dir(shopCategoriesArr);
  res.render('shop/shop_mainpage', {
    transData: {
      shopItemsArr,
      shopCategoriesArr,
      user: { _id, login, group },
      shopCart,
      page,
      itemsPerPage
    }
  });
});

module.exports = router;

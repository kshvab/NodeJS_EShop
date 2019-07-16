var fs = require('fs');
const xml2js = require('xml2js');
var parseString = xml2js.parseString;
const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;

function runXmlParsing() {
  //======================== Парсим XML із 1С ==========================//

  //Отримумо текст import.xml
  var data = fs.readFileSync('./ftpshared/import.xml', {
    encoding: 'UTF-8'
  });

  parseString(data, function(err, result) {
    let upgradeDate = result['КоммерческаяИнформация']['$']['ДатаФормирования'];
    console.log('K.8 SERVICES ==> Парсинг Категорий и товаров (import.xml)...');
    console.log('K.8 SERVICES ==> Дата обновления: ' + upgradeDate);

    let catDirtyArr =
      result['КоммерческаяИнформация']['Классификатор'][0]['Группы'][0][
        'Группа'
      ][0]['Группы'][0]['Группа'][0]['Группы'][0]['Группа'];
    //console.dir(catDirtyArr);
    //[0]['Группы'][0]['Группа']

    let isChangesOnly =
      result['КоммерческаяИнформация']['Каталог'][0]['СодержитТолькоИзменения'];
    console.log('XML file isChangesOnly: ' + isChangesOnly);

    let offersArr =
      result['КоммерческаяИнформация']['Каталог'][0]['Товары'][0]['Товар'];

    //console.dir(offersArr[0]);
    /*
    let usersDirtyArr =
      result['КоммерческаяИнформация']['clients'][0]['client'];

    let usersArr = [];
    for (let i = 0; i < usersDirtyArr.length; i++) {
      let user = {};
      user.code = usersDirtyArr[i]['code'][0];
      user.name = usersDirtyArr[i]['name'][0];
      user.discount = usersDirtyArr[i]['discount'][0];
      user.tel = usersDirtyArr[i]['tel'][0];
      user.email = usersDirtyArr[i]['email'][0];
      user.login = usersDirtyArr[i]['login'][0];
      if (user.email.length) usersArr.push(user);
    }
    //console.log(usersArr);
    let usersArrStr = JSON.stringify(usersArr);
    fs.writeFile(
      './public/datafiles/shopUsersArrFile.txt',
      usersArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        else console.log('K.8 SERVICES ==> Saved Users!');
      }
    );
      */

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
      shopItem.picture = shopItem.picture.replace(
        'import_files',
        '/import_foto'
      );
      shopItem.basePrice = 0;
      shopItemsArr.push(shopItem);
    }

    let shopItemsArrStr = JSON.stringify(shopItemsArr);

    fs.writeFile(
      './public/datafiles/shopItemsArrFile.txt',
      shopItemsArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        else console.log('K.8 SERVICES ==> Saved Items!');
      }
    );

    createCatOrder(catDirtyArr);
  });

  function createCatOrder(catDirtyArr) {
    //console.dir(catDirtyArr.length);

    let mass = [];

    function recursPush(a, catFatherName = 0, catFatherId = 0) {
      function picturePreparaion(curCat) {
        if (
          curCat.hasOwnProperty('Картинка') &&
          curCat['Картинка'][0] != undefined
        )
          return curCat['Картинка'][0];
        else return '';
      }

      for (let i = 0; i < a.length; i++) {
        let catHasChildren = a[i].hasOwnProperty('Группы');
        mass.push({
          catId: a[i]['Ид'][0],
          catName: a[i]['Наименование'][0],
          catSort: a[i]['Сортировка'][0],
          catPicture: picturePreparaion(a[i]),
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

    //console.dir(mass);
    let shopCategoriesArrStr = JSON.stringify(mass);

    fs.writeFile(
      './public/datafiles/shopCategoriesArrFile.txt',
      shopCategoriesArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        console.log('K.8 SERVICES ==> Saved Categories!');
      }
    );
  }

  //Отримумо текст clients.xml
  var clientsData = fs.readFileSync('./ftpshared/clients.xml', {
    encoding: 'UTF-8'
  });
  //USERS Parsing
  parseString(clientsData, function(err, result) {
    let usersDirtyArr =
      result['КоммерческаяИнформация']['clients'][0]['client'];
    console.log('K.8 SERVICES ==> Парсинг Пользователей (clients.xml)...');
    let usersArr = [];
    for (let i = 0; i < usersDirtyArr.length; i++) {
      let user = {};
      user.code = usersDirtyArr[i]['code'][0];
      user.name = usersDirtyArr[i]['name'][0];
      user.discount = usersDirtyArr[i]['discount'][0];
      user.tel = usersDirtyArr[i]['tel'][0];
      user.email = usersDirtyArr[i]['email'][0];
      user.login = usersDirtyArr[i]['login'][0];
      if (user.email.length) usersArr.push(user);
    }
    //console.log(usersArr);
    let usersArrStr = JSON.stringify(usersArr);
    fs.writeFile(
      './public/datafiles/shopUsersArrFile.txt',
      usersArrStr,
      function(err) {
        if (err) console.log('ERROR Saving!');
        else console.log('K.8 SERVICES ==> Saved Users!');
      }
    );
  });

  //write time
  let importSettingsStr = fs.readFileSync('./settings/importsettings.json', {
    encoding: 'UTF-8'
  });
  let importSettings = JSON.parse(importSettingsStr);
  let timeInMs = Date.now();
  importSettings.updateTime = timeInMs;
  fs.writeFileSync(
    './settings/importsettings.json',
    JSON.stringify(importSettings)
  );
}

module.exports = {
  runXmlParsing
};

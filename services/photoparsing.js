var fs = require('fs');
const mkdirp = require('mkdirp');
var Jimp = require('jimp');

let p_shopItemsArr = new Promise(function(resolve, reject) {
  var shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  if (shopItemsArr) resolve(shopItemsArr);
  else reject('Can not read ./public/import_foto/shopItemsArrFile.txt');
});

function fsavePictures(itemsArr) {
  console.log(itemsArr.length);
  let errorLogArr = [];

  let itemsCounter = 690;

  fSavePicOneItem(itemsCounter);

  function fSavePicOneItem(index) {
    let soursePath220 = encodeURI(itemsArr[index].picture);
    let soursePath800 = soursePath220.replace('220x220', '800x800');
    let folderPath = itemsArr[index].picture_220x220.substring(0, 37);

    mkdirp(folderPath, function(err) {
      if (err) console.log(err);
      else {
        fSave220();
      }
    });

    function fSave220() {
      Jimp.read(soursePath220, function(err, image) {
        if (err) {
          errorLogArr.push({ itemID: itemsArr[index].id, err });
          fSave800();
          console.log('Не вдалося прочитати фотку ' + soursePath220, err);
        } else {
          image.write(itemsArr[index].picture_220x220, (err, success) => {
            err ? console.log(err) : fSave800();
          });
        }
      });
    }

    function fSave800() {
      Jimp.read(soursePath800, function(err, image) {
        if (err) {
          errorLogArr.push({ itemID: itemsArr[index].id, err });
          nextTic();
          console.log('Не вдалося прочитати фотку ' + soursePath800, err);
        } else {
          image.write(itemsArr[index].picture_800x800, (err, success) => {
            err ? console.log(err) : nextTic();
          });
        }
      });
    }

    function nextTic() {
      console.log(itemsArr.length - index + ' of ' + itemsArr.length);
      index++;
      if (index < itemsArr.length) fSavePicOneItem(index);
      else {
        console.log('All pictures are saved!');
        console.log(errorLogArr);
      }
    }
  }
}

function runPhotoParsing() {
  console.log('Photoparsing');

  p_shopItemsArr
    .then(itemsArr => fsavePictures(itemsArr))
    .catch(error => {
      console.log(error);
    });
}

module.exports = {
  runPhotoParsing
};

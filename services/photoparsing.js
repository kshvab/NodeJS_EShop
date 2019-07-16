var fs = require('fs');
const mkdirp = require('mkdirp');
var Jimp = require('jimp');

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

function fsavePictures(itemsArr) {
  console.log(itemsArr.length);

  let itemsCounter = 1200;

  fSavePicOneItem(itemsCounter);

  function fSavePicOneItem(index) {
    let soursePath220 = encodeURI(itemsArr[index].picture);
    let soursePath800 = soursePath220.replace('220x220', '800x800');
    let folderPath = itemsArr[index].picture_220x220.substring(0, 37);

    //console.log(index);
    //console.log(itemsArr[index].id);
    //console.log(itemsArr[index].picture_800x800);
    console.log(
      index +
        1 +
        ' from ' +
        itemsArr.length +
        ' (rem ' +
        (itemsArr.length - index - 1) +
        ')'
    );

    mkdirp(folderPath, function(err) {
      if (err) console.log(err);
      else {
        fReadAndSave();
      }
    });

    function fReadAndSave() {
      Jimp.read(soursePath800)
        .then(image => {
          //console.log(index + ' --- PROCESSING ' + itemsArr[index].id);
          return image.writeAsync('public' + itemsArr[index].picture_800x800); // save 800
        })
        .then(image => {
          return image.resize(220, Jimp.AUTO); // resize
        })
        .then(image => {
          return image.writeAsync('public' + itemsArr[index].picture_220x220);
        })
        .then(nextTic(index + 1)) // save 220
        .catch(err => {
          fSaveAsNoImg(itemsArr[index]);
          console.error(err);
        });
    }

    function fSaveAsNoImg(item) {
      Jimp.read('public/images/noimage_800x800.png')
        .then(image => {
          return image
            .write('public' + item.picture_800x800) // save 800
            .resize(220, Jimp.AUTO) // resize
            .write('public' + item.picture_220x220);
        })
        .catch(err => {
          console.error(err);
        });
    }

    function nextTic(newIndex) {
      if (newIndex < itemsArr.length - 1) {
        setTimeout(() => {
          fSavePicOneItem(newIndex);
        }, 2500);
      } else {
        console.log('All pictures are saved!');
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

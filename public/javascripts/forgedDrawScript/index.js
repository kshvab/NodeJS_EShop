let canvas = document.getElementById('my_canvas');
/*
document.addEventListener('keydown', function(e) {
  console.log(e.keyCode);
});
*/

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 46) deleteActiveItem();
});

canvas.width = 2400;
canvas.height = 2400;

//  FILL the trueImagesArr
let trueImagesArr = [];
let imagesMapListPropertyNames = Object.keys(imagesMap);

for (let i = 0; i < imagesMapListPropertyNames.length; i++) {
  let name = imagesMapListPropertyNames[i];

  let image = new Image();
  image.src = imagesMap[imagesMapListPropertyNames[i]];

  trueImagesArr.push({
    name,
    image
  });
}
//console.log(trueImagesArr);

let context = canvas.getContext('2d');

let offsetX = canvas.offsetLeft;
let offsetY = canvas.offsetTop;

//------For dragging
let startX;
let startY;
let isDragActive = false;

// ----- For scaling
let scaleSize = 1;

//------Mouse actions
canvas.onmousedown = fMouseDown;
canvas.onmouseup = fMouseUp;
canvas.onmousemove = fMouseMove;
//canvas.onclick = fMouseClick;

let lineal1000 = new Image();
let lineal2000 = new Image();
let lineal4000 = new Image();
let lineal8000 = new Image();

lineal1000.src = 'images/forgeddraw/lineal1000mm.png';
lineal2000.src = 'images/forgeddraw/lineal2000mm.png';
lineal4000.src = 'images/forgeddraw/lineal4000mm.png';
lineal8000.src = 'images/forgeddraw/lineal8000mm.png';

let arr = [
  /*
  {
    figure: 'rectangle',
    name: 'figure Name',
    size: { width: 1000, height: 30 },
    pozition: { X: 100, Y: 100 },
    rotation: 0,
    isActive: false
  }
  */
];

draw(arr);

// --------- handle mouseup events
function fMouseUp(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();
  // clear all the dragging flags
  isDragActive = false;
}

function setItemActive(id) {
  for (let i = 0; i < arr.length; i++) {
    if (i == +id) arr[i].isActive = true;
    else arr[i].isActive = false;
  }
  draw(arr);
}

function rotateActiveItem(grad) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) arr[i].rotation = +grad;
  }
  draw(arr);
}

function moveActiveItemX(xPos) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) arr[i].pozition.X = +xPos;
  }
  draw(arr);
}

function moveActiveItemY(yPos) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) arr[i].pozition.Y = +yPos;
  }
  draw(arr);
}

function reflectionActiveItemX() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) arr[i].reflectionX = !arr[i].reflectionX;
  }
  draw(arr);
}

function reflectionActiveItemY() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) arr[i].reflectionY = !arr[i].reflectionY;
  }
  draw(arr);
}

function cloneActiveItem() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) {
      if (arr[i].img) {
        arr.push({
          img: arr[i].img,
          name: arr[i].name,
          size: { width: arr[i].size.width, height: arr[i].size.height },
          pozition: { X: 0, Y: 0 },
          rotation: arr[i].rotation,
          isActive: false,
          reflectionX: arr[i].reflectionX,
          reflectionY: arr[i].reflectionY,
          vendorId: arr[i].vendorId,
          basePrice: arr[i].basePrice,
          price: arr[i].price
        });
      }
      if (arr[i].figure) {
        arr.push({
          figure: arr[i].figure,
          name: arr[i].name,
          size: {
            width: arr[i].size.width,
            height: arr[i].size.height,
            border: arr[i].size.border
          },
          pozition: { X: 0, Y: 0 },
          rotation: arr[i].rotation,
          isActive: false
        });
      }
    }
  }

  draw(arr);
}

function deleteActiveItem() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) {
      arr.splice(i, 1);
    }
  }

  draw(arr);
}

function scaleCanvasDown() {
  //context.scale(0.5, 0.5);

  if (scaleSize < 4) {
    scaleSize++;
    canvas.width = canvas.width / 2;
    canvas.height = canvas.height / 2;
    for (let i = 0; i < arr.length; i++) {
      arr[i].size = {
        width: arr[i].size.width / 2,
        height: arr[i].size.height / 2,
        border: arr[i].size.border / 2
      };
      arr[i].pozition = {
        X: arr[i].pozition.X / 2,
        Y: arr[i].pozition.Y / 2
      };
    }
    draw(arr);
  }
}

function scaleCanvasUp() {
  //context.scale(2, 2);

  if (scaleSize > 1) {
    scaleSize--;
    canvas.width = canvas.width * 2;
    canvas.height = canvas.height * 2;
    for (let i = 0; i < arr.length; i++) {
      arr[i].size = {
        width: arr[i].size.width * 2,
        height: arr[i].size.height * 2,
        border: arr[i].size.border * 2
      };
      arr[i].pozition = { X: arr[i].pozition.X * 2, Y: arr[i].pozition.Y * 2 };
    }
    draw(arr);
  }
}

function draw(arr) {
  //console.log(scaleSize);
  console.log(arr);
  context.fillStyle = '#ededed';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //console.log(arr);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].img) {
      context.save();

      if (arr[i].rotation) {
        context.translate(
          arr[i].pozition.X + 0.5 * arr[i].size.width,
          arr[i].pozition.Y + 0.5 * arr[i].size.height
        );

        // translate to rectangle center
        // x = x + 0.5 * width
        // y = y + 0.5 * height
        context.rotate((Math.PI / 180) * +arr[i].rotation);
        context.translate(
          -(arr[i].pozition.X + 0.5 * arr[i].size.width),
          -(arr[i].pozition.Y + 0.5 * arr[i].size.height)
        ); // translate back
      }

      if (arr[i].reflectionX) {
        context.translate(
          arr[i].pozition.X,
          arr[i].pozition.Y + arr[i].size.height
        );
        context.rotate((180 * Math.PI) / 180);
        context.scale(1, -1);
        context.translate(
          -(arr[i].pozition.X + arr[i].size.width),
          -(arr[i].pozition.Y + arr[i].size.height)
        );
      }

      if (arr[i].reflectionY) {
        context.translate(
          arr[i].pozition.X + arr[i].size.width,
          arr[i].pozition.Y
        );
        context.rotate((180 * Math.PI) / 180);
        context.scale(-1, 1);
        context.translate(
          -(arr[i].pozition.X + arr[i].size.width),
          -(arr[i].pozition.Y + arr[i].size.height)
        );
      }

      context.drawImage(
        arr[i].img,
        +arr[i].pozition.X,
        +arr[i].pozition.Y,
        +arr[i].size.width,
        +arr[i].size.height
      );

      if (arr[i].isActive) {
        context.lineWidth = 1;
        context.strokeStyle = 'red';
        context.strokeRect(
          arr[i].pozition.X,
          arr[i].pozition.Y,
          arr[i].size.width,
          arr[i].size.height
        );
      }

      context.restore();
    }

    if (arr[i].figure) {
      context.save();

      if (arr[i].rotation) {
        context.translate(
          arr[i].pozition.X + 0.5 * arr[i].size.width,
          arr[i].pozition.Y + 0.5 * arr[i].size.height
        );

        // translate to rectangle center
        // x = x + 0.5 * width
        // y = y + 0.5 * height
        context.rotate((Math.PI / 180) * +arr[i].rotation);
        context.translate(
          -(arr[i].pozition.X + 0.5 * arr[i].size.width),
          -(arr[i].pozition.Y + 0.5 * arr[i].size.height)
        ); // translate back
      }

      if (arr[i].figure == 'rectangle') {
        context.fillStyle = '#444444';
        context.fillRect(
          arr[i].pozition.X,
          arr[i].pozition.Y,
          arr[i].size.width,
          arr[i].size.height
        );
      }

      if (arr[i].figure == 'ramka') {
        context.strokeStyle = '#444444';
        context.lineWidth = arr[i].size.border;
        context.strokeRect(
          arr[i].pozition.X + arr[i].size.border / 2,
          arr[i].pozition.Y + arr[i].size.border / 2,
          arr[i].size.width - arr[i].size.border,
          arr[i].size.height - arr[i].size.border
        );
      }

      if (arr[i].isActive) {
        context.lineWidth = 1;
        context.strokeStyle = 'red';
        context.strokeRect(
          arr[i].pozition.X,
          arr[i].pozition.Y,
          arr[i].size.width,
          arr[i].size.height
        );
      }

      context.restore();
    }
  }

  changePanel();
}

function fActiveItem() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isActive) return arr[i];
  }
}

function fMouseDown(event) {
  //on canvas
  // tell the browser we're handling this mouse event
  event.preventDefault();
  event.stopPropagation();

  // get the current mouse position
  //console.log(document.getElementById('canvas_container').scrollLeft);
  //console.log(document.getElementById('canvas_container').scrollTop);
  var mx = parseInt(
    event.clientX -
      offsetX +
      document.getElementById('canvas_container').scrollLeft
  );
  var my = parseInt(
    event.clientY -
      offsetY +
      document.getElementById('canvas_container').scrollTop
  );
  //console.log(mx + ' : ' + my);
  // save the current mouse position
  startX = mx;
  startY = my;
  isDragActive = true;

  let target = { id: -1, gipo: 0 };
  for (let i = 0; i < arr.length; i++) {
    let centerX = arr[i].pozition.X + arr[i].size.width / 2;
    let centerY = arr[i].pozition.Y + arr[i].size.height / 2;

    let limitZoneRadius = Math.sqrt(
      (arr[i].size.width / 2) * (arr[i].size.width / 2) +
        (arr[i].size.height / 2) * (arr[i].size.height / 2)
    );

    let gipo = Math.sqrt(
      (mx - centerX) * (mx - centerX) + (my - centerY) * (my - centerY)
    );

    if (target.id == -1 && limitZoneRadius > gipo) {
      target.id = i;
      target.gipo = gipo;
    } else {
      if (gipo < target.gipo && limitZoneRadius > gipo) {
        target.id = i;
        target.gipo = gipo;
      }
    }
  }
  if (target.id != -1) setItemActive(target.id);
  else setItemActive(-1);
}

// handle mouse moves
function fMouseMove(e) {
  if (isDragActive) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = parseInt(
      e.clientX -
        offsetX +
        document.getElementById('canvas_container').scrollLeft
    );
    var my = parseInt(
      e.clientY -
        offsetY +
        document.getElementById('canvas_container').scrollTop
    );

    // calculate the distance the mouse has moved
    // since the last mousemove
    var dx = mx - startX;
    var dy = my - startY;

    // move each rect that isDragging
    // by the distance the mouse has moved
    // since the last mousemove
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];

      if (item.isActive) {
        item.pozition.X += dx;
        item.pozition.Y += dy;
      }
    }

    // redraw the scene with the new rect positions
    draw(arr);

    // reset the starting mouse position for the next mousemove
    startX = mx;
    startY = my;
  }
}

function changePanel() {
  let item = fActiveItem();
  if (item) {
    document.getElementById('input-range-rotation-angle').value = item.rotation;

    document.getElementById('input-number-rotation-angle').value =
      item.rotation;

    document.getElementById('active-item-input-pozition-x').value =
      item.pozition.X;

    document.getElementById('active-item-input-pozition-y').value =
      item.pozition.Y;
  }

  document.getElementById('canvas-size-input-w').value = canvas.width;

  document.getElementById('canvas-size-input-h').value = canvas.height;
}

function changeCanvasSizeW(value) {
  canvas.width = value;
  draw(arr);
}
function changeCanvasSizeH(value) {
  canvas.height = value;
  draw(arr);
}

function addFromTeka(e) {
  e.preventDefault();
  e.stopPropagation();

  let targetVendorId = e.target.value;
  let itemForDrow = fBuildItemForDrow(targetVendorId);

  let currentScaleSize = scaleSize;
  let scalingTimes = scaleSize - 1;
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasUp();
  }
  arr.push(itemForDrow);
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasDown();
  }

  draw(arr);

  function fBuildItemForDrow(targetVendorId) {
    let itemForDrow = {};

    let img;
    let name;
    let vendorId = targetVendorId;
    let size;
    let pozition = { X: 0, Y: 0 };
    let rotation = 0;
    let isActive = false;
    let reflectionX = false;
    let reflectionY = false;
    let price = e.target.getAttribute('price');
    let basePrice = e.target.getAttribute('basePrice');

    for (let i = 0; i < mainSourceImagesArr.length; i++) {
      let styleItemsArr = mainSourceImagesArr[i].styleItems;

      for (let k = 0; k < styleItemsArr.length; k++) {
        let typeItems = styleItemsArr[k].items;

        for (let s = 0; s < typeItems.length; s++) {
          if (typeItems[s].vendorId == targetVendorId) {
            name = styleItemsArr[k].type;
            let type = styleItemsArr[k].type;

            for (let m = 0; m < trueImagesArr.length; m++) {
              if (type == trueImagesArr[m].name) {
                img = trueImagesArr[m].image;
              }
            }

            size = {
              width: typeItems[s].width,
              height: typeItems[s].height
            };
          }
        }
      }
    }

    itemForDrow = {
      img,
      name,
      vendorId,
      size,
      pozition,
      rotation,
      isActive,
      reflectionX,
      reflectionY,
      price,
      basePrice
    };
    return itemForDrow;
  }
}

function addNewRect() {
  let width = document.getElementById('new-rect-input-width').value;
  let height = document.getElementById('new-rect-input-height').value;

  if (!width || !height) {
    alert('Введите корректные размеры');
    return 0;
  }

  let scalingTimes = scaleSize - 1;
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasUp();
  }
  arr.push({
    figure: 'rectangle',
    name: 'Пользовательский прямоугольник',
    size: { width, height },
    pozition: { X: 100, Y: 100 },
    rotation: 0,
    isActive: false
  });
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasDown();
  }

  draw(arr);
}

function addNewRamka() {
  let border = document.getElementById('new-ramka-input-border').value;
  let width = document.getElementById('new-ramka-input-width').value;
  let height = document.getElementById('new-ramka-input-height').value;

  if (
    !width ||
    !height ||
    !border ||
    border >= width / 3 ||
    border >= height / 3
  ) {
    alert('Введите корректные размеры');
    return 0;
  }

  let scalingTimes = scaleSize - 1;
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasUp();
  }
  arr.push({
    figure: 'ramka',
    name: 'Пользовательская рамка',
    size: { width, height, border },
    pozition: { X: 100, Y: 100 },
    rotation: 0,
    isActive: false
  });
  for (let i = 0; i < scalingTimes; i++) {
    scaleCanvasDown();
  }

  draw(arr);
}

function fExportShopItems() {
  if (!arr.length) {
    alert('Вы не используете элементы из магазина.');
    return 0;
  }

  let ok = confirm(
    'Рисунок будет удален, а элементы будут перемещены в корзину. Продолжить?'
  );
  if (!ok) return 0;
  let vendorIdArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].vendorId) vendorIdArr.push(arr[i].vendorId);
  }

  if (!vendorIdArr.length) {
    alert('Вы не используете элементы из магазина.');
    return 0;
  }

  let result = {};
  vendorIdArr.forEach(function(a) {
    if (result[a] != undefined) ++result[a];
    else result[a] = 1;
  });

  //price,
  //basePrice

  let toShopCartArr = [];

  for (var key in result)
    toShopCartArr.push({ itemVendorCode: key, quantity: result[key] });
  console.log(toShopCartArr);

  for (let i = 0; i < toShopCartArr.length; i++) {
    for (let k = 0; k < arr.length; k++) {
      if (arr[k].vendorId && arr[k].vendorId == key) {
        toShopCartArr[i].price = arr[k].price;
        toShopCartArr[i].basePrice = arr[k].basePrice;
      }
    }
  }
  //console.log('число ' + key + ' == ' + result[key] + ' раз(а) <br>');

  let index = 0;
  addItemToShopCart(index);

  function addItemToShopCart(i) {
    console.log(i);
    var data = {
      itemVendorCode: toShopCartArr[i].itemVendorCode,
      quantity: toShopCartArr[i].quantity,
      price: toShopCartArr[i].price,
      basePrice: toShopCartArr[i].basePrice
    };
    console.log(data);
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/shopcart/additem'
    }).done(function(result) {
      console.log(result);

      index++;
      if (index < toShopCartArr.length) addItemToShopCart(index);
      else {
        fRedirectToShopCart();
      }
    });
  }

  function fRedirectToShopCart() {
    $('#loading-overlay').show();
    setTimeout(function() {
      window.location.href = '/shopcart';
      //$('<a href="/shopcart" target="blank"></a>')[0].click();
      //window.location.reload(true);
    }, 1000);
  }
  //$('#forgeddrawmodal').modal();
}

function fAddLineal() {
  console.log(scaleSize);
  let img;
  switch (scaleSize) {
    case 1:
      img = lineal1000;
      break;
    case 2:
      img = lineal2000;
      break;
    case 3:
      img = lineal4000;
      break;
    default:
      img = lineal8000;
  }
  arr.push({
    img,
    figure: 'lineal',
    name: 'lineal1000',
    size: { width: 1000, height: 18 },
    pozition: { X: 100, Y: 100 },
    rotation: 0,
    isActive: false,
    reflectionX: false,
    reflectionY: false
  });

  draw(arr);
}

const express = require('express');
const router = express.Router();
var fs = require('fs');

// POST Add item to shopCart
router.post('/additem', (req, res) => {
  const itemVendorCode = req.body.itemVendorCode;
  const quantity = req.body.quantity;

  var shopItemsArrStr = fs.readFileSync(
    './public/import_foto/shopItemsArrFile.txt',
    {
      encoding: 'UTF-8'
    }
  );
  var shopItemsArr = JSON.parse(shopItemsArrStr);

  var itemForAdding = shopItemsArr.filter(function(item) {
    return item.vendorCode == itemVendorCode;
  });
  itemForAdding = itemForAdding[0];
  itemForAdding.quantity = quantity;
  console.log('req.session.shopCart ' + req.session.shopCart);
  if (!req.session.shopCart) req.session.shopCart = [];
  req.session.shopCart.push(itemForAdding);
  console.log(req.session);

  res.json({
    ok: true,
    shopCart: req.session.shopCart
  });
});

module.exports = router;

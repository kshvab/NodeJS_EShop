const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema(
  {
    userLogin: {
      type: String,
      required: true
    },
    wishlist: [
      {
        vendorCode: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

let wishlist = mongoose.model('wishlist', wishlistSchema);

module.exports = wishlist;

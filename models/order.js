const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true
    },
    user: {
      name: String,
      login: String,
      _id: String,
      customer: String,
      email: String,
      phonenumber: {
        type: String,
        required: true
      },
      group: {
        type: String,
        required: true,
        default: 'Guest'
      },
      deliveryType: String,
      deliveryCity: String,
      deliveryDepartment: String,
      paymentMethod: String,
      ordercomment: String
    },
    shopcart: [
      {
        vendorCode: {
          type: String,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        inputPriceUsd: {
          type: String,
          required: true
        },
        basePrice: {
          type: String,
          required: true
        },
        price: {
          type: String,
          required: true
        },
        quantity: {
          type: String,
          required: true
        },
        picture: {
          type: String,
          required: false
        },
        picture_220x220: {
          type: String,
          required: false
        },
        picture_800x800: {
          type: String,
          required: false
        },
        groups: {
          type: String,
          required: false
        }
      }
    ],
    discount: {
      type: String,
      required: false
    },
    unloaded: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

let order = mongoose.model('order', orderSchema);

module.exports = order;

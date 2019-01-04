const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    login: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true,
      default: 'Registered'
    },
    telegramUserId: String
  },
  {
    timestamps: true
  }
);

let user = mongoose.model('user', userSchema);

module.exports = user;

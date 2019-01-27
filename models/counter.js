const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  sequence_value: {
    type: Number,
    required: true
  }
});

let counter = mongoose.model('counter', counterSchema);

module.exports = counter;

const mongoose = require('mongoose');

const forumsectionSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    alias: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

let forumsection = mongoose.model('forumsection', forumsectionSchema);

module.exports = forumsection;

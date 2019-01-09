const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      required: true
    },
    alias: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    shorttext: {
      type: String,
      required: true
    },
    fulltext: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    keywords: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

let publication = mongoose.model('publication', publicationSchema);

module.exports = publication;

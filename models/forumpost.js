const mongoose = require('mongoose');

const forumpostSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    topicalias: {
      type: String,
      required: true
    },
    fulltext: {
      type: String,
      required: true
    },
    picture: {
      type: String,
      required: false
    },
    author: {
      type: String,
      required: true
    },
    authorgroup: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

let forumpost = mongoose.model('forumpost', forumpostSchema);

module.exports = forumpost;

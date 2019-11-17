const mongoose = require('mongoose');

const forumtopicSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    sectionalias: {
      type: String,
      required: true
    },
    sectiontitle: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    alias: {
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

let forumtopic = mongoose.model('forumtopic', forumtopicSchema);

module.exports = forumtopic;

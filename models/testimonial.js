const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    shopitemid: {
      type: String,
      required: true
    },
    authorname: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    approved: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true
  }
);

let testimonial = mongoose.model('testimonial', testimonialSchema);

module.exports = testimonial;

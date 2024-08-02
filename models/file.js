const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  imageBuffer: {
    type: Buffer,
    required: true,
  },
  imageBufferThumbnail: {
    type: Buffer,
    required: true,
  },

  uploadDate: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Image", ImageSchema);

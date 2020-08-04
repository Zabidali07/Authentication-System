const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    default: "none",
    required: true,
  },
  imageData: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Images", imageSchema);

const express = require("express");
const multer = require("multer");
const ImageModel = require("../models/image");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./server/uploads", // this is where your file will be store
  filename: function (__, file, cb) {
    // here we configure the filename
    cb(null, "IMAGE-" + Date.now() + file.originalname); // we provide
    //particular name format to prevent overwritting
  },
});

// this is the filter, where i specify that which type of image is allowed
//to upload. here it is "jpeg and png"
const fileFilter = (__, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// file size is specified in bits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
}).single("myImage"); //.single is that we will upload single file only
// and we specify a key here that will recognized in frontend

router.post("/image-upload", (req, res) => {
  return upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    const newImage = new ImageModel({
      imageName: req.file.originalname,
      imageData: req.file.path,
    });

    newImage.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }

      return res.json({
        success: true,
        documnet: result,
      });
    });
  });
});

module.exports = router;

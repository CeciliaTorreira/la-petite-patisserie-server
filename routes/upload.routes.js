const router = require("express").Router();

const uploader = require("../middlewares/cloudinary.config.js");

// POST "/api/upload"
router.post("/", uploader.single("picture"), (req, res, next) => {
  if (!req.file) {
    next("No file uploaded!");
    return;
  }

  res.json({ picture: req.file.path });
});

module.exports = router;

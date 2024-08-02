const multer = require("multer");
const path = require("path");
const getFormattedDateTime = require("../util/dateTimeUtil");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${getFormattedDateTime()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

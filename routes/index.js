var config = require('../config');
var multer = require('multer');
var multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get('upload:directory'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var uploadFields = config.get('upload:fields').map(function(field) {
  return {
    name: field,
    maxCount: 1
  }
});
var upload = multer({ storage: multerStorage }).fields(uploadFields);

// Controllers
var fileController = require('../controllers/file');

module.exports = function(app) {
  app.post('/upload', upload, fileController.upload);
};
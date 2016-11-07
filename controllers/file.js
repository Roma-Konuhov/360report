var multer = require('multer');
var logger = require('../lib/logger')(module);
var config = require('../config');

var multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get('upload_directory'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

exports.upload = function(req, res, next) {
  var upload = multer({ storage: multerStorage }).single('file');

  upload(req, res, function(err) {
    if (err) {
      logger.error(err);
      return res.status(500).json({ status: 'fail', error: err });
    }
    logger.info('File ' + req.file.originalname + ' was uploaded');
    res.json({status: 'ok'});
  });
};

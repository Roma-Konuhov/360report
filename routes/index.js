var config = require('../config');
var multer = require('multer');
var multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get('upload_directory'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: multerStorage }).fields([
  { name: 'consultant_questions', maxCount: 1 },
  { name: 'manager_questions', maxCount: 1 },
  { name: 'people_relations', maxCount: 1 }
]);

// Controllers
var fileController = require('../controllers/file');

module.exports = function(app) {
  app.post('/upload', upload, fileController.upload);
};
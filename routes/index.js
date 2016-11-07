var config = require('../config');

// Controllers
var fileController = require('../controllers/file');

module.exports = function(app) {
  app.post('/upload', fileController.upload);
};
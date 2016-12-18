var fs = require('fs');
var config = require('../config');

/*
 * File uploader settings
 */
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

/*
 * Controllers
 */
var fileController = require('../controllers/file');
var consultantController = require('../controllers/consultant');
var managerController = require('../controllers/manager');
var relationController = require('../controllers/relation');
var userController = require('../controllers/user');
var exportController = require('../controllers/export');

/*
 * Routes
 */
module.exports = function(app) {
  app.post('/upload', upload, fileController.upload);
  app.get('/users', userController.usersGet);
  app.get('/user/:id', userController.userGet);
  app.get('/people-relations', relationController.revieweesGet);
  app.get('/export/:filename', exportController.exportGet);
  app.get('/lms', userController.lmsGet);

  app.get('/reviewees-by-consultants', consultantController.revieweesGet);
  app.get('/consultant/report/:id', consultantController.reportGet);
  app.get('/consultant/statistics/:id', consultantController.statisticsGet);
  app.post('/consultant/export/:format/:id', consultantController.exportFilePost);

  app.get('/reviewees-by-managers', managerController.revieweesGet);
  app.get('/manager/report/:id', managerController.reportGet);
  app.get('/manager/statistics/:id', managerController.statisticsGet);
  app.post('/manager/export/:format/:id', managerController.exportFilePost);
};
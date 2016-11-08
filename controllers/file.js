var config = require('../config');
var async = require('async');
var logger = require('../lib/logger')(module);
var _ = require('lodash');
var ConsultantReport = require('../models/ConsultantReport');
// var ManagerQuestion = require('../models/ConsultantReport');
// var PeopleRelation = require('../models/ConsultantReport');

var FILETYPE_TO_MODEL_MAP = _.zipObject(config.get('upload:fields'), [
  ConsultantReport,
  'ManagerReport',
  'PeopleRelation'
]);

exports.upload = function(req, res, next) {
    console.log('uplad',  req.files)

  for (var fileType in FILETYPE_TO_MODEL_MAP) {
    if (req.files[fileType] && req.files[fileType][0]) {
      logger.info('File ' + req.files[fileType][0].originalname + ' was uploaded');
      var filepath = req.files[fileType][0].path;

      if (!FILETYPE_TO_MODEL_MAP[fileType]) {
        var message = 'The name of the field for uploaded file is not supported';
        logger.warn(message);
        return res.status(405).json({ status: 'fail', error: message });
      }

      var Model = FILETYPE_TO_MODEL_MAP[fileType];

      async.waterfall([
        Model.dropCollection,
        Model.parse.bind(Model, filepath),
        Model.validate,
        Model.castQuestionAnswers,
        Model.saveCollection
      ], function(err, result) {
        if (err) {
          logger.error(err);
          return res.status(500).json({ status: 'fail', error: err });
        }
        logger.info("%d records were saved in the database", result.length);
      });
    }
  }

  res.json({status: 'ok'});
};

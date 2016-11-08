var async = require('async');
var logger = require('../lib/logger')(module);
var ConsultantQuestion = require('../models/ConsultantQuestion');
// var ManagerQuestion = require('../models/ConsultantQuestions');
// var PeopleRelation = require('../models/ConsultantQuestions');

var MAP_FILETYPE_TO_MODEL = {
  'consultant_questions': ConsultantQuestion,
  'manager_questions': 'ManagerQuestion',
  'people_relations': 'PeopleRelation'
};

exports.upload = function(req, res, next) {
    console.log('uplad',  req.files)

  for (var fileType in MAP_FILETYPE_TO_MODEL) {
    if (req.files[fileType] && req.files[fileType][0]) {
      logger.info('File ' + req.files[fileType][0].originalname + ' was uploaded');
      var filepath = req.files[fileType][0].path;
      var Model = MAP_FILETYPE_TO_MODEL[fileType];
      if (!Model) {
        var message = 'The name of the field for uploaded file is not supported';
        logger.warn(message);
        return res.status(405).json({ status: 'fail', error: message });
      }
      async.waterfall([
        Model.parse.bind(Model, filepath),
        Model.validate,
        Model.castQuestionAnswers,
        Model.save
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

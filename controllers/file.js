var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var config = require('../config');
var HttpError = require('../lib/error').HttpError;
var logger = require('../lib/logger')(module);
var ConsultantReport = require('../models/ConsultantReport');
var ManagerReport = require('../models/ManagerReport');
var Relation = require('../models/Relation');
var User = require('../models/User');
var gApi = require('../models/GoogleApi');

var FILETYPE_TO_MODEL_MAP = _.zipObject(config.get('upload:fields'), [
  ConsultantReport,
  ManagerReport,
  Relation,
  User,
  gApi
]);

/**
 * Returns call stack for specified file type
 *
 * @param {String} fileType
 * @returns {Array}
 */
const getCallStackFor = function(fileType, filepath, company) {
  var Model = FILETYPE_TO_MODEL_MAP[fileType];

  switch (fileType) {
    case 'users':
      return [
        Model.dropCollection,
        Model.parse.bind(Model, filepath),
        Model.filterByCompany.bind(Model, company),
        Model.validate,
        Model.saveCollection
      ];
    case 'people_relations':
      return [
        Model.dropCollection,
        Model.parse.bind(Model, filepath),
        Model.validate,
        Model.castRelations,
        Model.addEmailFields,
        Model.saveCollection
      ];
    case 'consultant_report':
    case 'manager_report':
      return [
        Model.dropCollection,
        Model.parse.bind(Model, filepath),
        Model.validate,
        Model.castAnswers,
        Model.saveCollection
      ];
    case 'google_api_credentials':
      return [
        Model.storeCredentials.bind(Model, filepath)
      ];
    default:
      return [];
  }
};

exports.upload = function(req, res, next) {
  for (var fileType in FILETYPE_TO_MODEL_MAP) {
    if (req.files[fileType] && req.files[fileType][0]) {
      var filename = req.files[fileType][0].originalname;
      logger.info('File "%s" was uploaded', filename);
      var filepath = req.files[fileType][0].path;

      if (!FILETYPE_TO_MODEL_MAP[fileType]) {
        var message = 'The name of the field for uploaded file is not supported';
        logger.warn(message);
        return next(new HttpError(405, message));
      }

      var callStack = getCallStackFor(fileType, filepath, req.body.company);

      async.waterfall(callStack, function(err, result) {
        if (config.get('upload:removeAfterProcessing')) {
          fs.unlink(filepath, function(err) {
            if (err) {
              logger.warn('During removing of the CSV file "%s" the error is occurred: %s', filepath, err);
            } else {
              logger.info('CSV file "%s" was removed', filepath);
            }
          });
        }
        if (err) {
          logger.error(err);
          return next(new HttpError(400, err));
        }
        if (result) {
          logger.info("%d records were saved in the database", result.length);
          res.status(200).json({message: `data from file ${filename} were stored successfully`});
        }
      });
    }
  }
};

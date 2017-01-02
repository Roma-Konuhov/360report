var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
var async = require('async');
var ManagerReport = require('../models/ManagerReport');
var User = require('../models/User');
var _ = require('lodash');

exports.revieweesGet = function(req, res) {
  return async.waterfall([
    function(cb) {
      ManagerReport.getReviewees(function(err, data) {
        cb(null, data);
      });
    },
    function(reviewees, cb) {
      User.find({}, function(err, users) {
        var result = [], item, user;
        if (!_.isEmpty(users)) {
          for (var i in reviewees) {
            item = _.clone(reviewees[i]);
            user = _.find(users, {name: reviewees[i].username});
            if (!user) {
              logger.warn('No user with name "%s"', reviewees[i].username);
              continue;
            }
            item.id = user.get('id');
            result.push(item);
          }
        }
        cb(null, result);
      });
    }
  ], function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result);
  });
};

exports.reportGet = function(req, res) {
  return async.waterfall([
    ManagerReport.getReport.bind(null, req.params.id),
    ManagerReport.regroupBySeries
  ], function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result);
  });
};

exports.statisticsGet = function(req, res) {
  ManagerReport.getStatistics(req.params.id, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result)
  });
};

exports.suggestionsGet = function(req, res, next) {
  ManagerReport.getSuggestions(req.params.id, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result)
  });
};

/**
 * Action to export report to file (PDF or PNG)
 *
 * @param req
 * @param res
 * @param next
 */
exports.exportFilePost = function(req, res, next) {
  var id = req.params.id;
  var format = req.params.format;

  exportFile(id, format, res, function(err, response) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(response);
  });
};

/**
 * Exports report to file (PDF or PNG)
 *
 * @param id
 * @param format (pdf|png)
 * @param res
 * @param cb
 */
var exportFile = function(id, format, res, cb) {
  var ExportController = require('./export');

  var getReportAnswers = function(id, cb) {
    async.waterfall([
      ManagerReport.getReport.bind(ManagerReport, id),
      ManagerReport.regroupBySeries.bind(ManagerReport),
    ], cb);
  };

  async.parallel({
    answers: getReportAnswers.bind(ManagerReport, id),
    statistics: ManagerReport.getStatistics.bind(ManagerReport, id),
    suggestions: ManagerReport.getSuggestions.bind(ManagerReport, id),
    user: User.findById.bind(User, id),
  }, function(err, reportConfig) {
    logger.info("report config: %j", reportConfig);
    if (err) {
      logger.error(err.message);
      return cb(err);
    }

    reportConfig['uriPrefix'] = 'manager';
    reportConfig['format'] = format;

    ExportController.exportFile(res, reportConfig, cb);
  });
};

exports.exportFile = exportFile;

/**
 * Export reports for all subordinators of the specified LM
 * LM is specified by id
 *
 * @param req
 * @param res
 * @param next
 */
exports.exportBulkPost = function(req, res, next) {
  var lmId = req.params.id;
  var format = req.params.format;

  exportBulk(lmId, format, res, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message))
    }
    res.json(result);
  });
};

/**
 * Export reports for all subordinators of the specified LM
 * LM is specified by id
 *
 * @param lmId
 * @param format
 * @param res
 * @param cb
 */
var exportBulk = function(lmId, format, res, cb) {
  var ExportController = require('./export');
  var errors = [];
  var responses = [];
  var processCounter = 0;

  User.getSubordinatesFor(lmId, function(err, subordinates) {
    _.each(subordinates, (subordinate) => {
      var subordinateId = subordinate._id;
      var getReportAnswers = function(id, cb) {
        async.waterfall([
          ManagerReport.getReport.bind(ManagerReport, id),
          ManagerReport.regroupBySeries.bind(ManagerReport),
        ], cb);
      };

      async.parallel({
        answers: getReportAnswers.bind(ManagerReport, subordinateId),
        statistics: ManagerReport.getStatistics.bind(ManagerReport, subordinateId),
        suggestions: ManagerReport.getSuggestions.bind(ManagerReport, subordinateId),
        user: User.findById.bind(User, subordinateId),
      }, function(err, reportConfig) {
        logger.info("report config: %j", reportConfig);
        if (err) {
          logger.error(err);
          errors.push(err.message);
        }

        reportConfig['uriPrefix'] = 'manager';
        reportConfig['format'] = format;

        ExportController.exportFile(res, reportConfig, function(err, response) {
          if (err) {
            logger.error(err);
            errors.push(err.message);
          }

          responses.push(response);
          processCounter++;
          logger.info('Processed files: %d from %d', processCounter, subordinates.length);
          if (processCounter === subordinates.length) {
            if (errors.length) {
              logger.error('The following errors occurred: %j', errors);
              return cb({ message: errors });
            }
            logger.info('Files were exported successfully');
            let result = { message: [], filenames: [] };
            responses.forEach((response) => {
              if (response.status === 'ok') {
                result.filenames.push(response.filename);
                result.message.push(response.message);
              }
            });
            if  (!result.message.length) {
              result.message = 'Reports for all managers are empty';
            }
            return cb(null, result, responses);
          }
        });
      });
    });
    if (!subordinates) {
      return cb({ message: 'There are no any subordinates assigned to specified LM' });
    }
  });
};

exports.exportBulk = exportBulk;

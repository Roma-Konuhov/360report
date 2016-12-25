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
        var result = [], item;
        if (!_.isEmpty(users)) {
          for (var i in reviewees) {
            item = _.clone(reviewees[i]);
            item.id = _.find(users, {name: reviewees[i].username}).get('id');
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

exports.exportFilePost = function(req, res, next) {
  var id = req.params.id;
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
    user: User.findById.bind(User, id),
  }, function(err, reportConfig) {
    logger.info("report config: %j", reportConfig);
    if (err) {
      logger.error(err);
      return next(new HttpError(400, err.message));
    }

    reportConfig['uriPrefix'] = 'manager';
    reportConfig['format'] = req.params.format;

    ExportController.exportFile(req, res, reportConfig, function(err, response) {
      if (err) {
        return next(new HttpError(400, err.message));
      }
      res.json(response);
    });
  });
};


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
        user: User.findById.bind(User, subordinateId),
      }, function(err, reportConfig) {
        logger.info("report config: %j", reportConfig);
        if (err) {
          logger.error(err);
          errors.push(err.message);
        }

        reportConfig['uriPrefix'] = 'manager';
        reportConfig['format'] = req.params.format;

        ExportController.exportFile(req, res, reportConfig, function(err, response) {
          if (err) {
            return next(new HttpError(400, err.message));
          }

          responses.push(response);
          processCounter++;
          logger.info('Processed files: %d from %d', processCounter, subordinates.length);
          if (processCounter === subordinates.length) {
            if (errors.length) {
              logger.error('The following errors occur: %j', errors);
              return next(new HttpError(400, errors));
            }
            logger.info('Files were exported successfully');
            let result = { message: 'Files were exported successfully', filenames: [] };
            responses.forEach((response) => {
              result.filenames.push(response.filename);
            });
            res.json(result);
          }
        });
      });
    });
    if (!subordinates) {
      res.json({ message: 'There are no any subordinates assigned to specified LM'});
    }
  });
};

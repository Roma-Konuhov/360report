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

    ExportController.exportFile(req, res, reportConfig, function(err, response) {
      if (err) {
        return next(new HttpError(400, err.message));
      }
      res.json(response);
    });
  });
};
var _ = require('lodash');
var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
var async = require('async');
var ConsultantReport = require('../models/ConsultantReport');
var User = require('../models/User');

exports.revieweesGet = function(req, res, next) {
  return async.waterfall([
    function(cb) {
      ConsultantReport.getReviewees(function(err, data) {
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

exports.reportGet = function(req, res, next) {
  return async.waterfall([
    ConsultantReport.getReport.bind(null, req.params.id),
    //ConsultantReport.addQuestionText,
    //ConsultantReport.addRelationStr,
    ConsultantReport.regroupBySeries
  ], function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result);
  });
};

exports.statisticsGet = function(req, res, next) {
  ConsultantReport.getStatistics(req.params.id, function(err, result) {
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
      ConsultantReport.getReport.bind(ConsultantReport, id),
      ConsultantReport.regroupBySeries.bind(ConsultantReport),
    ], cb);
  };

  async.parallel({
    answers: getReportAnswers.bind(ConsultantReport, id),
    statistics: ConsultantReport.getStatistics.bind(ConsultantReport, id),
    user: User.findById.bind(User, id),
  }, function(err, reportConfig) {
    logger.info("report config: %j", reportConfig);
    if (err) {
      logger.error(err);
      return next(new HttpError(400, err.message));
    }

    reportConfig['uriPrefix'] = 'consultant';

    ExportController.exportFile(req, res, reportConfig, function(err, response) {
      if (err) {
        return next(new HttpError(400, err.message));
      }
      res.json(response);
    });
  });
};

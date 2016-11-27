var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
var async = require('async');
var ConsultantReport = require('../models/ConsultantReport');
var User = require('../models/User');
var _ = require('lodash');

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
        for (var i in reviewees) {
          item = _.clone(reviewees[i]);
          item.id = _.find(users, { name: reviewees[i].username }).get('id');
          result.push(item);
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

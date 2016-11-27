var logger = require('../lib/logger')(module);
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
      return res.status(400).json({status: 'fail', message: err});
    }
    res.json({ status: 'ok', data: result });
  });
};

exports.reportGet = function(req, res) {
  return async.waterfall([
    ManagerReport.getReport.bind(null, req.params.id),
    ManagerReport.regroupBySeries
  ], function(err, result) {
    if (err) {
      return res.status(400).json({status: 'fail', message: err});
    }
    res.json({ status: 'ok', data: result });
  });
};

exports.statisticsGet = function(req, res) {
  ManagerReport.getStatistics(req.params.id, function(err, result) {
    if (err) {
      return res.status(400).json({satus: 'fail', message: err});
    }
    res.json({status: 'ok', data: result})
  });
};

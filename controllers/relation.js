var logger = require('../lib/logger')(module);
var Relation = require('../models/Relation');
var relations = require('../config/data').relations;

var mapRelationDbToScreen = function(data) {
  var result = []

  for (var i in data) {
    result[i] = data[i].toObject();
    result[i].relation = relations[data[i].relation];
  }

  return result;
};

exports.revieweesGet = function(req, res) {
  return Relation.find({}, function(err, data) {
    if (err) {
      logger.error(err);
      return res.status(400).json({ status: 'fail', message: err });
    }
    logger.info('List of people relations was fetched successfully');
    res.json({ status: 'ok', data: mapRelationDbToScreen(data) });
  });
};
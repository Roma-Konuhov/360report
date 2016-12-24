var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
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
  return Relation.find({}, null, { sort: { responder: 1 } }, function(err, data) {
    if (err) {
      logger.error(err);
      return next(new HttpError(400, err.message));
    }
    logger.info('List of people relations was fetched successfully');
    res.json(mapRelationDbToScreen(data));
  });
};
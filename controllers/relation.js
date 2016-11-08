var logger = require('../lib/logger')(module);
var Relation = require('../models/Relation');

exports.revieweesGet = function(req, res) {
  return Relation.find({}, function(err, data) {
    if (err) {
      logger.error(err);
      return res.status(400).json({ status: 'fail', message: err });
    }
    logger.info('List of people relations was fetched successfully');
    res.json({ status: 'ok', data: data });
  });
};
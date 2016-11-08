var logger = require('../lib/logger')(module);
var ConsultantReport = require('../models/ConsultantReport');

exports.revieweesGet = function(req, res) {
  return ConsultantReport.aggregate([
    { $group: { _id: "$reviewee", responders_number: { $sum: 1 } }},
    { $project: { username: "$_id", responders_number: "$responders_number" } },
  ], function(err, data) {
    if (err) {
      logger.error(err);
      return res.status(400).json({ status: 'fail', message: err });
    }
    logger.info('List of reviewees performed by consultant was fetched successfully');
    res.json({ status: 'ok', data: data });
  });
};
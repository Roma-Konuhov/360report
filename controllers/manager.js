var logger = require('../lib/logger')(module);
var ManagerReport = require('../models/ManagerReport');

exports.revieweesGet = function(req, res) {
  return ManagerReport.getReviewees(function(err, data) {
    if (err) {
      return res.status(400).json({status: 'fail', message: err});
    }
    res.json({ status: 'ok', data: data });
  });
};
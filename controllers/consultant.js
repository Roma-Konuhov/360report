var logger = require('../lib/logger')(module);
var ConsultantReport = require('../models/ConsultantReport');

exports.revieweesGet = function(req, res) {
  return ConsultantReport.getReviewees(function(err, data) {
    if (err) {
      return res.status(400).json({status: 'fail', message: err});
    }
    res.json({ status: 'ok', data: data });
  });
};

// SELECT * FROM consultant_report WHERE username='Julia' and
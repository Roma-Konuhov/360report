var User = require('../models/User');
var logger = require('../lib/logger')(module);

exports.userGet = function(req, res) {
  var id = req.params.id;
logger.info('request user with id %s', id)
  User.findById(id, function(err, result) {
    if (err) {
      return res.status(400).json({status: 'fail', message: err});
    }
    res.json({ status: 'ok', data: result });
  });
};



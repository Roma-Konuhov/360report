var HttpError = require('../lib/error').HttpError;
var User = require('../models/User');
var logger = require('../lib/logger')(module);

exports.userGet = function(req, res) {
  var id = req.params.id;
logger.info('request user with id %s', id)
  User.findById(id, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result);
  });
};



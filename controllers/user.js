var HttpError = require('../lib/error').HttpError;
var User = require('../models/User');
var logger = require('../lib/logger')(module);

exports.userGet = function(req, res, next) {
  var id = req.params.id;
  logger.info('request user with id %s', id);
  User.findById(id, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    logger.info('user with ID %s was fetched successfully', id);
    res.json(result);
  });
};

exports.usersGet = function(req, res, next) {
  logger.info('request list of all users and their emails');
  User.find(function(err, users) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    logger.info('all users and their emails were fetched successfully');
    res.json(users);
  });
};

exports.lmsGet = function(req, res) {
  logger.info('request list of LMs grouped by users');

  User.getLMList(function(err, lms) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(lms);
  });
};


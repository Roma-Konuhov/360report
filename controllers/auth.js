var HttpError = require('../lib/error').HttpError;
var User = require('../models/User');
var logger = require('../lib/logger')(module);
var config = require('../config');
var gApi = require('../models/GoogleApi');

exports.authorize = function(req, res, next) {
  gApi.approveAuth(req.query.code, function(err, oauth2Client) {
    if (err) {
      logger.error(err);
      return next(new HttpError(400, err.message));
    }
    res.redirect('/');
  });
};
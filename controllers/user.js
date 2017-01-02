var HttpError = require('../lib/error').HttpError;
var User = require('../models/User');
var logger = require('../lib/logger')(module);
var config = require('../config');
var mailer = require('./mailer');
var consultant = require('./consultant');
var manager = require('./manager');
var gApi = require('../models/GoogleApi');
var mongoose = require('../db');

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
  User.find({}, null, { sort: { name: 1 } }, function(err, users) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    logger.info('all users and their emails were fetched successfully');
    res.json(users);
  });
};

exports.lmsGet = function(req, res, next) {
  logger.info('request list of LMs grouped by users');

  User.getLMList(function(err, lms) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(lms);
  });
};

/**
 * Send email to LM with report for a specified subordinate
 *
 * @param req
 * @param res
 * @param next
 */
exports.emailRevieweeReportPost = function(req, res, next) {
  logger.info('send email with reviewes\'s report to its LM');

  var revieweeId = req.params.revieweeId;

  User.getLMForReviewee(revieweeId, function(err, lm) {
    if (err) {
      return next(new HttpError(400, err.message));
    }

    consultant.exportFile(revieweeId, 'pdf', res, function(err, consultantReport) {
      manager.exportFile(revieweeId, 'pdf', res, function(err, managerReport) {
        var reports = [consultantReport, managerReport];
        var attachments = [];
        reports.forEach(function(report) {
          if (report.status === 'ok') {
            attachments.push({
              filename: report.username + '.pdf',
              path: report.filepath
            });
          }
        });

        var html = `<p>Hello ${lm.name}</p>`;
        html += `<p>Below you can find reports for ${consultantReport.username}</p>`;

        mailer.send({
          to: lm.email,
          subject: '360 review reports',
          html: html,
          attachments: attachments
        }, function(err) {
          if (err) {
            return next(new HttpError(400, err.message));
          }
          res.json({message: `Email was sent to ${lm.name}`})
        });
      });
    });
  });
};

/**
 * Send email to LM with reports for all subordinates
 *
 * @param req
 * @param res
 * @param next
 */
exports.emailSubordinateReportsPost = function(req, res, next) {
  logger.info('send emails with reports for all subordinators to LM');

  var lmId = req.params.lmId;

  User.findById(lmId, function(err, lm) {
    if (err) {
      return next(new HttpError(400, err.message));
    }

    consultant.exportBulk(lmId, 'pdf', res, function(err, consultantResult, consultantReports) {
      manager.exportBulk(lmId, 'pdf', res, function(err, managerResult, managerReports) {
        var reports = consultantReports.concat(managerReports);
        var attachments = [];
        reports.forEach(function(report) {
          if (report.status === 'ok') {
            attachments.push({
              filename: report.username + '.pdf',
              path: report.filepath
            });
          }
        });

        var reviewees = reports.map(function(report) {
          if(report.status === 'ok') {
            return `<li>${report.username}</li>`;
          } else {
            return '';
          }
        }).join('');

        var html = `<p>Hello ${lm.name}</p>`;
        html += `<p>Below you can find reports for the following employees: <ol>${reviewees}</ol></p>`;

        mailer.send({
          to: lm.email,
          subject: '360 review reports',
          html: html,
          attachments: attachments
        }, function(err) {
          if (err) {
            return next(new HttpError(400, err.message));
          }
          res.json({message: `Email was sent to ${lm.name}`})
        });
      });
    });
  });
};

/**
 * Publish reviewee's report on Google drive to driectory with LM name
 *
 * @param req
 * @param res
 * @param next
 */
exports.publishRevieweeReportPost = function(req, res, next) {
  logger.info('publish reviewes\'s report to its LM on Google drive');

  var revieweeId = req.params.revieweeId;

  User.getLMForReviewee(revieweeId, function(err, lm) {
    if (err) {
      return next(new HttpError(400, err.message));
    }

    consultant.exportFile(revieweeId, 'pdf', res, function(err, consultantReport) {
      manager.exportFile(revieweeId, 'pdf', res, function(err, managerReport) {
        var reports = [consultantReport, managerReport];
        var reportDirectory = config.get('google:reportDirectory');

        gApi.createPath(`${reportDirectory}/${lm.name}`, function(err, directoryId) {
          if (err) {
            logger.error('Error during creating of the LM\'s directory: %s', err.message);
            return next(new HttpError(400, err.message));
          }

          reports.forEach(function(report) {
            if (report.status !== 'ok') {
              return;
            }
            const params = {
              srcFilepath: report.filepath,
              destFilename: report.username + '.pdf',
              destDirectory: directoryId
            };
            gApi.upload(params, function(err) {
              if (err) {
                logger.error('Error during publishing of the %s\'s report to LM directory "%s": %s', report.username, lm.name, err.message);
                return next(new HttpError(400, err.message));
              }
              logger.info('Publishing of the %s\'s report  to LM directory "%s" was completed successfully', report.username, lm.name);
              res.json({ message: 'Publishing was completed successfully' });
            });
          });
        });
      });
    });
  });
};

/**
 * Publish on Google drive reports of all subrdinates of the specified LM
 * to the directory with LM name
 *
 * Controller
 *
 * @param req
 * @param res
 * @param next
 */
exports.publishSubordinateReportsPost = function(req, res, next) {
  logger.info('publish reports for all subordinators of LM');

  var lmId = req.params.lmId;

  publishSubordinateReports(lmId, res, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json({ message: result });
  });
};

/**
 * Publish on Google drive reports of all subrdinates of the specified LM
 * to the directory with LM name
 *
 * @param lmId
 * @param res
 * @param cb
 */
function publishSubordinateReports(lmId, res, cb) {
  User.findById(lmId, function(err, lm) {
    if (err) {
      return next(new HttpError(400, err.message));
    }

    consultant.exportBulk(lmId, 'pdf', res, function(err, consultantResult, consultantReports) {
      manager.exportBulk(lmId, 'pdf', res, function(err, managerResult, managerReports) {
        var reports = consultantReports.concat(managerReports);
        var validReports = reports.filter(function(report) { return report.status === 'ok' });
        var successMessages = [];
        var errors = [];
        var reportDirectory = config.get('google:reportDirectory');

        gApi.createPath(`${reportDirectory}/${lm.name}`, function(err, directoryId) {
          if (err) {
            logger.error('Error during creating of the LM\'s directory: %s', err.message);
            return cb(err);
          }

          var processCounter = 0;
          validReports.forEach(function(report) {
            const params = {
              srcFilepath: report.filepath,
              destFilename: report.username + '.pdf',
              destDirectory: directoryId
            };
            gApi.upload(params, function(err) {
              if (err) {
                logger.error('Error during publishing of the %s\'s report to LM directory "%s": %s', report.username, lm.name, err.message);
                errors.push(`Error during publishing of the report of ${report.username}: ${err.message}`);
              } else {
                logger.info('Publishing of the %s\'s report  to LM directory "%s" was completed successfully', report.username, lm.name);
                successMessages.push(`Publishing of the report of ${report.username} was completed successfully`);
              }
              if (++processCounter === validReports.length) {
                if (errors.length) {
                  return cb({ message: errors });
                }
                cb(null, successMessages);
              }
            });
          });
        });
      });
    });
  });
}

/**
 * Publish on Google drive reports of all subrdinates of the specified LM
 * to the directory with LM name
 *
 * @param req
 * @param res
 * @param next
 */
exports.publishAllReportsPost = function(req, res, next) {
  logger.info('publish reports for all subordinators of all LMs');

  var errors = [];
  var successMessages = [];

  User.getLMList(function(err, lms) {
    if (err) {
      return next(new HttpError(400, err.message));
    }

    lms.forEach(function(lm, idx) {
      publishSubordinateReports(lm.data._id, res, function(err, result) {
        if (err) {
          errors = errors.concat(err.message);
        } else {
          successMessages.concat(result);
        }

        if (idx === lms.length - 1) {
          if (errors.length) {
            return next(new HttpError(400, errors));
          }
          res.json({ message: successMessages });
        }
      });
    });
  });
};


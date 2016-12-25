var HttpError = require('../lib/error').HttpError;
var User = require('../models/User');
var logger = require('../lib/logger')(module);
var mailer = require('./mailer');
var consultant = require('./consultant');
var manager = require('./manager');

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
          to: 'rkonuhov@cogniance.com',  // lm.email
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
          to: 'rkonuhov@cogniance.com',
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


var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var os = require('os');
var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
var Export = require('../models/Export');

var ReactDOM = require('react-dom/server');
var React = require('react');
var Provider = require('react-redux').Provider;
var App = require('../app/components/App');
var configureStore = require('../app/store/configureStore').default;
var Router = require('react-router');
var routes = require('../app/routes');

var EXPORT_DIR = os.tmpdir();

exports.exportFile = function(res, reportConfig, cb) {
  var revieweeId = reportConfig.user._id;
  var exportFormat = reportConfig.format;
  var htmlFilepath = './public/' + (+new Date()) + '.html';

  logger.info('Exporting of the report to format %s for user with ID %s', exportFormat, revieweeId);

  if (isReportEmpty(reportConfig.answers)) {
    const message = `Report for ${reportConfig.uriPrefix} ${reportConfig.user.name} is empty`;
    logger.info(message);
    return cb(null, { status: 'empty', message: message });
  }

  var store = configureStore({
    report: {
      answers: reportConfig.answers,
      statistics: reportConfig.statistics,
      user: reportConfig.user
    }
  });

  var uri = [
    reportConfig.uriPrefix,
    'report',
    revieweeId
  ].join('/');
  uri = '/' + uri;

  Router.match({ routes: routes.default(store), location: uri }, function(err, redirectLocation, renderProps) {
    if (err) {
      logger.error('Exporting has failed: %s', err.message);
      return cb(err);
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
        React.createElement(Router.RouterContext, renderProps)
      ));
      res.render('export', {
        html: html,
        initialState: store.getState()
      }, function(err, page) {
        fs.writeFile(htmlFilepath, page, function(err) {
          if (err) {
            fs.unlink(htmlFilepath);
            return cb(err);
          } else {
            Export.exportFile(htmlFilepath, EXPORT_DIR, exportFormat, function(err, result) {
              logger.info('HTML file was saved to "%s"', result.filepath);
              fs.unlink(htmlFilepath, function(err) {
                if (err) {
                  logger.error(err);
                }
              });
              var message = {
                status: 'ok',
                filename: result.filename,
                filepath: result.filepath,
                username: reportConfig.user.name,
                message: `Report for ${reportConfig.uriPrefix} ${reportConfig.user.name} was exported successfully`,
              };
              return cb(null, message);
            });
          }
        });
      });
    } else {
      logger.error('Document not found or renderProps are incorrect');
      return cb({status: 'fail', message: 'Document not found or renderProps are incorrect'})
    }
  });
};

/**
 * Adds headers to download file on the client
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.exportGet = function(req, res, next) {
  logger.info('Requested filename to download on the client machine "%s"', req.params.filename);
  var filepath = EXPORT_DIR + '/' + req.params.filename;

  if (fs.existsSync(filepath)) {
    // res.setHeader('Content-Type', 'application/octet-stream');
    // res.setHeader('Content-Disposition', 'attachment; filename=' + filepath);
    // var filestream = fs.createReadStream(filepath);
    // filestream.pipe(res);
    res.download(filepath, req.params.filename);
  } else {
    return next(new HttpError(404, 'File not found'));
  }
};

/**
 * The method passes through property "answers" of the passed argument.
 * If all answers contain 0 then such report is considered as empty
 *
 * @param {Array}
 * [
 *  {
 *    text: <question in text form>
 *    relationLabels: ['Self-evaluation', 'Manager', 'Line manager', 'Peer', 'Direct report'],
 *    answerLabels: ['Don`t know', 'Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
 *    answers: [ 5, 1, 0, 3, 6 ],
 *    avgAnswers: [2.5, 0.5, 0, 1.5, 3],
 *    respondersNumber: [1, 3, 2, 5, 1]
 *  },
 *  ...
 * ]
 * @return {Boolean}
 */
var isReportEmpty = function(answers) {
  return !answers.filter(function(answer) {
    return _.some(answer.answers);
  }).length;
};
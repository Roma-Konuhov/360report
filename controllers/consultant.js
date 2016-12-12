var _ = require('lodash');
var fs = require('fs');
var logger = require('../lib/logger')(module);
var HttpError = require('../lib/error').HttpError;
var async = require('async');
var ConsultantReport = require('../models/ConsultantReport');
var User = require('../models/User');
var ReactDOM = require('react-dom/server');
var React = require('react');
var App = require('../app/components/App');

exports.revieweesGet = function(req, res, next) {
  return async.waterfall([
    function(cb) {
      ConsultantReport.getReviewees(function(err, data) {
        cb(null, data);
      });
    },
    function(reviewees, cb) {
      User.find({}, function(err, users) {
        var result = [], item;
        if (!_.isEmpty(users)) {
          for (var i in reviewees) {
            item = _.clone(reviewees[i]);
            item.id = _.find(users, {name: reviewees[i].username}).get('id');
            result.push(item);
          }
        }
        cb(null, result);
      });
    }
    ], function(err, result) {
      if (err) {
        return next(new HttpError(400, err.message));
      }
      res.json(result);
  });
};

exports.reportGet = function(req, res, next) {
  return async.waterfall([
    ConsultantReport.getReport.bind(null, req.params.id),
    //ConsultantReport.addQuestionText,
    //ConsultantReport.addRelationStr,
    ConsultantReport.regroupBySeries
  ], function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result);
  });
};

exports.statisticsGet = function(req, res, next) {
  ConsultantReport.getStatistics(req.params.id, function(err, result) {
    if (err) {
      return next(new HttpError(400, err.message));
    }
    res.json(result)
  });
};


exports.exportFilePost = function(req, res) {
  var configureStore = require('../app/store/configureStore').default;
  var Provider = require('react-redux').Provider;
  var Router = require('react-router');
  var routes = require('../app/routes');
  var Export = require('../models/Export');
  var id = req.params.id;
  var exportFormat = req.params.format;
  var htmlFilepath = './public/export.html';

  logger.info('Exporting of the report to format %s for user with ID %s', exportFormat, id);
  async.waterfall([
    ConsultantReport.getReport.bind(null, id),
    ConsultantReport.regroupBySeries
  ], function(err, answers) {
    ConsultantReport.getStatistics(id, function(err, statistics) {
      User.findById(id, function(err, user) {
        var store = configureStore({
          report: {
            answers:answers,
            statistics: statistics,
            user: user
          }
        });

        Router.match({ routes: routes.default(store), location: '/consultant/report/'+req.params.id }, function(err, redirectLocation, renderProps) {
          if (err) {
            res.render('error',{error:{message:err.message}});
          } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
              React.createElement(Router.RouterContext, renderProps)
            ));
            res.render('export', {
              html: html,
              initialState: store.getState()
            }, function(err, page) {
              fs.writeFile(htmlFilepath, page, function(err, result) {
                if (err) {
                  logger.error(err);
                } else {
                  Export.exportFile(htmlFilepath, exportFormat, function(err, filepath) {
                    logger.info('HTML file was saved to "%s"', filepath);
                    return res.json({message: 'File was exported successfully'});
                  });
                }
              });
            });
          } else {
            logger.error('Exporting has failed');
            res.render('error',{error:{message:'Not found'}});
          }
        });
      });
    });
  });
};
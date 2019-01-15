var express = require('express');
var path = require('path');
var http = require('http');
var requestLogger = require('morgan');
var logger = require('./lib/logger')(module);
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var Provider = require('react-redux').Provider;
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var less = require('less-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var config = require('./config');
var sendHttpError = require('./middleware/sendHttpError');
var HttpError = require('./lib/error').HttpError;
var errorHandler = require('errorhandler');

// ES6 Transpiler
require('babel-core/register');
require('babel-polyfill');

var app = express();
var compiler = webpack(webpackConfig);

if (app.get('env') === 'development') {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    silent: true,
    stats: 'errors-only',
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }));
}

// Is used to check DB connection on bootstrap stage
require('./db');

// Models
var User = require('./models/User');

// React and Server-Side Rendering
var routes = require('./app/routes');
var configureStore = require('./app/store/configureStore').default;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compression());
app.use(less(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
require('./routes')(app);

// React server rendering
app.use(function(req, res) {
  var initialState = {
    auth: { token: req.cookies.token, user: req.user },
    messages: {}
  };

  var store = configureStore(initialState);

  Router.match({ routes: routes.default(store), location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
        React.createElement(Router.RouterContext, renderProps)
      ));
      res.render('layout', {
        html: html,
        initialState: store.getState()
      });
    } else {
      res.sendStatus(404);
    }
  });
});

if (app.get('env') === 'development') {
  app.use(requestLogger('dev'));
}

// Error handler
app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    sendHttpError(res, err);
  } else {
    if ('development' === app.get('env')) {
      errorHandler()(err, req, res, next);
    } else {
      logger.error(err);
      err = new HttpError(500);
      sendHttpError(res, err);
    }
  }
});

process.on('uncaughtException', (err) => {
  logger.error(err);
});

app.listen(config.get('port'), function() {
  console.log('Express server listening on port ' + config.get('port'));
});

module.exports = app;

// some info

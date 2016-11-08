var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;
var config = require('../config');
var fs = require('fs');

module.exports = function(module) {
  var _path = path.basename(module.filename);
  var transports = [];
  var formatter = function(opt) {
    var options = [
      new Date().toLocaleString(),
      opt.level.toUpperCase(),
      opt.message
    ];

    return options.join(' : ');
  };

  if (ENV == 'development') {
    if (!fs.existsSync(config.get('logger:file:info'))) {
      var file = fs.openSync(config.get('logger:file:info'), 'w');
      fs.closeSync(file);
    }
    transports = [
      new winston.transports.Console({
        colorize: true,
        level: 'debug',
        label: _path,
      }),
      new winston.transports.File({
        filename: config.get('logger:file:info'),
        level: 'info',
        formatter: formatter
      }),
    ];
  } else {
    if (!fs.existsSync(config.get('logger:file:debug'))) {
      var file = fs.openSync(config.get('logger:file:debug'), 'w');
      fs.closeSync(file);
    }
    transports = [
      new winston.transports.File({
        filename: config.get('logger:file:debug'),
        level: 'error',
        formatter: formatter
      }),
    ];
  }

  return new winston.Logger({
    transports: transports
  });
};


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
      transports = [
        new winston.transports.Console({
          colorize: true,
          level: 'debug',
          label: _path,
        })
      ];
  } else {
    if (!fs.existsSync(config.get('logger:file'))) {
      var file = fs.openSync(config.get('logger:file'), 'w');
      fs.closeSync(file);
    }
    transports = [
      new winston.transports.File({
        filename: config.get('logger:file'),
        level: 'error',
        formatter: formatter
      }),
    ];
  }

  return new winston.Logger({
    transports: transports
  });
};


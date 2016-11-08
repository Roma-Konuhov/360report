var csv = require('csv-parser');
var fs = require('fs');
var _ = require('lodash');

var CSV_TO_DB_MAP = {};
var filterFn = _.identity;

module.exports.setCsvToDbMap = function(map) {
  var result = {};
  for (var key in map) {
    result[key.toLowerCase()] = map[key];
  }
  CSV_TO_DB_MAP = result;
};

module.exports.setFilter = function(filter) {
  filterFn = filter;
};

module.exports.parse = function (filename, cb) {
  var trimRegexp = /^[\s\W]+|[\s\W]+$/g;
  var collection = [];

  fs.createReadStream(filename).pipe(csv())
    .on('data', function(data) {
      var row = {};
      for (var fieldName in data) {
        var cleanFieldName = fieldName.replace(trimRegexp, '').toLowerCase();
        if (CSV_TO_DB_MAP[cleanFieldName]) {
          row[CSV_TO_DB_MAP[cleanFieldName]] = data[fieldName].replace(trimRegexp, '') || '';
        }
      }
      collection.push(row);
    })
    .on('end', function() {
      cb(null, _.filter(collection, filterFn));
    });
};


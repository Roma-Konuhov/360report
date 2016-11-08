var csv = require('csv-parser');
var fs = require('fs');
var _ = require('lodash');

var MAP_CSV_TO_DB = {};

module.exports.setMapCsvToDb = function(map) {
  MAP_CSV_TO_DB = map;
};

module.exports.parse = function (filename, cb) {
  var trimRegexp = /^[\s\W]+|[\s\W]+$/g;
  var collection = [];

  fs.createReadStream(filename).pipe(csv())
    .on('data', function(data) {
      var row = {};
      for (var fieldName in data) {
        var cleanFieldName = fieldName.replace(trimRegexp, '');
        if (MAP_CSV_TO_DB[cleanFieldName]) {
          row[MAP_CSV_TO_DB[cleanFieldName]] = data[fieldName].replace(trimRegexp, '') || '';
        }
      }
      collection.push(row);
    })
    .on('end', function() {
      cb(null, _.filter(collection, function(row) {
        return row.username && row.reviewee;
      }));
    });
};


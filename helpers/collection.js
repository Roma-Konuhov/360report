var _ = require('lodash');

exports.uniqueBy = function(arr, field) {
  var buffer = [];
  var result = [];

  for (var i in arr) {
    if (buffer[arr[i][field]]) {
      continue;
    }
    buffer[arr[i][field]] = true;
    result.push(_.clone(arr[i]));
  }

  return result;
};
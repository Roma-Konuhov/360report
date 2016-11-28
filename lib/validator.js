var validator = require('joi');

var parseError = function(err, data) {
  // get keys from first object of the data array,
  // since they all are similar
  var dataKeys = Object.keys(data[0]);

  return err.map(function(_err) {
    var pathParts = _err.path.split('.');
    var path = '';
    if (pathParts) {
      var row = parseInt(pathParts[0], 10) + 2;         // 2 = 1 row for header + 1 row for index
      var column = dataKeys.indexOf(pathParts[1]) + 1;  // 1 = 1 row for index
      path = ` at row ${row}, column ${column}`;
    }

    return {
      message: `${_err.message}${path}`
    }
  });
};

var validate = function(data, validationRules, cb) {
  var validationSchema = validator.array().items(validator.object().keys(validationRules));

  validator.validate(data, validationSchema, { abortEarly: false }, function(err) {
    if (err) {
      err.details && cb(parseError(err.details, data)) || cb(err);
    } else {
      cb(null, data);
    }
  });
};

exports.validate = validate;
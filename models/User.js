var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('../db');
var CsvParser = require('./CsvParser');
var userSchema = require('../db/schema').userSchema;
var logger = require('../lib/logger')(module);
var validator = require('../lib/validator');
var validRule = require('joi');
var isEmpty = require('lodash/isEmpty');

var CSV_TO_DB_MAP = {
  'Name': 'name',
  'Email': 'email',
  'LM': 'lm_name',
  'Email of LM': 'lm_email',
};
var EMAIL_DOMAIN = 'cogniance.com';

var collectionName = 'users';

var validationRules = {
  'name': validRule.string().required(),
  'email': validRule.string().required(),
  'lm_name': validRule.string().required(),
  'lm_email': validRule.string().required(),
};

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.statics.generateEmailByFullname = function(fullname) {
  var trimRegexp = /^[\s\W]+|[\s\W]+$/g;
  var fullnameParts = fullname.replace(trimRegexp, '').split(/\s+/);
  var firstName = fullnameParts[0] && fullnameParts[0].toLowerCase();
  var lastName = fullnameParts[1] && fullnameParts[1].toLowerCase();

  return firstName.charAt(0) + lastName + '@' + EMAIL_DOMAIN;
};

userSchema.statics.dropCollection = function(cb) {
  mongoose.connection.db.dropCollection(collectionName, function() {
    logger.info('Collection "%s" was dropped', collectionName);
  });
  cb(null);
};

userSchema.statics.validate = function(data, cb) {
  validator.validate(data, validationRules, cb);
};

userSchema.statics.parse = function(filename, cb) {
  CsvParser.setCsvToDbMap(CSV_TO_DB_MAP);
  CsvParser.setFilter(function(row) {
    return row.name;
  });
  CsvParser.parse(filename, function(err, data) {
    if (err) {
      logger.error(err);
    }
    logger.info('Data from file "%s" was parsed: %j', filename, data);
    cb(err, data);
  });
};

userSchema.statics.saveCollection = function(data, cb) {
  var collection = [];

  if (isEmpty(data)) {
    cb('Data are corrupted')
  }

  data.forEach(function(row, idx) {
    var user = new User(row);
    user.save(function(err, instance) {
      if (err) {
        cb(err, null);
      } else {
        collection.push(instance);
      }
      if (data.length === idx + 1) {
        cb(null, collection);
      }
    });
  });
};

userSchema.statics.getLMList = function(cb) {
  logger.info('Query to get list of all LMs');
  User.aggregate([
    { '$lookup': {
      from: 'users',
      localField: 'lm_email',
      foreignField: 'email',
      as: 'data'
    }},
    { '$unwind': '$data' },
    { '$group': {
      _id: '$lm_email',
      name: { $first: '$lm_name' },
      email: { $first: '$lm_email' },
      data: { $first: '$data'},
      subordinate_number: { $sum: 1 },
      subordinate_ids: { $push: '$_id' },
      subordinate_names: { $push: '$name' }}
    },
    { $sort: { _id: 1 }}
  ], function(err, data) {
    if (err) {
      logger.error(err);
      return cb(err);
    }
    logger.info('List of all LMs was retrieved successfully %j', data);
    cb(null, data);
  });
};


var User = mongoose.model('User', userSchema);

module.exports = User;

/**
 * Collection which contains reviewees
 */

var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('../db');
var userSchema = require('../db/schema').userSchema;

var EMAIL_DOMAIN = 'cogniance.com';

userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};

userSchema.statics.generateEmailByFullname = function(fullname) {
  var trimRegexp = /^[\s\W]+|[\s\W]+$/g;
  var fullnameParts = fullname.replace(trimRegexp, '').split(/\s+/);
  var firstName = fullnameParts[0].toLowerCase();
  var lastName = fullnameParts[1].toLowerCase();

  return firstName.charAt(0) + lastName + '@' + EMAIL_DOMAIN;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

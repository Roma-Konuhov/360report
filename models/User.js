var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('../db');
var userSchema = require('../db/schema').userSchema;


userSchema.methods.comparePassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};


var User = mongoose.model('User', userSchema);

module.exports = User;

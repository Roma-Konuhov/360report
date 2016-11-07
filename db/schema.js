var mongoose = require('mongoose');

var options = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

exports.userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true},
}, options);

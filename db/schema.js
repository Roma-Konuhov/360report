var mongoose = require('./index');
var consultantQuestions = require('../config/data').consultantQuestions;
var managerQeustions = require('../config/data').managerQeustions;

var options = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

exports.userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
}, options);



var reviewFields = {
  timestamp: Date,
  username: { type: String, required: true },
  reviewee: { type: String, required: true },
  allow_to_share: { type: Boolean, default: false }
};

var questionFields = {};
for (var i = 1; i <= consultantQuestions.length; i++) {
  questionFields['q' + i] = { type: Number, min: 0, max: 4 };
}

var fields = Object.assign({}, reviewFields, questionFields);
exports.consultantReportSchema = new mongoose.Schema(fields, { collection: 'consultant_reports' });

var questionFields = {};
for (var i = 1; i <= managerQeustions.length; i++) {
  questionFields['q' + i] = { type: Number, min: 0, max: 4 };
}

var fields = Object.assign({}, reviewFields, questionFields);
exports.managerReportSchema = new mongoose.Schema(fields, { collection: 'manager_reports' });

exports.consultantQuestionSchema = new mongoose.Schema({
  q: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { collection: 'consultant_questions' });

exports.managerQuestionSchema = new mongoose.Schema({
  q: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { collection: 'manager_questions' });

exports.relationshipSchema = new mongoose.Schema({
  reviewee: {
    type: String,
    required: true
  },
  responder: {
    type: String,
    required: true
  },
  relation: {  // responder is X(LM, peer, self-evaluation, manager, direct report) for reviewee
    type: Number,
    required: true
  }
});

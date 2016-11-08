var mongoose = require('../db');
var consultantReportSchema = require('../db/schema').consultantReportSchema;
var ReportParser = require('./ReportParser');
var validator = require('validator');
var logger = require('../lib/logger')(module);
var answers = require('../config/data').answers;
var questions = require('../config/data').consultantQuestions;
var _ = require('lodash');

var CSV_TO_DB_MAP = {
  'Timestamp': 'timestamp',
  'Username': 'username',
  'Evaluation is for': 'reviewee',
  'Share my name': 'allow_to_share'
};

questions.forEach(function(question, idx) {
  CSV_TO_DB_MAP[question] = 'q' + (1 + idx);
});

var validationSchema = {

};

var collectionName = 'consultant_reports';

consultantReportSchema.statics.dropCollection = function(cb) {
  mongoose.connection.db.dropCollection(collectionName, function() {
    logger.info('Collection was dropped');
  });
  cb(null);
};

consultantReportSchema.statics.mapAnswersTextToNum = function() {
  var lcAnswers = _.map(answers, function(answer) { return answer.toLowerCase() });
  return _.zipObject(lcAnswers, _.range(5));
};

consultantReportSchema.statics.mapAnswersNumToText = function() {
  var lcAnswers = _.map(answers, function(answer) { return answer.toLowerCase() });
  return _.zipObject(_.range(5), lcAnswers);
};

consultantReportSchema.statics.validate = function(data, cb) {
  cb(null, data);
};

consultantReportSchema.statics.parse = function(filename, cb) {
  ReportParser.setMapCsvToDb(CSV_TO_DB_MAP);
  ReportParser.parse(filename, function(err, data) {
    if (err) {
      logger.error(err);
    }
    logger.info('Data from file "%s" was parsed: %j', filename, data);
    cb(err, data);
  });
};

consultantReportSchema.statics.castQuestionAnswers = function(data, cb) {
  var answersTextToNumMap = ConsultantReport.mapAnswersTextToNum();
  var collection = [];
  var lcValue;

  data.forEach(function(row) {
    var result = {};
    for (var key in row) {
      if (key.search(/^q\d{1,2}$/) !== -1) {
        lcValue = row[key].toLowerCase();
        result[key] = answersTextToNumMap[lcValue];
      } else {
        result[key] = row[key];
      }
    }
    collection.push(result);
  });
  logger.info('Values for fields like "qN" were converted to integer according map');

  cb(null, collection);
};

consultantReportSchema.statics.saveCollection = function(data, cb) {
  var collection = [];

  data.forEach(function(row, idx) {
    var report = new ConsultantReport(row);
    report.save(function(err, instance) {
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

var ConsultantReport = mongoose.model('ConsultantReport', consultantReportSchema);

module.exports = ConsultantReport;

var mongoose = require('../db');
var consultantReportSchema = require('../db/schema').consultantReportSchema;
var ReportParser = require('./ReportParser');
var validator = require('validator');
var logger = require('../lib/logger')(module);
var answers = require('../config/data').answers;
var _ = require('lodash');

var MAP_CSV_TO_DB = {
  'Timestamp': 'timestamp',
  'Username': 'username',
  'Evaluation is for': 'reviewee',
  'Share my name': 'allow_to_share',
  'Is always ready to help others': 'q1',
  'Willingly shares useful knowledge': 'q2',
  'Expresses opinion openly and honestly': 'q3',
  'Thinks constructively to find solution': 'q4',
  'Treats people equally and with respect': 'q5',
  'Goes extra mile to get things done': 'q6',
  'Meets commitments and expectations': 'q7',
  'Takes responsibility for decisions and actions': 'q8',
  'Identifies and meets customers needs': 'q9',
  'Responds to customers requests promptly': 'q10',
  'Ensures that customers issues are resolved': 'q11',
  'Demonstrates strong professional skills & knowledge': 'q12',
  'I would recommend this person to work with': 'q13',
  'I suggest you to': 'q14',
  'I appreciate you for': 'q15'
};

var validationSchema = {

};

consultantReportSchema.statics.mapAnswersTextToNum = function() {
  return _.zipObject(answers, _.range(5));
};

consultantReportSchema.statics.mapAnswersNumToText = function() {
  return _.zipObject(_.range(5), answers);
};

consultantReportSchema.statics.validate = function(data, cb) {
  cb(null, data);
};

consultantReportSchema.statics.parse = function(filename, cb) {
  logger.info('parse data from file %s', filename);
  ReportParser.setMapCsvToDb(MAP_CSV_TO_DB);
  ReportParser.parse(filename, function(err, data) {
    if (err) {
      logger.error(err);
    }
    logger.info('parsed data: %j', data);
    cb(err, data);
  });
};

consultantReportSchema.statics.castQuestionAnswers = function(data, cb) {
  logger.info('castQuestionAnswers data %j', data);
  var answersTextToNumMap = ConsultantReport.mapAnswersTextToNum();
  var collection = [];

  data.forEach(function(row) {
    var result = {};
    for (var key in row) {
      if (key.search(/^q\d{1,2}$/)) {
        result[key] = answersTextToNumMap[row[key]];
      } else {
        result[key] = row[key];
      }
    }
    collection.push(result);
  });
  logger.info('casted: %j', collection);

  cb(null, collection);
};

consultantReportSchema.statics.save = function(data, cb) {
  logger.info('before save %j', data);
  var collection = [];
  logger.info('data', data);
  data.forEach(function(row) {
    var report = new ConsultantReport(row);
    report.save(function(err, instance) {
      if (err) {
        cb(err, null);
      } else {
        collection.push(instance);
      }
    });
  });
  cb(null, collection);
};

var ConsultantReport = mongoose.model('ConsultantReport', consultantReportSchema);

module.exports = ConsultantReport;

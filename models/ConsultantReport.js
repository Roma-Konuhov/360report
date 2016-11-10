var mongoose = require('../db');
var async = require('async');
var consultantReportSchema = require('../db/schema').consultantReportSchema;
var CsvParser = require('./CsvParser');
var validator = require('validator');
var logger = require('../lib/logger')(module);
var answers = require('../config/data').answers;
var questions = require('../config/data').consultantQuestions;
var _ = require('lodash');
var User = require('./User');
var uniqueBy = require('../helpers/collection').uniqueBy;

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
    logger.info('Collection "%s" was dropped', collectionName);
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
  CsvParser.setCsvToDbMap(CSV_TO_DB_MAP);
  CsvParser.setFilter(function(row) {
    return row.username && row.reviewee;
  });
  CsvParser.parse(filename, function(err, data) {
    if (err) {
      logger.error(err);
    }
    logger.info('Data from file "%s" was parsed: %j', filename, data);
    cb(err, data);
  });
};

consultantReportSchema.statics.castAnswers = function(data, cb) {
  /* TODO: check possibility to replace ConsultantReport with 'this' */
  var answersTextToNumMap = ConsultantReport.mapAnswersTextToNum();
  var collection = [];
  var lcValue;

  data.forEach(function(row) {
    var result = {};
    for (var key in row) {
      // convert questions(fields with name qN) to its integer representation
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
  var reportCollection = [];
  var userCollection = [];

  data.forEach(function(row, idx) {
    var report = new ConsultantReport(row);
    var email = User.generateEmailByFullname(row.reviewee);

    async.waterfall([
      function(cb) {
        report.save(function(err, instance) {
          if (err) return cb(err);
          logger.info('push')
          reportCollection.push(instance);
          cb(null);
        });
      },
      function(cb) {
        User.find({email: email}, function(err, user) {
          if (err) return cb(err);
          cb(null, user);
        });
      },
      function(found, cb) {
        logger.info('inside %d', found.length);
        if (!found.length) {
          userCollection.push({
            name: row.reviewee,
            email: email
          });
        }
        cb(null, null);
      }
    ], function(err, result) {
      if (err) {
        logger.error(err.errmsg);
      }
      if (data.length === idx + 1) {
        var uniqueUserCollection = uniqueBy(userCollection, 'email');
        var userSaveCalls = [];
        uniqueUserCollection.forEach(function(userParams) {
          userSaveCalls.push(function(_cb) {
            new User(userParams).save(function(err, user) {
              if (err) {
                logger.warn(err.errmsg);
                return _cb(null, null);
              }
              _cb(null, user);
            });
          })
        });
        async.series(userSaveCalls, function(err) {
          if (err) {
            logger.error(err.errmsg);
            return cb(err);
          }
          logger.info('Users were saved to database');
          cb(null, reportCollection);
        });
      }
    });
  });
};


consultantReportSchema.statics.getReviewees = function(cb) {
  return this.aggregate([
    { $group: { _id: "$reviewee", responders_number: { $sum: 1 } }},
    { $project: { username: "$_id", responders_number: "$responders_number" } }
  ], function(err, data) {
    if (err) {
      logger.error(err);
      return cb(err, null);
    }
    logger.info('List of reviewees performed by consultant was fetched successfully');
    cb(null, data);
  });
};


var ConsultantReport = mongoose.model('ConsultantReport', consultantReportSchema);

module.exports = ConsultantReport;

/*
* async.waterfall([
 function(cb) {
 report.save(function(err, instance) {
 if (err) return cb(err);
 logger.info('push')
 collection.push(instance);
 cb(null);
 });
 },
 function(cb) {
 User.find({email: email}, function(err, user) {
 if (err) return cb(err);
 cb(null, user);
 });
 },
 function(found, cb) {
 logger.info('inside %d', found.length);
 if (!found.length) {
 new User({
 name: row.reviewee,
 email: email
 }).save(function(err, user) {
 if (err) {
 logger.warn(err.errmsg);
 return cb(err);
 }
 logger.info('saved from inside %s', user.name);
 cb(null, user);
 });
 } else {
 cb(null, null);
 }
 }
 ], function(err, result) {
 if (err) {
 logger.error(err.errmsg);
 }
 if (data.length === idx + 1) {
 cb(null, collection);
 }
 });
* */
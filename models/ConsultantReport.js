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
var Relation = require('./Relation');
var uniqueBy = require('../helpers/collection').uniqueBy;

var CSV_TO_DB_MAP = {
  'Timestamp': 'timestamp',
  'Username': 'responder',
  'Evaluation is for': 'reviewee',
  'Share my name': 'allow_to_share'
};

var AVG_DECIMAL_PRECISION = 2;

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
    return row.responder && row.reviewee;
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

consultantReportSchema.methods.addResponderRevieweeRelation = function(report, cb) {
  return Relation.find({ reviewee: report.reviewee, responderEmail: report.responder }, function(err, instance) {
    if (err) return cb(err, null);
    report.relation = instance.relation;
    cb(null, report);
  });
};

consultantReportSchema.statics.saveCollection = function(data, cb) {
  var reportCollection = [];
  var userCollection = [];

  data.forEach(function(row, idx) {
    var report = new ConsultantReport(row);
    var email = User.generateEmailByFullname(row.reviewee);

    async.waterfall([
      function(cb) {
        Relation.findOne({ reviewee: row.reviewee, responderEmail: row.responder }, function(err, instance) {
          if (err) return cb(err, null);
          if (instance) {
            report.relation = instance.relation;
          }
          cb(null, report);
        });
      },
      function(report, cb) {
        report.save(function(err, instance) {
          logger.info('report', instance.toObject());
          if (err) return cb(err);
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

/**
 * Get all unique reviewees from the consultant_report table
 *
 * @param cb
 * @returns {Promise}
 */
consultantReportSchema.statics.getReviewees = function(cb) {
  logger.info('Request for list of all reviewees');

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

/**
 * Returns report in format
 * [
 *  {
 *    _.id: { relation: <int> },
 *    responders: [<string>, <string>, ...],    // list of responders
 *    answer1: [
 *      {
 *        answer: <int>,                        // answer per responder
 *        responder: <string>
 *      },
 *      ...
 *    ],
 *    ...
 *    q1: {
 *      answer: <int>                           // summary answer per responders with the same role
 *      text: <string>                          // question label
 *    },
 *    ...
 *  }
 * ...
 * ]
 *
 * @param {Number} id
 * @param {Function} cb
 */
consultantReportSchema.statics.getReport = function(id, cb) {
  logger.info('Request for report for reviewee with ID "%s"', id);

  var groupQuery = {
    $group: {
      _id: {relation: '$relation'},
      num_of_responders: {$sum: 1},
      responders: {$push: "$responder"}
    }
  };

  for (var i = 1; i <= questions.length; i++) {
    groupQuery['$group']['q' + i] = {$sum: '$q' + i};
    groupQuery['$group']['answers' + i] = {$push: {answer: '$q' + i, responder: "$responder"}};
  }

  ConsultantReport.aggregate([
    {$lookup: {from:'users',localField:'reviewee',foreignField:'name',as:'joined_reviewee'}},
    {$match:{'joined_reviewee._id': mongoose.Types.ObjectId(id)}},
    groupQuery,
    {$sort: {'_id.relation': 1}}
  ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('Aggregated query to get answers grouped by responders roles was completed successfully');
      cb(null, data);
    });
};

/**
 * Adds full text for question subfields. I.e. this method
 * converts question subfield from
 * { q1: 2 }
 * to
 * { q1: {question: <FullQuestionText>, value: 2 }}
 *
 * @param {Object} reports
 * @param {Function} cb
 */
consultantReportSchema.statics.addQuestionText = function(reports, cb) {
  logger.info('Adds full text for question subfields, i.e. convert from { q1: 2 } to { q1: {question: FullQuestionText, value: 2 }}');

  var ConsultantQuestion = require('./ConsultantQuestion');
  ConsultantQuestion.find({}, function(err, questions) {
    if (err) {
      logger.error(err);
      return cb(err, null);
    }
    reports.forEach(function(report) {
      questions.forEach(function(question) {
        var answer = report[question.q];
        report[question.q] = {
          text: question.text,
          answer: answer
        }
      });
    });
    logger.info('Question\'s full text was added successfully');
    cb(null, reports);
  });
};

/**
 * Adds additional field "relationStr" which contains text representation of the relation
 *
 * @param {Object} reports
 * @param {Function} cb
 */
consultantReportSchema.statics.addRelationStr = function(reports, cb) {
  logger.info('Add field "relationStr" which contains text representations of the relation');

  var relations = Relation.mapRelationsNumToText();

  reports.forEach(function(report) {
    report.relationStr = relations[report._id.relation];
  });
  logger.info('The field "relationStr" was added successfully');
  cb(null, reports);
};

/**
 * Input data is grouped by responders. This method regroups data by questions.
 * Output:
 * [
 *  {
 *    text: <question in text form>
 *    [
 *      relation: {
   *      name: 'Line manager',
   *      num_of_responders: 2,
   *      sum_answer: 5,
   *      answers: [{responder: 'auser@cogn.com', answer: 1}, {responder: 'buser@cogn.com', answer: 4}]
   *
   *    },
 *    ...
 *    ]
 *  },
 *  ...
 * ]
 *
 * @param {Object} reports
 * @param {Function} cb
 */
consultantReportSchema.statics.regroupByQuestions = function(reports, cb) {
};

/**
 * Input data is grouped by responders. This method regroups data by series.
 * Output:
 * [
 *  {
 *    text: <question in text form>
 *    relationLabels: ['Self-evaluation', 'Manager', 'Line manager', 'Peer', 'Direct report'],
 *    answerLabels: ['Don`t know', 'Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
 *    answers: [ 5, 1, 0, 3, 6 ],
 *    avgAnswers: [2.5, 0.5, 0, 1.5, 3]
 *  },
 *  ...
 * ]
 *
 * @param {Object} reports
 * @param {Function} cb
 */
consultantReportSchema.statics.regroupBySeries = function(reports, cb) {
  logger.info('Regrouping data by series');

  var relationLabels = Object.values(Relation.mapRelationsNumToText());
  var answerLabels = Object.values(ConsultantReport.mapAnswersNumToText());
  var ConsultantQuestion = require('./ConsultantQuestion');
  var result = [];
  var qObject = {};

  ConsultantQuestion.find({}, function(err, questions) {
    questions.forEach(function(question) {
      var sumAnswer = 0;
      var avgAnswer = 0;
      var orderIdx;
      qObject = {
        text: question.text,
        relationLabels: relationLabels,
        answerLabels: answerLabels,
        answers: {},
        avgAnswers: {}
      };
      reports.forEach(function(report) {
        // skip reports of responders who doesn't have any relation with reviewee
        if (report._id.relation !== -1) {
          sumAnswer = report[question.q];
          avgAnswer = parseFloat((sumAnswer / report.num_of_responders).toFixed(AVG_DECIMAL_PRECISION));
          orderIdx = report._id.relation;
          qObject['answers'][orderIdx] = sumAnswer;
          qObject['avgAnswers'][orderIdx] = avgAnswer;
        } else {
          logger.warn('Responders %j were skipped since they don\'t stand in any relation with reviewee', report.responders);
        }
      });
      // fill answers for missed roles
      for (var i = 0; i < relationLabels.length; i ++) {
        if (_.isUndefined(qObject['answers'][i])) {
          qObject['answers'][i] = qObject['avgAnswers'][i] = 0;
        }
      }
      qObject['answers'] = Object.values(qObject['answers']);
      qObject['avgAnswers'] = Object.values(qObject['avgAnswers']);
      result.push(qObject);
    });
    logger.info('The regrouping by series is finished successfully');
    cb(null, result);
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
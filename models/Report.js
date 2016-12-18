var mongoose = require('../db');
var async = require('async');
var CsvParser = require('./CsvParser');
var validator = require('validator');
var logger = require('../lib/logger')(module);
var answers = require('../config/data').answers;
var _ = require('lodash');
var User = require('./User');
var Relation = require('./Relation');
var uniqueBy = require('../helpers/collection').uniqueBy;

var AVG_DECIMAL_PRECISION = 1;


var validationSchema = {

};

module.exports = {
  /**
   * Set model options, which are required in the
   * report module
   *
   * @param entity
   */
  setOptions: function(entity) {
    this.collectionName = entity.collectionName;
    this.modelName = entity.modelName;
    this.CSV_TO_DB_MAP = entity.CSV_TO_DB_MAP;
    this.questions = entity.questions;
    this.QuestionModel = entity.QuestionModel;
  },

  dropCollection: function(cb) {
    mongoose.connection.db.dropCollection(this.collectionName, function() {
      logger.info('Collection "%s" was dropped', this.collectionName);
    });
    cb(null);
  },

  mapAnswersTextToNum: function() {
    var lcAnswers = _.map(answers, function(answer) {
      return answer.toLowerCase()
    });
    return _.zipObject(lcAnswers, _.range(lcAnswers.length));
  },

  mapAnswersNumToText: function() {
    var lcAnswers = _.map(answers, function(answer) {
      return answer.toLowerCase()
    });
    return _.zipObject(_.range(lcAnswers.length), lcAnswers);
  },

  validate: function(data, cb) {
    cb(null, data);
  },

  parse: function(filename, cb) {
    CsvParser.setCsvToDbMap(this.CSV_TO_DB_MAP);
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
  },

  castAnswers: function(data, cb) {
    var answersTextToNumMap = this.mapAnswersTextToNum();
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
  },

  saveCollection: function(data, cb) {
    var reportCollection = [];
    var userCollection = [];

    data.forEach(function(row, idx) {
      var report = new this.model(this.modelName)(row);
      var email = User.generateEmailByFullname(row.reviewee);

      async.waterfall([
        function(cb) {
          Relation.findOne({reviewee: row.reviewee, responderEmail: row.responder}, function(err, instance) {
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
  },

  /**
   * Get all unique reviewees from the consultant_report table
   *
   * @param cb
   * @returns {Promise}
   */
  getReviewees: function(cb) {
    logger.info('Request for list of all reviewees');

    return this.model(this.modelName).aggregate([
      {$group: {_id: "$reviewee", responders_number: {$sum: 1}}},
      {$project: {username: "$_id", responders_number: "$responders_number"}}
    ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('List of reviewees performed by consultant was fetched successfully');
      cb(null, data);
    });
  },

  /**
   * Returns report in format
   * [
   *  {
   *    _.id: { relation: <int> },
   *    num_of_responders: <int>,
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
   * @param {Number} userId
   * @param {Function} cb
   */
  getReport: function(userId, cb) {
    logger.info('Request for report for reviewee with ID "%s"', userId);

    var groupQuery = {
      $group: {
        _id: {relation: '$relation'},
        num_of_responders: {$sum: 1},
        responders: {$push: "$responder"}
      }
    };

    for (var i = 1; i <= this.questions.length; i++) {
      groupQuery['$group']['q' + i] = {$sum: '$q' + i};
      groupQuery['$group']['answers' + i] = {$push: {answer: '$q' + i, responder: "$responder"}};
    }

    this.model(this.modelName).aggregate([
      {$lookup: {from: 'users', localField: 'reviewee', foreignField: 'name', as: 'joined_reviewee'}},
      {$match: {'joined_reviewee._id': mongoose.Types.ObjectId(userId)}},
      groupQuery,
      {$sort: {'_id.relation': 1}}
    ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('Answers grouped by responders roles was retrieved successfully');
      cb(null, data);
    });
  },

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
  addQuestionText: function(reports, cb) {
    logger.info('Adds full text for question subfields, i.e. convert from { q1: 2 } to { q1: {question: FullQuestionText, value: 2 }}');

    this.QuestionModel.find({}, function(err, questions) {
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
  },

  /**
   * Adds additional field "relationStr" which contains text representation of the relation
   *
   * @param {Object} reports
   * @param {Function} cb
   */
  addRelationStr: function(reports, cb) {
    logger.info('Add field "relationStr" which contains text representations of the relation');

    var relations = Relation.mapRelationsNumToText();

    reports.forEach(function(report) {
      report.relationStr = relations[report._id.relation];
    });
    logger.info('The field "relationStr" was added successfully');
    cb(null, reports);
  },

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
  regroupByQuestions: function(reports, cb) {
  },

  /**
   * Input data is grouped by responders. This method regroups data by series.
   * Output:
   * [
   *  {
   *    text: <question in text form>
   *    relationLabels: ['Self-evaluation', 'Manager', 'Line manager', 'Peer', 'Direct report'],
   *    answerLabels: ['Don`t know', 'Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'],
   *    answers: [ 5, 1, 0, 3, 6 ],
   *    avgAnswers: [2.5, 0.5, 0, 1.5, 3],
   *    respondersNumber: [1, 3, 2, 5, 1]
   *  },
   *  ...
   * ]
   *
   * @param {Object} reports
   * @param {Function} cb
   */
  regroupBySeries: function(reports, cb) {
    logger.info('Regrouping data by series');

    var relationLabels = Object.values(Relation.mapRelationsNumToText());
    var answerLabels = Object.values(this.mapAnswersNumToText());
    var result = [];
    var qObject = {};

    this.QuestionModel.find({}, function(err, questions) {
      questions.forEach(function(question) {
        var sumAnswer = 0;
        var avgAnswer = 0;
        var orderIdx;
        qObject = {
          text: question.text,
          relationLabels: relationLabels,
          answerLabels: answerLabels,
          answers: {},
          avgAnswers: {},
          respondersNumber: {}
        };
        reports.forEach(function(report) {
          // skip reports of responders who doesn't have any relation with reviewee
          if (report._id.relation !== -1) {
            sumAnswer = report[question.q];
            avgAnswer = parseFloat((sumAnswer / report.num_of_responders).toFixed(AVG_DECIMAL_PRECISION));
            orderIdx = report._id.relation;
            qObject['answers'][orderIdx] = sumAnswer;
            qObject['avgAnswers'][orderIdx] = avgAnswer;
            qObject['respondersNumber'][orderIdx] = report.num_of_responders;
          } else {
            logger.warn('Responders %j were skipped since they don\'t stand in any relation with reviewee', report.responders);
          }
        });
        // fill answers for missed roles
        for (var i = 0; i < relationLabels.length; i++) {
          if (_.isUndefined(qObject['answers'][i])) {
            qObject['answers'][i] = qObject['avgAnswers'][i] = qObject['respondersNumber'][i] = 0;
          }
        }
        qObject['answers'] = Object.values(qObject['answers']);
        qObject['avgAnswers'] = Object.values(qObject['avgAnswers']);
        qObject['respondersNumber'] = Object.values(qObject['respondersNumber']);
        result.push(qObject);
      });
      logger.info('The regrouping by series is finished successfully');
      cb(null, result);
    });
  },

  /**
   * Returns statistics for each question for a specific person
   * [
   *   {
   *     self_score: <float>,
   *     avg_score: <float>, // avg score without self assessment
   *     avg_norm:  <float>, // avg score based on all answers
   *     self_gap: <float>,  // self_score - avg_score
   *     avg_gap: <float>    // avg_norm - avg_score
   *   },
   *   ...
   * ]
   *
   * @param userId
   * @param {Function} cb
   */
  getStatistics: function(userId, cb) {
    logger.info('Get statistics for person with ID "%s"', userId);
    async.parallel({
      selfAvg: this.getAvgAnswersForReviewee.bind(this, userId),
      respondersAvg: this.getAvgAnswersByResponders.bind(this, userId),
      companyAvg: this.getAvgAnswersByCompany.bind(this)
    }, function(err, results) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      var data = [], selfScore, avgScore, avgNorm;
      for (var i = 1; i <= this.questions.length; i++) {
        selfScore = results.selfAvg.length ? results.selfAvg[0]['q' + i] : 0;
        avgScore = results.respondersAvg.length ? results.respondersAvg[0]['avg_score' + i] : 0;
        avgNorm = results.companyAvg.length ? results.companyAvg[0]['avg_norm' + i] : 0;

        selfScore = selfScore.toFixed(AVG_DECIMAL_PRECISION);
        avgScore = avgScore.toFixed(AVG_DECIMAL_PRECISION);
        avgNorm = avgNorm.toFixed(AVG_DECIMAL_PRECISION);

        data.push({
          self_score: selfScore,
          avg_score: avgScore,
          avg_norm: avgNorm,
          self_gap: (selfScore - avgScore).toFixed(AVG_DECIMAL_PRECISION),
          avg_gap: (avgNorm - avgScore).toFixed(AVG_DECIMAL_PRECISION)
        });
      }
      logger.info('Statistics for a person "%s" was gathered successfully', userId);
      cb(data);
    });
  },

  /**
   * Returns average answers of all responders for a specific person, excluding himself
   * [
   *   { _id: 1,
   *     avg_score1: <float>,
   *     avg_score1: <float>,
   *     ...
   *   },
   *   ...
   * ]
   *
   * @param userId
   * @param {Function} cb
   */
  getAvgAnswersByResponders: function(userId, cb) {
    logger.info('Get average answers of all responders for a reviewee with ID "%s", excluding himself', userId);

    var groupQuery = {
      $group: {_id: null}
    };

    for (var i = 1; i <= this.questions.length; i++) {
      groupQuery['$group']['avg_score' + i] = {$avg: '$q' + i};
    }

    this.model(this.modelName).aggregate([
      {$lookup: {from: 'users', localField: 'reviewee', foreignField: 'name', as: 'joined_reviewee'}},
      {$match: {'joined_reviewee._id': mongoose.Types.ObjectId(userId)}},
      {'$unwind': '$joined_reviewee'},
      {$redact: {$cond: [{$ne: ['$responder', '$joined_reviewee.email']}, '$$KEEP', '$$PRUNE']}},
      groupQuery
    ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('Average answers of all responders for a reviewee, excluding himself, was completed successfully');
      cb(null, data);
    });
  },

  /**
   * Returns average value for each question based on answers of responders of the specific person
   * [
   *   { _id: 1,
   *     self_score1: <float>,
   *     self_score1: <float>,
   *     ...
   *   },
   *   ...
   * ]
   *
   * @param userId
   * @param {Function} cb
   */
  getAvgAnswersForReviewee: function(userId, cb) {
    logger.info('Get average answers for a person with ID "%s"', userId);

    this.model(this.modelName).aggregate([
      {$lookup: {from: 'users', localField: 'reviewee', foreignField: 'name', as: 'joined_reviewee'}},
      {$match: {'joined_reviewee._id': mongoose.Types.ObjectId(userId)}},
      {'$unwind': '$joined_reviewee'},
      {$redact: {$cond: [{$eq: ['$responder', '$joined_reviewee.email']}, '$$KEEP', '$$PRUNE']}}
    ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('Average answers for a person was completed successfully');
      cb(null, data);
    });
  },

  /**
   * Returns average value for each question based on answers of all people in the company
   * [
   *   { _id: null,
   *     avg_norm2: <float>,
   *     avg_norm2: <float>,
   *     ...
   *   },
   *   ...
   * ]
   *
   * @param {Function} cb
   */
  getAvgAnswersByCompany: function(cb) {
    logger.info('Get average answers of all people in the company');

    var groupQuery = {
      $group: {_id: null}
    };

    for (var i = 1; i <= this.questions.length; i++) {
      groupQuery['$group']['avg_norm' + i] = {$avg: '$q' + i};
    }

    this.model(this.modelName).aggregate([
      groupQuery
    ], function(err, data) {
      if (err) {
        logger.error(err);
        return cb(err, null);
      }
      logger.info('Average answers of all people in the company was completed successfully');
      cb(null, data);
    });
  }
};
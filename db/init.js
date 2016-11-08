var async = require('async');
var logger = require('../lib/logger')(module);
var mongoose = require('./index');
var consultantQuestionSchema = require('./schema').consultantQuestionSchema;
var managerQuestionSchema = require('./schema').managerQuestionSchema;
var consultantQuestions = require('../config/data').consultantQuestions;
var managerQeustions = require('../config/data').managerQeustions;


mongoose.connection.on('connected', function() {
var db = mongoose.connection.db;

  async.series([
    function(cb) {
      db.collections(function(err, collections) {
        if (collections.find(function(o) { return o.s.name === 'consultant_questions' })) {
          db.dropCollection('consultant_questions', function() {
            console.log('collection "consultant_questions" was dropped');
            cb(null);
          });
        } else {
          cb(null);
        }
      });
    },
    function(cb) {
      db.collections(function(err, collections) {
        if (collections.find(function(o) { return o.s.name === 'manager_questions' })) {
          db.dropCollection('manager_questions', function() {
            console.log('collection "manager_questions" was dropped');
            cb(null);
          });
        } else {
          cb(null);
        }
      });
    },
    function(cb) {
      var ConsultantQuestion = mongoose.model('ConsultantQuestion', consultantQuestionSchema);
      consultantQuestions.forEach(function(question, idx) {
        new ConsultantQuestion({
          q : 'q' + (idx + 1),
          text: question
        }).save(function() {
          if (idx + 1 === consultantQuestions.length) {
            console.log('collection "consultant_questions" was created');
            cb();
          }
        });
      });
    },
    function(cb) {
      var ManagerQeustion = mongoose.model('ManagerQuestion', managerQuestionSchema);
      managerQeustions.forEach(function(question, idx) {
        new ManagerQeustion({
          q : 'q' + (idx + 1),
          text: question
        }).save(function() {
          if (idx + 1 === managerQeustions.length) {
            console.log('collection "manager_questions" was created');
            cb();
          }
        });
      });
    }
  ], function(err, results) {
    if (err) {
      console.log(err)
    } else {
      console.log('Database was initialized successfully');
    }
    db.close();
  });
});


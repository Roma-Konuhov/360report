var mongoose = require('../db');
var managerQuestionSchema = require('../db/schema').managerQuestionSchema;

var ManagerQuestion = mongoose.model('ManagerQuestion', managerQuestionSchema);

module.exports = ManagerQuestion;

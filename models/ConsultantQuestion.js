var mongoose = require('../db');
var consultantQuestionSchema = require('../db/schema').consultantQuestionSchema;

var ConsultantQuestion = mongoose.model('ConsultantQuestion', consultantQuestionSchema);

module.exports = ConsultantQuestion;

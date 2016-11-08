var mongoose = require('../db');
var relationSchema = require('../db/schema').relationSchema;
var CsvParser = require('./CsvParser');
var validator = require('validator');
var logger = require('../lib/logger')(module);
var relations = require('../config/data').relations;
var _ = require('lodash');

var CSV_TO_DB_MAP = {
  'responder': 'responder',
  'reviewee': 'reviewee',
  'relation': 'relation',
};

var validationSchema = {

};

var collectionName = 'relations';

relationSchema.statics.dropCollection = function(cb) {
  mongoose.connection.db.dropCollection(collectionName, function() {
    logger.info('Collection "%s" was dropped', collectionName);
  });
  cb(null);
};

relationSchema.statics.validate = function(data, cb) {
  cb(null, data);
};

relationSchema.statics.mapRelationsTextToNum = function() {
  var lcRelations = _.map(relations, function(answer) { return answer.toLowerCase() });
  return _.zipObject(lcRelations, _.range(lcRelations.length));
};

relationSchema.statics.mapRelationsNumToText = function() {
  var lcRelations = _.map(relations, function(answer) { return answer.toLowerCase() });
  return _.zipObject(_.range(lcRelations.length), lcRelations);
};


relationSchema.statics.parse = function(filename, cb) {
  CsvParser.setCsvToDbMap(CSV_TO_DB_MAP);
  CsvParser.setFilter(function(row) {
    return row.responder && row.reviewee && row.relation;
  });
  CsvParser.parse(filename, function(err, data) {
    if (err) {
      logger.error(err);
    }
    logger.info('Data from file "%s" was parsed: %j', filename, data);
    cb(err, data);
  });
};

relationSchema.statics.castRelations = function(data, cb) {
  var relationsTextToNumMap = Relation.mapRelationsTextToNum();
  var collection = [];
  var lcValue;

  data.forEach(function(row) {
    var result = {};
    for (var key in row) {
      if (key === 'relation') {
        lcValue = row[key].toLowerCase();
        result[key] = relationsTextToNumMap[lcValue];
      } else {
        result[key] = row[key];
      }
    }
    logger.info('after cast',result);

    collection.push(result);
  });
  logger.info('Values for fields like "qN" were converted to integer according map');

  cb(null, collection);
};

relationSchema.statics.saveCollection = function(data, cb) {
  var collection = [];

  data.forEach(function(row, idx) {
    var report = new Relation(row);
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

var Relation = mongoose.model('Relation', relationSchema);

module.exports = Relation;
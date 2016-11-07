var mongoose = require('mongoose');
var config = require('../config');
var logger = require('../lib/logger')(module);
//mongoose.set('debug', true);

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));
mongoose.connection.on('connected', function() {
  logger.info('Database connected');
});
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

module.exports = mongoose;
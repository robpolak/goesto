var config = require('./configuration');
var mongoose = require('mongoose');
var logger = require('./logging');
var apiUtil = require('./apiUtil');

module.exports = function() {

  function getMainDb() {
    var dbConfig = global._config.mainDb;
    var conn = mongoose.createConnection(dbConfig.url, dbConfig.options);
    conn.on('error', function (err) {
      logger.logTrace('Connection Error', {db: 'Main Mongo DB'});
      console.log(err); //TODONE : log error
    });
    conn.once('open', function callback() {
      logger.logTrace('Connection Open', {db: 'Main Mongo DB'})
    });

    return conn;
  }


  return {
    getMainDb: getMainDb
  }
}();

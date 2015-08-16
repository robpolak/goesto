var config = require('./configuration');
var mongoose = require('mongoose');
var logger = require('./logging');
var _ = require('underscore');
var apiUtil = require('./apiUtil');

module.exports = function() {

  function getMainDb() {
    var dbConfig = global._config.mainDb;
    var conn = mongoose.createConnection(dbConfig.url, dbConfig.options);
    conn.on('error', function (err) {
      logger.logError('Connection Error', err);
      console.log(err); //TODONE : log error
    });
    conn.once('open', function callback() {
      logger.logTrace('Connection Open', {db: 'Main Mongo DB'})
    });

    return conn;
  }

  function buildFromRequest(req, obj, ignoreList) {

    ignoreList || (ignoreList = []);
    ignoreList = ignoreList.concat(['__v', '_id']);
    var fields = Object.keys(obj.schema.paths);
    fields = apiUtil.pareFieldsToTopLevelParams(fields);  // splits the string and grabs the top layer object and detects the depth into an array like so [{"fieldName":"system_name","maxDepth":1},{"fieldName":"twilio","maxDepth":2},etc...] example from basic config
    _.each(fields, function (field) {
      if (!_.contains(ignoreList, field.fieldName)) {
        var val = apiUtil.getParam(req, field.fieldName);
        if (typeof val != 'undefined') {
          if (field.maxDepth >= 2) {
            obj[field.fieldName] = _.clone(val);
          } else {
            obj[field.fieldName] = val;
          }
        }
      }
    });
  };

  return {
    getMainDb: getMainDb,
    buildFromRequest: buildFromRequest
  }
}();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoCore = require('../../src/core/mongoCore');



module.exports = function() {

  var ConfigSchema = new Schema({
    system_name: { type: String, required: true, min: 4 },
    type:  { type: String, required: true, min: 1 },
  });

  ConfigSchema.methods.buildFromRequest = function(req) {
    mongoCore.buildFromRequest(req, this);
  };

  var db = mongoCore.getMainDb();
  var table = global._config.mainDb.db_prefix + 'config';
  ConfigSchema.set('collection', table);
  return db.model(table, ConfigSchema);
}();

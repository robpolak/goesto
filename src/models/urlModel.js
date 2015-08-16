var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoCore = require('../../src/core/mongoCore');


module.exports = function() {
  var schemaOptions = {
    toObject: {
      virtuals: true
    }
  };
  var UrlSchema = new Schema({
    url: {type: String, required: true, min: 1}
  }, schemaOptions);


  var db = mongoCore.getMainDb();
  var table =  "url";
  UrlSchema.set('collection', table);
  return db.model(table, UrlSchema);
}();
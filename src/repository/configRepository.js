var configModel = require('../models/configModel');

var config = function () {

};

config.prototype.getConfig = function (done) {
  configModel.find({type: 'settings'}, function (err, data) {
    if (err) {
      return done(err);
    }
    var config = data;
    if (config.length != 1) {
      var err = 'Config Length not 1!' + config.length;
      done(err, null);
    }
    else {
      done(null, config[0]);
    }
  });
};

config.prototype.saveConfig = function(updatedConfig, done){
  configModel.update(updatedConfig, function(err,data){
    if(err){
      done(err);
    } else {
      done(null,data);
    }
  })
};

module.exports = new config();
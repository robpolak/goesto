var configRepository = require('../../repository/configRepository');
var cache = require('memory-cache');

var config = function() {

};

config.prototype.getConfig = function(done) {
  var cache_key = "systemConfig";
  var cached_config = cache.get(cache_key);
  if (cached_config) {
    global._logger.logTrace("Config Loaded From Cache", cached_config.system_name);
    done(cached_config);
    return;
  }
  configRepository.getConfig(function(err, config) {
    if(err)
    {
      throw err;
    }
    else {
      cache.put(cache_key, config, global._config.caching.systemConfig_cache || 10000);
      done(config);
    }
  });
};

config.prototype.getConfigAndCbError = function(done) {
  configRepository.getConfig(function (err, config) {
    if (err) {
      done(err);
    }
    else {
      done(null, config);
    }
  });
};

config.prototype.saveConfig = function(configQuery,cb){
  var updatedConfig = configQuery.toObject();
  configRepository.saveConfig(updatedConfig, function(err,data){
    if(err){
       cb(err);
    } else {
      cb(null,data);
    }
  })
};


module.exports = new config();

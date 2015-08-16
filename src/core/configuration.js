var nconf = require('nconf');


var configFile = 'config/' + process.env.node_env + '.json';
nconf.argv()
  .env()
  .file({ file:
    configFile
  });

global._logger.logTrace("Environment Config Loaded", {configFile: configFile});

module.exports = function() {

  function getSettings() {
    var settings = nconf.get('settings');
    if(!settings) {
      throw "Could not load settings!";
    }
    return settings;
  }

  return {
    getSettings: getSettings
  }

}();
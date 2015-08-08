var configController = require('../controllers/system/configController');

//user controller

var render = function() {

};

//Generic View Render
render.prototype.renderView = function(view, args, req, res,next) {
  var self = this;
  if(!args)
    args = {};

  configController.getConfig(function(config)
  {
    self.prepareConfig(config, args);
    self.prepareUser(req,args);
    args.settings = global._config; //env settings
    //args.user = req.user || {};
    args.view = view;
    if(global._minFiles) {
      args.minFiles = global._minFiles;
    }
    res.render(view, args);
  });
};

//Prepare the config for render.. only render what you want to expose on the client.
//be protective of what we send
render.prototype.prepareConfig = function(config, args) {
  args.config || (args.config = {});
  args.config = config;
};

render.prototype.prepareUser = function(req, args) {
  if(req && req.user) {
    args.user = req.user
  }
};

module.exports = new render();
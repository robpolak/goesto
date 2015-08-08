var configModel = require('../../src/models/configModel');
var configController = require('../../src/controllers/system/configController');
var routeController = require('../../src/controllers/system/routeController');
var authController = require('../../src/controllers/system/authController');
var express = require('express');
var routes = express.Router();
var userPermissions = require('../../src/models/userPermissions');
var apiUtil = require('../../src/core/apiUtil');
var authRouter = routeController.authRoute(routes);


this.getConfig = function (req, res, next) {
  if (req.params.id) {
    var id = req.params.id;
  }
  configController.getConfigAndCbError(function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    } else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  })
};

this.saveConfig = function(req,res,next){
  var configuration = new configModel();
  configuration.buildFromRequest(req);
  configuration.isNew = false;
  configuration._id = req.body._id;
  configController.saveConfig(configuration, function(err,data){
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {  // get the latests config
      configController.getConfigAndCbError(function (err, data) {
        if (err) {
          apiUtil.returnObjectAndNext(req, res, next, err, 400);
        } else {
          apiUtil.returnObjectAndNext(req, res, next, data, 200);
        }
      })
    }
  })
}
authRouter.get([userPermissions.admin_edit_config], '/api/admin/config', this.getConfig);
authRouter.put([userPermissions.admin_edit_config], '/api/admin/config', this.saveConfig);

this.routes = routes;

module.exports = this;
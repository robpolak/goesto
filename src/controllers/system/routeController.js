var _ = require('underscore');
var userController = require('./../admin/user/userController');
var apiUtil = require('../../core/apiUtil');

var RouteController = function () {

};

RouteController.prototype.authRoute = function (router) {
  var self = this;
  var get = function (userRole, route, func) {
    router.get(route, function (req, res, next) {
     self.authorize(userRole, req, res, next, func);
    });
  };
  var post = function (userRole, route, func) {
    router.post(route, function (req, res, next) {
      self.authorize(userRole, req, res, next, func);
    });
  };
  var put = function (userRole, route, func) {
    router.put(route, function (req, res, next) {
      self.authorize(userRole, req, res, next, func);
    });
  };
  var delete_verb = function (userRole, route, func) {
    router.delete(route, function (req, res, next) {
      self.authorize(userRole, req, res, next, func);
    });
  };
  return {
    get: get,
    post: post,
    put: put,
    delete: delete_verb
  }
};

RouteController.prototype.authorize = function (accessRoles, req, res, next, func) {
  var user = req.user;
  if (user) {
    for (var i = 0, len = accessRoles.length; i < len; i++) {
      var role = accessRoles[i];
      var hasRole = req.user.allGroups[role.id];
      if(!func) {
        throw "Function not passed!!"
      }
      if (hasRole && func) {
        func(req, res, next);
        return;
      }
    }
  }


  apiUtil.sendStatusCodeAndNext(req, res, next, 401);
};


module.exports = new RouteController();

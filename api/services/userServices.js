var UserModel = require('../../src/models/userModel');
var UserGroupModel = require('../../src/models/userGroup');
var userController = require('../../src/controllers/admin/user/userController');
var routeController = require('../../src/controllers/system/routeController');
var authController = require('../../src/controllers/system/authController');
var express = require('express');
var routes = express.Router();
var userPermissions = require('../../src/models/userPermissions');
var apiUtil = require('../../src/core/apiUtil');
var authRouter = routeController.authRoute(routes);

this.addUser = function (req, res, next) {
  var user = new UserModel();
  user.buildFromRequest(req);

  userController.saveAndValidateUser(user, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      var user = data;
      delete user.password;
      delete user.api_key;
      apiUtil.returnObjectAndNext(req, res, next, user, 200);
    }
  });
};

this.addGroup = function (req, res, next) {
  var userGroup = new UserGroupModel();
  userGroup.buildFromRequest(req);

  userController.addUserGroup(userGroup, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getPermissions = function (req, res, next) {
  var thePermissions = userPermissions.returnPermissionSets();
  apiUtil.returnObjectAndNext(req, res, next, thePermissions, 200);
};

this.getGroups = function (req, res, next) {
  userController.getUserGroups(function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getGroup = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400); //Fixme : define err?
    return;
  }

  userController.getUserGroupByQuery({_id: id}, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.saveGroup = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400);  //Fixme : define err?
    return;
  }

  var userGroup = new UserGroupModel();
  userGroup.buildFromRequest(req);
  userGroup._id = id;
  userGroup.isNew = false;

  //todo : convert to ASYNC
  userController.saveUserGroup(userGroup, function (err, data) {
    if (err || data != 1) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      userController.getUserGroupByQuery({_id: id}, function (err, data) {
        if (err) {
          apiUtil.returnObjectAndNext(req, res, next, err, 400);
        }
        else {
          apiUtil.returnObjectAndNext(req, res, next, data, 200);
        }
      });
    }
  });
};

this.getUser = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400);  //Fixme : define err?
    return;
  }

  userController.getUserByQuery({_id: id}, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      var user = data.toObject();
      delete user.password;
      delete user.api_key;
      apiUtil.returnObjectAndNext(req, res, next, user, 200);
    }
  });
};

this.saveUser = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400); //Fixme : define err?
    return;
  }

  var user = new UserModel();
  user.buildFromRequest(req);
  user._id = id;
  userController.updateUser(user, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getUsers = function (req, res, next) {
  userController.getUsers(function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
      return;
    }
    else {
      var toRtn = [];
      //TODO : use apiUtil.convertarrayToObject
      for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        obj = obj.toObject();
        delete obj["api_key"];
        delete obj["password"];
        toRtn.push(obj);
      }
      data = toRtn;
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getUsersByMatch = function (req, res, next) {
  var match = req.query.match;
  if(!match) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  userController.getUsersByMatch(match, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, apiUtil.convertArrayToObject(data), 200);
    }
  });
};

this.getUserGroupByMatch = function (req, res, next) {
  var match = req.query.match;
  if(!match) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  userController.getUserGroupByMatch(match, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, apiUtil.convertArrayToObject(data), 200);
    }
  });
};

this.getUserAndGroupByMatch = function (req, res, next) {
  var match = req.query.match;
  if(!match) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  userController.getUserAndGroupByMatch(match, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};


this.loadProfile = function (req, res, next) {  // fixme? (from unit tests):  err is not defined | at Object.loadProfile (api/services/userServices.js:143:49) | at Context.<anonymous> (test/unit/api/services/userServicesTests.js:241:19)
  if (!req.user) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  userController.getUser(req.user.username, false, function (err, user) {
    if (err || !user) {
      apiUtil.returnObjectAndNext(req, res, next, err || {}, 400);
    }
    else {
      user = user.toObject();
      delete user.password;
      apiUtil.returnObjectAndNext(req, res, next, user, 200);
    }
  });
};

this.saveProfile = function (req, res, next) {
  var user = new UserModel();
  user.buildFromRequest(req);


  userController.updateUser(user, function (err, user) {
    if (err || !user) {
      apiUtil.returnObjectAndNext(req, res, next, err || {}, 400);
    }
    else {
      if (user.toObject)
        user = user.toObject();
      delete user.password;
      delete user.api_key;
      apiUtil.returnObjectAndNext(req, res, next, user, 200);
    }
  });
};

this.authenticate = function (req, res, next) {   //Un-authenticated
  var userName = apiUtil.getParam(req, 'username');
  var password = apiUtil.getParam(req, 'password');
  if (!userName || !password) {
    var err = 'this is an error';
    apiUtil.returnObjectAndNext(req, res, next, err, 400); //Fixme : define err?
    return;
  }

  userController.authenticateUser(userName, password, function (err, result) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      var toRet = {
        authenticated: result.authenticated
      };

      if (result.authenticated) {
        toRet._id = result.user._id;
        toRet.cookie = authController.createAuthCookie(res, result.user);
      }

      apiUtil.returnObjectAndNext(req, res, next, toRet, 200);  //it should have the user._id in here
    }
  });
};

this.deleteUser = function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400); //Fixme : define err?
    return;
  }

  var user = new UserModel();
  user.buildFromRequest(req);
  user._id = id;
  user.api_key = "0000000000000000000000000000000000000000000000000000000000000000"
  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  }
  user.username = user.username + "!!DELETED!!" + randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  user.password = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  userController.deleteUser(user, function (err, data) {
    if (err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

//Get Routes
authRouter.get([userPermissions.edit_my_profile], '/api/profile', this.loadProfile);
authRouter.get([userPermissions.admin_edit_users], '/api/permissions', this.getPermissions);
authRouter.get([userPermissions.admin_edit_users], '/api/groups', this.getGroups);
authRouter.get([userPermissions.admin_edit_groups], '/api/admin/editgroup/:id', this.getGroup);
authRouter.get([userPermissions.view_users], '/api/admin/user/:id', this.getUser);
authRouter.get([userPermissions.view_users], '/api/admin/userList', this.getUsers);
authRouter.get([userPermissions.edit_phone_numbers], '/api/admin/userMatch/', this.getUsersByMatch);
authRouter.get([userPermissions.edit_phone_numbers], '/api/admin/userGroupMatch/', this.getUserGroupByMatch);
authRouter.get([userPermissions.edit_phone_numbers], '/api/admin/userAndGroupMatch/', this.getUserAndGroupByMatch);

//Post Routes
authRouter.post([userPermissions.edit_my_profile], '/api/profile', this.saveProfile);
authRouter.post([userPermissions.admin_create_users], '/api/admin/user', this.addUser);
authRouter.post([userPermissions.admin_edit_groups], '/api/admin/groups', this.addGroup);

//Put routes
authRouter.put([userPermissions.admin_edit_groups], '/api/admin/editgroup/:id', this.saveGroup);
authRouter.put([userPermissions.admin_edit_users], '/api/admin/user/:id', this.saveUser);

//Delete Routes
authRouter.delete([userPermissions.admin_edit_users],'/api/admin/user/:id', this.deleteUser);

//--------- PUBLIC ONLY BELOW HERE -------
routes.post('/api/admin/user/authenticate', this.authenticate);

this.routes = routes;

module.exports = this;
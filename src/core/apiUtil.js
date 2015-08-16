var _ = require('underscore');
var moment = require('moment');

var ApiUtil = function () {
};


ApiUtil.prototype.sendStatusCodeAndNext = function (req, res, next, code) {
  res.status(code).send();
  res.end();
  //global._logger.responseLogger(req, res, code);
};

ApiUtil.prototype.returnObjectAndNext = function (req, res, next, obj, code) {
  if(typeof obj != 'object') {
    if(obj && obj.toString) {
      obj = obj.toString();
      //global._logger.logTrace("Outputting string response")
    }
  }

  if(obj && obj.password)
    delete obj.password;
  res.status(code || 200).send(obj);
  res.end();
  //global._logger.responseLogger(req, res, code, obj);
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
ApiUtil.prototype.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


module.exports = new ApiUtil();
var express = require('express');
var routes = express.Router();
var apiUtil = require('../../src/core/apiUtil');
var urlModel = require('../../src/models/urlModel')

this.createUrl = function (req, res, next) {
  var model = urlModel(req.body);
  model.save();
  apiUtil.returnObjectAndNext(req, res, next, {hi:'hai'}, 200);
};


routes.post('/api/url', this.createUrl);


this.routes = routes;

module.exports = this;
var routeController = require('../../src/controllers/system/routeController');
var phoneNumberController = require('../../src/controllers/admin/phone/phoneNumberController');
var callController = require('../../src/controllers/admin/contact/callController');
var twilioController = require('../../src/controllers/workspace/twilioController');

var express = require('express');
var routes = express.Router();
var apiUtil = require('../../src/core/apiUtil');
var authRouter = routeController.authRoute(routes);
var userPermissions = require('../../src/models/userPermissions');
var CallModel = require('../../src/models/callModel');

this.handlePlivoCall = function(req,res,next) {
  var body = req.body;
  var result;

  if(body.Caller.indexOf('client') != 0) {
    result = '<Response>'+
        '<Dial record="record-from-answer">' +
        '<Client>rob</Client>' +
        '</Dial>' +
        '</Response>';
  }
  else {
    var callerId = '16024970051';
    result = '<Response>'+
        '<Dial callerId="'+callerId+'" timeout="20" record="record-from-answer">'+body.PhoneNumber+'</Dial>' +
        '</Response>';
  }

  res.set('Content-Type', 'text/xml');
  apiUtil.returnObjectAndNext(req, res, next, result, 200);
  return;
};


this.handleTwilioCall = function(req,res,next) {
  var body = req.body;
  var result;

  if(body.Caller.indexOf('client') != 0) {
    result = '<Response>'+
    '<Dial record="record-from-answer">' +
    '<Client>rob</Client>' +
    '</Dial>' +
    '</Response>';
  }
  else {
    var callerId = '16024970051';
    result = '<Response>'+
    '<Dial callerId="'+callerId+'" timeout="20" record="record-from-answer">'+body.PhoneNumber+'</Dial>' +
    '</Response>';
  }

  res.set('Content-Type', 'text/xml');
  apiUtil.returnObjectAndNext(req, res, next, result, 200);
  return;
};

this.transferTwilioCall = function(req,res,next) {
  var body = req.body;
  var to = req.query.to;
  var result;

  var callerId = '16024970051';
  result = '<Response>' +
  '<Dial>' +
  '<Conference record="record-from-start" endConferenceOnExit="true" startConferenceOnEnter="true" beep="false">' +
    'MyConference' +
  '</Conference>' +
  '</Dial>' +
  '</Response>';
  console.log('Dial To: ' + to);

  res.set('Content-Type', 'text/xml');
  apiUtil.returnObjectAndNext(req, res, next, result, 200);
  return;
};

this.handleTwilioStatus = function(req,res,next) {
  var twilioData = req.body;
  var callSid = twilioData.CallSid;
  if(!callSid) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 400);
    return;
  }

  callController.saveTwilioData(callSid, twilioData, function(err, data) {
    if(!data) {
      apiUtil.returnObjectAndNext(req, res, next, twilioData || {}, 500);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, twilioData || {}, 200);
    }
  });
};
this.getTwilioToken = function(req,res,next) {
  twilioController.getToken(req,function(token) {
    apiUtil.returnObjectAndNext(req, res, next, {token: token}, 200);
  });
};
this.transferCall = function(req,res,next) {
  var callSid = req.body.callSid;
  var to = req.body.to;
  twilioController.transferCall(callSid, to, function(err,call) {
    apiUtil.returnObjectAndNext(req, res, next, {}, 200);
  });
};

routes.post('/api/twilio/transferCall', this.transferTwilioCall);
routes.post('/api/twilio/handleCall', this.handleTwilioCall);
routes.post('/api/twilio/callStatus', this.handleTwilioStatus);
routes.post('/api/phone/transfer', this.transferCall);
routes.get('/api/make/ivr/call',function(req,res,next) {
  var to = req.query.to;
  twilioController.makeIvrCall(to, function(done) {

  });
});

authRouter.get([userPermissions.use_dialer], '/api/twilio/token', this.getTwilioToken);

this.callComplete = function(req,res,next) {
  var call = new CallModel();
  call.buildFromRequest(req);
  call.user_id = req.user._id;
  call.username = req.user.username;

  callController.saveAndValidateCall(call,function(err,data){
    if(err || !data || !data.id) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
};

this.getMyCalls = function(req,res,next) {
  callController.getCallsForUser(req.user.username,function(err,data){
    if(err || !data) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      apiUtil.returnObjectAndNext(req, res, next, apiUtil.convertArrayToObject(data), 200);
    }
  });
};

authRouter.post([userPermissions.use_dialer], '/api/dialer/call/complete', this.callComplete);
authRouter.get([userPermissions.use_dialer], '/api/user/mycalls', this.getMyCalls);
authRouter.get([userPermissions.edit_phone_numbers],'/api/admin/phoneNumbers', function (req,res,next){
  phoneNumberController.getPhoneNumbers(function(err,data){
    if(err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      var toRtn = [];
      for(var i=0;i<data.length;i++){
        var obj = data[i];
        obj = obj.toObject();
        toRtn.push(obj);
      }
      apiUtil.returnObjectAndNext(req, res, next, toRtn, 200);
    }
  });
});
authRouter.get([userPermissions.edit_phone_numbers],'/api/admin/phoneNumber/:id', function (req,res,next){
  var id = req.params.id;
  if(!id) {
    apiUtil.returnObjectAndNext(req, res, next, err, 400);
    return;
  }
  phoneNumberController.getPhoneNumber(id, function(err,data){
    if(err) {
      apiUtil.returnObjectAndNext(req, res, next, err, 400);
    }
    else {
      if(!data || data.length == 0) {
        apiUtil.returnObjectAndNext(req, res, next, {}, 404);
        return;
      }
      if(data.toObject)
        data = data.toObject();
      apiUtil.returnObjectAndNext(req, res, next, data, 200);
    }
  });
});



this.routes = routes;
module.exports = this;


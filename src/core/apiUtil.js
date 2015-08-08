var logger = require('./logging');
var crypto = require('crypto');



var ApiUtil = function () {
};

ApiUtil.prototype.updateDocument = function(doc, SchemaTarget, data) {
  for (var field in SchemaTarget.schema.paths) {  //pass a schema as second argument
    if ((field !== '_id') && (field !== '__v')) {
      var newValue = this.getObjValue(field, data);
      if (newValue !== undefined) {
        this.setObjValue(field, doc, newValue);
      }
    }
  }
  return doc;
};



ApiUtil.prototype.sendStatusCodeAndNext = function (req, res, next, code) {
  res.status(code).send();
  res.end();
  global._logger.responseLogger(req, res, code);

};

ApiUtil.prototype.returnObjectAndNext = function (req, res, next, obj, code) {
  if(typeof obj != 'object') {
    obj = {};
  }
  res.status(code || 200).send(obj);
  res.end();
  global._logger.responseLogger(req, res, code, obj);
};

ApiUtil.prototype.getParam = function (req, param) {
  if (req.query && typeof req.query[param] != "undefined")
    return req.query[param];
  else if (req.body && typeof req.body[param] != "undefined")
    return req.body[param];
};

ApiUtil.prototype.pareFieldsToTopLevelParams = function(arrOfFields,debug){
  var toRtn = [];
  if(debug){
    console.log("breakpoint");
  }
  for(var i = 0; i < arrOfFields.length; i++){
    var field = arrOfFields[i];
    var fieldObj = {};
    var splitFieldArr;
    splitFieldArr = field.split('.');
    fieldObj.fieldName = splitFieldArr[0];
    fieldObj.maxDepth = splitFieldArr.length;
    if(debug){
      console.log("breakpoint");
    }
    if(fieldObj.maxDepth == 1){
      toRtn.push(fieldObj);
    } else {
      if(fieldObj.fieldName != toRtn[toRtn.length-1].fieldName) {
        fieldObj.children = [field];
        toRtn.push(fieldObj);
      } else {
        if(fieldObj.fieldName == toRtn[toRtn.length-1].fieldName){
          toRtn[toRtn.length-1].children.push(field);
        }
       if(fieldObj.maxDepth > toRtn[toRtn.length-1].maxDepth){  // if it needs to go deeper that would go here.
         toRtn[toRtn.length-1].maxDepth = fieldObj.maxDepth;
       }// do nothing beyond this depth
      }
    }
  }
  return toRtn;
};

ApiUtil.prototype.convertArrayToObject = function(arr) {
  var toRtn= [];
  for(var i= 0,len = arr.length;i<len;i++){
    var obj = arr[i];
    obj = obj.toObject();
    //console.log(JSON.stringify(obj));
    delete obj["api_key"];
    delete obj["password"];
    toRtn.push(obj);
  }
  return toRtn;
};
ApiUtil.prototype.generateApiKey = function () {
  function randomString(length, chars) {
    if (!chars) {
      throw new Error('Argument \'chars\' is undefined');
    }
    var charsLength = chars.length;
    if (charsLength > 256) {
      throw new Error('Argument \'chars\' should not have more than 256 characters'
      + ', otherwise unpredictability will be broken');
    }
    var randomBytes = crypto.randomBytes(length);
    var result = new Array(length);
    var cursor = 0;
    for (var i = 0; i < length; i++) {
      cursor += randomBytes[i];
      result[i] = chars[cursor % charsLength]
    }
    return result.join('');
  }

  function randomAsciiString(length) {
    return randomString(length,
      'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789');
  }

  return randomAsciiString(64);
};


module.exports = new ApiUtil();

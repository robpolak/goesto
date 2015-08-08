var express = require('express');
var router = express.Router();
var render = require('../src/core/render');

router.get('/', function(req, res) {
  render.renderView('index.jade', {},req,res);
});


router.get('/public/views/:path1/:path2?', function(req, res) {
  var path1 = req.params.path1;
  var path2 = req.params.path2;
  if(!path1)
    throw "Invalid View";

  if(!path2)
    render.renderView('public/views/'+ path1, {},req,res);
  else
    render.renderView('public/views/'+ path1 + '/' + path2, {},req,res);
});


module.exports = router;

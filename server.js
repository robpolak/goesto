var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require('http');
var app = express();
var glob = require('glob');
var UglifyJS = require("uglify-js");
var fs = require('fs');
var busboy = require('connect-busboy');
var bodyParser = require('body-parser');


global.env = process.env.node_env;

//Logging
var logging = require('./src/core/logging');
global._logger = logging;

//Config
var config = require('./src/core/configuration');
global._config = config.getSettings();

if (global.env == "local") {
  function minJavascript() {
    glob("app/scripts/**/*.js", {}, function (er, files) {
      var js = UglifyJS.minify(files, {
        mangle: false
      });
      fs.writeFileSync('public/javascripts/goes-to.min.js', js.code);
      fs.writeFileSync('public/javascripts/goes-to.min.map.js', js.map);
      //global._logger.logTrace('Done Loading JS');
      global._minJsFiles = files;
    });
  }

  minJavascript();
}

//global._logger.logTrace('Starting Express');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//BusBoy
app.use(busboy());

//JADE
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'app')));

//EXPRESS
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
//app.use(cookieParser());

//API
require('./api/api')(app);

//Routes
app.use('/', require('./routes/public_routes'));




app.get('*', function(req, res, next){
  //global._logger.logTrace('404 Not Found',req.originalUrl);
  res.status(404).send();
});

var server = http.createServer(app);
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
server.listen(port);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

process.on('uncaughtException', function (err) {
  //global._logger.logError("Uncaught Exception", err);
  throw err;
});

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = app;

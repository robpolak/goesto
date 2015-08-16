
var render = function() {

};

//Generic View Render
render.prototype.renderView = function(view, args, req, res,next) {
  var self = this;
  if (!args)
    args = {};

  args.settings = global._config; //env settings
  //args.user = req.user || {};
  args.view = view;
  args.minCssFiles = global._minCssFiles;
  args.minJsFiles = global._minJsFiles;

  res.render(view, args);

};


module.exports = new render();
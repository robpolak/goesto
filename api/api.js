module.exports = function(app) {
  app.use('/', require('./services/urlServices').routes);
};



/**
 * Module dependencies.
 */

var express = require('express');
var routes  = require('./routes');
var fs      = require('fs');
var config  = require('./config').config;

var app     = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register('.html', require('ejs'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

routes(app);

app.listen(config.port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

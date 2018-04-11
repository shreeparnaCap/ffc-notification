var express = require('express');
var app = express();

// Setting up root directory from where app got started
app.locals.rootPath = __dirname;

// Adding Arya as library
var Arya = require('@capillarytech/arya');

// Initializing Arya As library
var options = {
	'mode': 'LIB',
	'module': 'ffc-notifn'
};
Arya.init(app, options);

// Initializing the routes is needed in case of Arya being used as LIB Mode
var config = require('./config');
app.use(config.prefix + config.endpoint, require('./api'));

// Track each error using errorHandler middleware
Arya.initErrorHander(app);

module.exports = app;

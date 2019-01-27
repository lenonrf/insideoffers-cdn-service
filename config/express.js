'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	multer = require('multer'),
	methodOverride = require('method-override'),
	//cookieParser = require('cookie-parser'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path'),
    pmx = require('pmx');

module.exports = function() {


	// Initialize express app
	var app = express();


	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = 'cdn-insideoffers';
	app.locals.description = 'cdb';
	app.locals.keywords = 'cdn';


	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});


	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate['swig']);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	app.locals.cache = 'memory';


	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	//app.use(cookieParser());

	// New call to compress content
	//app.use(compress());

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public'), {maxAge: 300000}));

	// -------------------------------------------------------------------------------------------

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		console.log('routePath', routePath);
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

 	
	app.use(pmx.expressErrorHandler());

	

	return app;
};

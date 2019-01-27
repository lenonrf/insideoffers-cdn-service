'use strict';


 
var pmx = require('pmx').init();

require.extensions['.server.controller.js'] = require.extensions['.js'];
require.extensions['.server.model.js'] = require.extensions['.js'];
require.extensions['.server.routes.js'] = require.extensions['.js'];


// Init the express application
var app = require('./config/express')();
 	
// Start the app by listening on <port>
app.listen(3013);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('cdn.insideoffers started on port 3013');

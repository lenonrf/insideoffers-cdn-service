'use strict';

module.exports = {
	
	app: {
		title: 'cdn',
		description: '',
		keywords: 'cdn'
	},
	
	port: process.env.PORT || 3013,
	templateEngine: 'swig',
	sessionSecret: 'cdn',
	sessionCollection: 'sessions',

};

'use strict';

var _ = require('lodash'),
users = require('../models/user'),
moment = require('moment-range');


module.exports = function (app, io) {
	// Make io accessible to our router
	app.use(function(req, res, next){
		req.feeds = io;
		next();
	});
}

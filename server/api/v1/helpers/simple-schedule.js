'use strict';


var _ = require('lodash'),
schedule = require('node-schedule'),
moment = require('moment'),
async = require('async'),
jobs = {};



module.exports.add = function(date, name, id, fn) {
	if(jobs[name + id]){
		jobs[name + id].cancel();
	}
	jobs[name + id] = schedule.scheduleJob(date , fn);
	return;
}

module.exports.remove = function(name, id) {
	jobs[name + id].cancel();
	return;
}

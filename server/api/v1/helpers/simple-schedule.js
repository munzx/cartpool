'use strict';


var _ = require('lodash'),
schedule = require('node-schedule'),
jobs = {};



module.exports.add = function(date, name, id, fn) {
	if(jobs[name + id]){
		jobs[name + id].cancel();
	}
	jobs[name + id] = schedule.scheduleJob(date , fn);
	return;
}

module.exports.remove = function(name, id) {
	if(jobs[name + id]){
		jobs[name + id].cancel();
	}
	return;
}

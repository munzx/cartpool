'use strict';
var fs = require('fs'), jwt = require('jsonwebtoken'), simpleJWT, userModlePath, users;

simpleJWT = function(config) {
	return new init(config);
}

function init(config) {
	var self = this;
	if(!config) throw Error('Configurations not set');
	if(!config.secret || !config.userModel) throw Error('configurations not set');
	self.secret = config.secret;
	self.userModlePath = process.cwd() + config.userModel + '.js';
	if(!fs.existsSync(self.userModlePath)) throw Error('User model has not been found in defined path');

	return function(req, res, next) {
		self.usersModel = require(self.userModlePath);
		self.req = req;
		req.jwt = self;
		next();
	}
}

init.prototype = {
	auth: function(userInfo, cb) {
		var self = this;
		if(!userInfo){
			cb('User credentials are required');
		} else {
			if(!userInfo.email || !userInfo.password){
				cb('Access credentials is required');
			} else {
				self.usersModel.findOne({email: userInfo.email.toLowerCase()}, function(err, resultInfo){
					if(err){
						cb(err);
					} else {
						if(resultInfo){
							resultInfo.comparePasswords(userInfo.password, function (err, isMatch) {
								if(err) cb(err);
								if(isMatch){
									self.req.user = resultInfo;
									self.req.token = jwt.sign({
										user: self.req.user,
									}, self.secret, {
										expiresInMinutes: 120
									});
									cb(null, {
										user: self.req.user,
										token: self.req.token
									});
								} else {
									cb('Wrong credentials');
								}
							});
						} else {
							cb('User Not Found');
						}
					}
				});
			}
		}
	},
	verify: function(cb) {
		var self = this;
		var token = self.req.body.token || self.req.query.token || self.req.headers['x-access-token'];
		if(!token){ 
			cb('No token provided');
		} else {
			jwt.verify(token, self.secret, function(err, decoded) {
				if(err){
					cb(err);
				} else {
					self.req.user = decoded.user;
					cb(null, decoded);
				}
			});
		}
	}
}

simpleJWT.prototype = init.prototype;
module.exports = simpleJWT;
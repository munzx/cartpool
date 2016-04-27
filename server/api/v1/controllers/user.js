'use strict';

// Depnedencies
var mongoose = require('mongoose'),
ObjectId = mongoose.Types.ObjectId,
errorHandler = require('./error'),
lookup = require('country-data').lookup,
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
users = require('../models/user'),
products = require('../models/product');

// get all users
module.exports.index = function (req, res, next){
	users.find({}, {password: 0}).where('role').ne('admin').exec(function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

module.exports.getUserById = function(req, res, next) {
	async.waterfall([
		function getUser(cb) {
			users.findById(req.params.id).exec(function(err, userInfo) {
				if(err){
					cb(err);
				} else if(!userInfo) {
					cb('User not found');
				} else {
					cb(null, userInfo);
				}
			});
		},
		function getPorducts(userInfo, cb) {
			products.find({'orders.user': userInfo._id}).populate('orders.user').exec(function(err, result) {
				if(err){
					cb(err);
				} else {
					var ordersInfo = [];
						_.map(result, function(product) {
							 _.map(product.orders, function(order) {
							 	if(order.user._id.toString() == userInfo._id.toString()){
									ordersInfo.push({
										name: product.name,
										initialPrice: product.initialPrice,
										currentPrice: product.currentPrice,
										qty: order.quantity,
										customer: order.user.firstName  + ' ' + order.user.lastName,
										email: order.user.email,
										mobilePhone: order.user.mobilePhone,
										created: product.created
									});							 		
							 	}
						});
					});
					cb(null, ordersInfo);
				}
			});
		}
	], function(err, userOrders) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(userOrders);
		}
	});
}

module.exports.getUserOwnOrders = function(req, res, next) {
	async.waterfall([
		function getUser(cb) {
			users.findById(req.user._id).exec(function(err, userInfo) {
				if(err){
					cb(err);
				} else if(!userInfo) {
					cb('User not found');
				} else {
					cb(null, userInfo);
				}
			});
		},
		function getPorducts(userInfo, cb) {
			products.find({'orders.user': userInfo._id}).populate('orders.user').exec(function(err, result) {
				if(err){
					cb(err);
				} else {
					var ordersInfo = [];
						_.map(result, function(product) {
							 _.map(product.orders, function(order) {
							 	if(order.user._id.toString() == userInfo._id.toString()){
									ordersInfo.push({
										userID: userInfo._id,
										productID: product._id,
										inStore: product.inStore,
										name: product.name,
										initialPrice: product.initialPrice,
										currentPrice: product.currentPrice,
										qty: order.quantity,
										customer: order.user.firstName  + ' ' + order.user.lastName,
										email: order.user.email,
										mobilePhone: order.user.mobilePhone,
										created: product.created
									});							 		
							 	}
						});
					});
					cb(null, ordersInfo);
				}
			});
		}
	], function(err, userOrders) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(userOrders);
		}
	});
}

module.exports.getUserByEmail = function(req, res, next) {
	users.find({email: req.params.email, role: 'customer'}, function(err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(result.length == 0){
			res.status(500).jsonp({message: 'User has not been found'});
		} else {
			var userInfo = {
				"_id": result[0]._id,
				firstName: result[0].firstName,
				lastName: result[0].lastName,
				email: result[0].email
			}

			res.status(200).jsonp(userInfo);
		}
	});
}


// create a new user
module.exports.create = function(req, res){
	var user = new users(),
		userInfo = _.extend(user, req.body.userInfo);

	userInfo.save(function(err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

//update user by id
module.exports.update = function(req, res){
	users.findOne({_id: req.user._id}, function (err, userInfo) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(userInfo) {
			var newInfo = {};
			if(req.body.info.mobilePhone){
				newInfo.mobilePhone = req.body.info.mobilePhone;
			}

			if(req.body.info.email){
				newInfo.email = req.body.info.email;
			}

			if(req.body.info.gender){
				newInfo.gender = req.body.info.gender;
			}

			if(req.body.info.birthdate){
				newInfo.birthdate = new Date(req.body.info.birthdate);
			}

			var saveInfo = function () {
				var newUserInfo = _.extend(userInfo, newInfo);
				newUserInfo.save(function (err, result) {
					if(err){
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else {
						res.status(200).jsonp(result);
					}
				});
			}

			if(req.body.info.newPassowrd){
				userInfo.comparePasswords(req.body.info.currentPassowrd, function (err, isMatch) {
					if(isMatch){
						newInfo.password = req.body.info.newPassowrd;
						saveInfo();
					} else {
						res.status(500).jsonp({message: 'Current password is not correct'});
					}
				});
			} else {
				saveInfo();
			}
		} else {
			res.status(500).jsonp({message: 'User not found'});
		}
	});
}
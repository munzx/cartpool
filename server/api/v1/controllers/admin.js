'use strict';

// Depnedencies
var mongoose = require('mongoose'),
errorHandler = require('./error'),
fs = require('fs'),
async = require("async"),
_ = require('lodash'),
moment = require('moment'),
products = require('../models/product'),
users = require('../models/user');

module.exports.createFirst = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else if(user.length > 0){
			res.status(200).jsonp('Admin Exists');
		} else {
			var newUser = new users({
				firstName: 'munzir',
				lastName: 'suliman',
				name: 'moeAdmin',
				role: 'admin',
				email: 'munzir.suliman@outlook.com',
				password: 'Dubai@123'
			});

			newUser.save(function(err, user){
				if(err){
					res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
				} else {
					res.status(200).jsonp(user);
				}
			});
		}
	});
}


module.exports.index = function (req, res) {
	users.find({role: 'admin'}, {password: 0}, function (err, user){
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(user);
		}
	});
}

module.exports.fullReport = function(req, res, next) {
	async.waterfall([
		function getProducts(cb){
			var info = {};
			products.find().populate('orders.user').exec(function(err, products) {
				if(err){
					cb(err);
				} else {
					info.totalProducts = products.length;
					cb(null, info, products);
				}
			});
		},
		function build(info, allProducts, cb) {
			info.totalOrders = 0;
			info.totalOrdersQty = 0;
			info.bestPriceUnlocked = 0;
			info.bestPriceLocked = 0;
			info.failed = 0;
			info.onGoing = 0;
			info.dates = {};

			info.gender = {};
			info.gender['male'] = 0;
			info.gender['female'] = 0;
			info.gender['undefined'] = 0;

			info.age = {};
			info.age['undefined'] = 0;
			info.age['less than 18'] = 0;
			info.age['18-21'] = 0;
			info.age['22-28'] = 0;
			info.age['29-39'] = 0;
			info.age['40+'] = 0;

			info.totalCustomers = 0;

			_.map(allProducts, function(product) {
				info.totalOrders += product.orders.length;
				info.totalOrdersQty += product.totalOrdersQty;
				info.totalCustomers += _.unique(product.orders, function(order) {
					return order.user.email;
				}).length;

				info.dates = _.chain(product.orders)
				.countBy(function(orderInfo) {
					return moment(orderInfo.created).format('DD-MM-YYYY');
				}).defaults(info.dates).value();


				if(product.closed && product.totalOrdersQty >= 5 && product.percentageToLowestPrice == 100){
					info.bestPriceUnlocked++;
				} else if(product.closed && product.totalOrdersQty >= 5 && product.percentageToLowestPrice < 100){
					info.bestPriceLocked++;
				} else if(product.closed && product.totalOrdersQty < 5){
					info.failed++;
				} else if(product.closed == false){
					info.onGoing++;
				}

				_.map(product.orders, function(orderInfo) {
					switch(orderInfo.user.gender.toLowerCase()){
						case 'male':
							info.gender['male']++;
							break;
						case 'female':
							info.gender['female']++;
							break;
						default:
							info.gender['undefined']++;
					}

					if(!orderInfo.user.birthdate){
						info.age['undefined']++;
					} else if(moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(18, 'year'))){
						info.age['less than 18']++;
					} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(21, 'year'))){
						info.age['18-21']++;
					} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(28, 'year'))){
						info.age['22-28']++;
					} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(39, 'year'))){
						info.age['29-39']++;
					} else {
						info.age['40+']++
					}
				});
			});
			cb(null, info);
		},
		function getUsers(info, cb) {
			users.find({role: 'customer'}, function(err, result) {
				if(err){
					cb(err);
				} else {
					info.totalUsers = result.length;
					cb(null, info)
				}
			});
		}
	
	], function(err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});
}


module.exports.singleProductReport = function(req, res, next) {
	async.waterfall([
		function check(cb) {
			if(req.params.id){
				cb(null);
			} else {
				cb('Id is required');
			}
		},
		function getProduct(cb){
			var info = {};
			products.findById(req.params.id).populate('orders.user').exec(function(err, productInfo) {
				if(err){
					cb(err);
				} else {
					cb(null, info, productInfo);
				}
			});
		},
		function build(info, productInfo, cb) {
			info.totalOrders = 0;
			info.totalOrdersQty = 0;
			info.dates = {};

			info.gender = {};
			info.gender['male'] = 0;
			info.gender['female'] = 0;
			info.gender['undefined'] = 0;

			info.age = {};
			info.age['undefined'] = 0;
			info.age['less than 18'] = 0;
			info.age['18-21'] = 0;
			info.age['22-28'] = 0;
			info.age['29-39'] = 0;
			info.age['40+'] = 0;

			info.totalOrders += productInfo.orders.length;
			info.totalOrdersQty += productInfo.totalOrdersQty;

			info.dates = _.chain(productInfo.orders)
			.countBy(function(orderInfo) {
				return moment(orderInfo.created).format('DD-MM-YYYY');
			}).value();

			_.map(productInfo.orders, function(orderInfo) {
				switch(orderInfo.user.gender.toLowerCase()){
					case 'male':
						info.gender['male']++;
						break;
					case 'female':
						info.gender['female']++;
						break;
					default:
						info.gender['undefined']++;
				}

				if(!orderInfo.user.birthdate){
					info.age['undefined']++;
				} else if(moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(18, 'year'))){
					info.age['less than 18']++;
				} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(21, 'year'))){
					info.age['18-21']++;
				} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(28, 'year'))){
					info.age['22-28']++;
				} else if( moment(orderInfo.user.birthdate).isBefore(moment(new Date).subtract(39, 'year'))){
					info.age['29-39']++;
				} else {
					info.age['40+']++
				}
			});

			cb(null, info);
		}
	], function(err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});
}
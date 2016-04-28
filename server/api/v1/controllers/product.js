'use strict';


var products = require('../models/product'),
fs = require('fs'),
async = require('async'),
users = require('../models/user'),
errorHandler = require('./error'),
_ = require('lodash'),
schedule = require('../helpers/simple-schedule'),
moment = require('moment'),
json2csv = require('json2csv'),
validator = require('validator');


module.exports.index = function(req, res, next) {
	products.find().populate('orders').sort('-created').exec(function(err, products) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(products);
		}
	});
}

module.exports.create = function(req, res, next) {
	var newProduct,
	getProduct = products,
	productInfo = req.body.productInfo,
	base64Data, dest, imageData, imageName, image;

	async.waterfall([
		function saveImage(cb) {
			if(productInfo.image){
				//Get the image
				base64Data = "";
				dest = 'public/uploads/';
				image = productInfo.image;
				imageData = image.replace(/^data:image\/\w+;base64,/, "");

				function getNewName () {
					return req.user._id + Math.floor(new Date() / 1000) + '.jpg';
				}
				imageName = getNewName();

				fs.writeFile(dest + imageName, imageData, 'base64', function(err) {
					if(err){
						cb(err);
					} else {
						cb(null, dest + imageName);
					}
				});
			} else {
				cb('Product image is required');
			}
		},
		function saveProduct(imageLink, cb) {
			//replace the req.body.productInfo.image data with the image link
			productInfo.image = imageLink;
			productInfo.currentPrice = productInfo.initialPrice;
			newProduct = new products();
			productInfo = _.extend(newProduct, productInfo);

			productInfo.save(function(err, result) {
				if(err){
					cb(err);
				} else {
					cb(null, result);
				}
			});
		},
		function sceduleEvent(result, cb){
			schedule.add(productInfo.openUntil, 'product', productInfo._id, function() {
				getProduct.findOneAndUpdate({_id: productInfo._id}, {closed: true}, {new: true}, function(err, result) {
					if(err){
						console.log(err);
					} else {
						req.feeds.emit('product.update', result);
					}
				});
			});
			cb(null, result);
		},
		function socketIO(result, cb) {
			req.feeds.emit('product.add', result);
			cb(null, result);
		}
	], function(err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});
}

module.exports.reset = function(req, res, next) {
	var getProduct = products;
	if(req.params.id){
		products.findById(req.params.id, function(err, productInfo) {
			if(err){
				res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
			} else {
				productInfo.orders = [];
				productInfo.availiable += productInfo.totalOrdersQty;
				productInfo.totalOrdersQty = 0;
				productInfo.currentPrice = productInfo.initialPrice;
				productInfo.timerStarted = false;
				productInfo.startTime = null;
				productInfo.closed = false;
				productInfo.openUntil = moment().add('minutes', 10).format();
				productInfo.percentageToLowestPrice = '100';

				productInfo.save(function(err, result) {
					if(err){
						res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
					} else {
						res.status(200).jsonp(result);
						req.feeds.emit('product.update', result);
						schedule.add(productInfo.openUntil, 'product', productInfo._id, function() {
							getProduct.findOneAndUpdate({_id: productInfo._id}, {closed: true}, {new: true}, function(err, result) {
								if(err){
									console.log(err);
								} else {
									req.feeds.emit('product.update', result);
								}
							});
						});
					}
				});
			}
		});
	} else {
		res.status(500).jsonp({message: 'Please provide the product ID'});
	}
}

module.exports.remove = function(req, res, next) {
	if(req.params.id){
		products.findById(req.params.id).remove().exec(function(err, result) {
			if(err){
				res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
			} else {
				schedule.remove('product', req.params.id);
				res.status(200).jsonp('product has been removed successfully');
			}
		});
	} else {
		res.status(500).jsonp({message: 'Please provide the product ID'});
	}
}

module.exports.orders = function(req, res, next) {
	products.find().populate('orders').sort('-created').populate('orders.user').exec(function(err, products) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			var ordersInfo = [];
				_.map(products, function(product) {
					 _.map(product.orders, function(order) {
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
				});
			});
			res.status(200).jsonp(ordersInfo);
		}
	});
}

module.exports.productOrders = function(req, res, next) {
	if(req.params.id){
		products.findById(req.params.id).populate('orders.user').exec(function(err, productInfo) {
			if(err){
				res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
			} else {
				res.status(200).jsonp(productInfo);
			}
		});
	} else {
		res.status(500).jsonp({message: 'Please provide the product ID'});
	}
}

module.exports.placeOrder = function(req, res, next) {
	var getProduct = products;
	async.waterfall([
		function checInfo(cb) {
			if(!req.params.id || (req.body.orderInfo == undefined) ){
				cb('Product id and order information is required');
			} else {
				cb(null);
			}
		},
		function findUser(cb) { //we check for the user here to go around mongoose wierd behaviour of not validating sub-decuments
			users.findById(req.user._id, function(err, userInfo) {
				if(err){
					cb(err);
				} else {
					req.body.orderInfo.user = userInfo._id;
					cb(null);
				}
			});
		},
		function findProductAndPlaceOrder(cb) {
			var price, orderInfo = req.body.orderInfo, base, percentage5, deductedAmount, lowestDeductableValue;
			products.findById(req.params.id, function(err, productInfo) {
				if(err){
					cb(err);
				} else {
					if(orderInfo.quantity <= productInfo.availiable){ //check if the order quantity is provided and if its availiable
						base = productInfo.initialPrice / 5;
						percentage5 = base / 5;
						productInfo.totalOrdersQty += orderInfo.quantity;
						productInfo.availiable -= orderInfo.quantity;
						lowestDeductableValue = ((percentage5 * productInfo.initialPrice) / 100);

						switch(true){
							case (productInfo.totalOrdersQty < 5):
								productInfo.currentPrice = productInfo.initialPrice;
								break;
							case (productInfo.totalOrdersQty == 5):
								productInfo.currentPrice = productInfo.initialPrice - base;
								productInfo.percentageToLowestPrice = Math.floor(((productInfo.initialPrice - productInfo.currentPrice) / (productInfo.initialPrice - productInfo.lowestPrice)) * 100);
								break;
							case (productInfo.totalOrdersQty > 5):
								deductedAmount = productInfo.initialPrice - ((percentage5 - productInfo.totalOrdersQty) * productInfo.totalOrdersQty);
								productInfo.currentPrice = ((productInfo.currentPrice != productInfo.lowestPrice) && (deductedAmount > productInfo.lowestPrice) && ((productInfo.totalOrdersQty / 2) <= percentage5))? deductedAmount: productInfo.lowestPrice;
								productInfo.percentageToLowestPrice = Math.floor(((productInfo.initialPrice - productInfo.currentPrice) / (productInfo.initialPrice - productInfo.lowestPrice)) * 100);
								break;
						}

						if(productInfo.currentPrice == productInfo.lowestPrice && productInfo.timerStarted == false){
							productInfo.timerStarted = true;
							productInfo.startTime = moment(new Date());
						}

						productInfo.orders.push(orderInfo);
						productInfo.save(function(err, result) {
							if(err){
								cb(err);
							} else {
								cb(null, productInfo, result);
							}
						});
					} else {
						cb('The order quantity is not availiable');
					}
				}
			});
		},
		function scheduleEvent(productInfo, savedProductResult, cb) {
			//close the order after a the specified period if the current price hits the lowest allowed price
			if(savedProductResult.timerStarted){
				schedule.add(moment().add(productInfo.minutesToClose, 'minutes').format(), 'product', productInfo._id, function() {
					getProduct.findOneAndUpdate({_id: productInfo._id}, {closed: true}, {new: true}, function(err, result) {
						if(err){
							console.log(err);
						} else {
							req.feeds.emit('product.update', result);
						}
					});
				});
			}
			cb(null, savedProductResult);
		},
		function socketIO(savedProductResult, cb){
			req.feeds.emit('product.update', savedProductResult);
			cb(null, savedProductResult);
		}
	], function(err, result) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.status(200).jsonp(result);
		}
	});

}

module.exports.csv = function(req, res, next) {
	async.waterfall([
		function getProducts(cb) {
			products.find().populate('orders').sort('-created').populate('orders.user').exec(function(err, products) {
				if(err){
					cb(err);
				} else {
					var ordersInfo = [];
						_.map(products, function(product) {
							 _.map(product.orders, function(order) {
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
						});
					});
					cb(null, ordersInfo);
				}
			});
		},
		function makeCsv(allOrders, cb) {
			var fields = [
					{
						label: 'Product',
						value: function(row) {
							return row.name;
						},
						default: 'NULL'
					},
					{
						label: 'Price',
						value: function(row) {
							return row.currentPrice;
						},
						default: 'NULL'
					},
					{
						label: 'QTY',
						value: function(row) {
							return row.qty;
						},
						default: 'NULL'
					},
					{
						label: 'customer',
						value: function(row) {
							return row.customer;
						},
						default: 'NULL'
					},
					{
						label: 'Email',
						value: function(row) {
							return row.email;
						},
						default: 'NULL'
					},
					{
						label: 'Mobile Phone',
						value: function(row) {
							return row.allOrders;
						},
						default: 'NULL'
					},
					{
						label: 'Date',
						value: function(row) {
							return moment(row.created).format('MMMM Do YYYY, h:mm:ss a');
						},
						default: 'NULL'
					}
				];

				json2csv({ data: allOrders, fields: fields}, function(err, csv) {
					if (err){
						cb(err);
					} else {
						cb(null, csv);
					}
				});
		},
		function write(result, cb) {
			fs.writeFile('file.csv', result, function(err) {
				if(err){
					cb(err);
				} else {
					cb(null)
				}
			});
		}
	], function(err, file) {
		if(err){
			res.status(500).jsonp({message: errorHandler.getErrorMessage(err)});
		} else {
			res.download('file.csv');
		}
	});
}
'use strict';

var express = require('express');
var router = express.Router();
var version = express.Router();
var config = require(process.env.CONFIG_PATH);

//Dependencies
var multer = require('multer'),
storage = multer.diskStorage({
	destination: 'uploads/',
	filename: function(req, file, cb){
		cb(null, Date.now() + '-' + file.originalname);
	}
});
var upload = multer({ storage: storage});

//controllers
var admins = require('./controllers/admin');
var users = require('./controllers/user');
var products = require('./controllers/product');


//authinticate
function authenticate(req, res, next) {
	req.jwt.auth(req.body, function(err, result) {
		if(err){
			res.status(403).json('Access Denied');
		} else {
			res.status(200).json(result);
		}
	});
}

//check if the user is authinticated
function ensureAuthenticated(req, res, next) {
	req.jwt.verify(function(err, result) {
		if(err){
			res.status(403).json('Access Denied');
		} else {
			next();
		}
	});
}

//check if the user role is admin
function isAdmin(req, res, next){
	if(req.user){
		if(req.user.role === 'admin'){
			next();
		} else {
			res.status(403).json('Access Denied');
		}
	} else {
		res.status(403).json('Access Denied');
	}
}

//check if the user role is user
//grant the admin an access to any of the user route/controller
function isUser(req, res, next){
	if(req.user){
		if(req.user.role === 'customer' || req.user.role === 'admin'){
			next();
		} else {
			res.status(403).json('Access Denied');
		}
	} else {
		res.status(403).json('Access Denied');
	}
}

function isGuest(req, res, next) {
	req.jwt.verify(function(err, result) {
		if(err){
			next();
		} else {
			res.status(403).json('Already signed in');
		}
	});
}
	
//Check login credentials
router.post('/login', authenticate);

//Logout
router.get('/logout', function(req, res){
	res.status(200).json('logged out');
});

//check if user is logged in
router.get('/check', isUser, function(req, res){
	res.status(200).json('logged in');
});

router
//admin
.get('/admin/first', admins.createFirst)
.get('/admin', ensureAuthenticated, isAdmin, admins.index)
.get('/admin/report', admins.fullReport)
.get('/admin/report/product/:id', admins.singleProductReport)
//users
.get('/user', ensureAuthenticated, isAdmin, users.index)
.post('/user/admin/create', isAdmin, users.create)
.post('/user', isGuest, users.create)
.put('/user', ensureAuthenticated, isUser, users.update)
.get('/user/email/:email', ensureAuthenticated, users.getUserByEmail)
.get('/user/id/:id', ensureAuthenticated, users.getUserById)
.get('/user/orders', ensureAuthenticated, isUser, users.getUserOwnOrders)
//products
.get('/product', products.index)
.post('/product', ensureAuthenticated, isAdmin, products.create)
.get('/product/csv', ensureAuthenticated, isAdmin, products.csv)
.get('/product/reset/:id', ensureAuthenticated, isAdmin, products.reset)
.delete('/product/:id', ensureAuthenticated, isAdmin, products.remove)
//orders
.get('/product/orders', ensureAuthenticated, isAdmin, products.orders)
.get('/product/order/:id', ensureAuthenticated, isAdmin, products.productOrders)
.post('/product/order/:id', ensureAuthenticated, isUser, products.placeOrder)
//test zone
.get('/test', function(req, res, next) {
	res.status(200).jsonp(req.user);
});

//A prefix to indicate the api version
version.use('/v1', router);

module.exports = version;

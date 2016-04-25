var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var helmet = require('helmet');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var i18n = require('i18n-2');
var mongoose = require('mongoose');

//Root Path
process.env.PWD = process.cwd();
//root to server config file , it must be declared before the routes
process.env.CONFIG_PATH = process.env.PWD + '/server/config';


module.exports = function (app, io) {
	//Require Config file
	var config = require(process.env.CONFIG_PATH);
	//Routes files are required here
	var homePage = require(__dirname + '/server/index');
	var api = require(config.api)(app, io);

	console.log('Bism Allah, here is ' + config.getEnvInfo().app.title);

	//Connect to mongoDB
	mongoose.connect(config.getEnvInfo().db);

	//check if mongodb is connected otherwise throw an error
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection Error:'));

	//use compression
	app.use(compression());

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');


	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.disable('x-powered-by');
	app.disable('case sensitive routing');
	app.enable('strict routing');
	app.use(logger('dev'));
	//for security!
	app.use(helmet());
	//use middlewears
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
	app.use(methodOverride()); //read about this
	app.use(config.auth.jwt({
		userModel: '/server/api/v1/models/user',
		secret: 'server secret'
	}));

	// Translation
	i18n.expressBind(app, {
		directory: __dirname + '/server/locales/',
		locales: ['ar', 'en'],
		defaultLocale: 'ar'
	});

	//set the default lanugnage
	app.use(function(req, res, next) {
		req.i18n.setLocale('ar');
		next();
	});

	//Allow cross origin requests
	app.all('/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});

	//Publically accessable folders
	app.use('/public', express.static(path.join(__dirname, 'public')));
	app.use('/asset', express.static(path.join(__dirname, 'bower_components')));

	//Routes
	//home page
	app.use('/', homePage);
	//Api
	app.use('/api', api);
	//if the api enfd-point has not been found i.e api 404
	app.use('/api/*', function(req, res){
		res.status(404).jsonp('API End-Point Not Found');
	});
	//404 Route/Page has not been found
	//it reloads the home page and pass the URL path to it and there
	//either the corrospanding page or the 404 not found page will be served
	app.use(function (req, res) {
		res.render('../public/modules/config/view/index', {
			userInfo: req.user,
			query: {}
		});
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
			message: err.message,
			error: err,
			title: 'Error'
			});
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {},
			title: 'Error'
		});
	});

	return app;
}

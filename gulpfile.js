// Dependencies
var gulp = require('gulp'),
_jshint = require('gulp-jshint'),
_concat = require('gulp-concat'),
_uglify = require('gulp-uglify'),
_plumber = require('gulp-plumber'),
_nodemon = require('gulp-nodemon'),
_browserSync = require('browser-sync'),
_autoprefixer = require('gulp-autoprefixer'),
_cssMinify = require('gulp-minify-css'),
_less = require('gulp-less'),
_rename = require('gulp-rename'),
_reload = _browserSync.reload;

//On error
function onError(err) {
	console.log(err);
}

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 1000;

// Path
var path = {
	htmlFiles: ['views/*.*'],
	serverRoutes: ['server/api/*.js', 'server/api/*/*.js'],
	serverApp: ['app.js'],
	desFolder: 'public/dest/',
	devFolder: 'public/dev/',
	jsFiles: ['public/js/**.js', 'public/modules/**.js', 'public/modules/*/*.js', 'public/modules/*/*/*.js', 'public/modules/*/*/*.*.js'],
	cssFiles: ['public/css/**.css', 'public/modules/*/*.css', 'public/modules/*/*/*.css'],
	server: {
		baseDir: './',
		index: 'views/index.ejs',
		specs: './app/tests/'
	}
}

// Run _JShint against files to make sense of errors if existed
gulp.task('inspect', function () {
	return gulp.src(path.jsFiles)
	.pipe(_plumber())
	.pipe(_jshint())
	.pipe(_jshint.reporter('default'));
});

// _Concat, _uglify, compact then save the minified JS files
gulp.task('minifyJS', function () {
	return gulp.src(path.jsFiles)
	.pipe(_plumber())
	.pipe(_uglify())
	.pipe(_concat('app.min.js'))
	.pipe(_rename('app.min.js'))
	.pipe(gulp.dest(path.desFolder));
});

// Desvelopment : _Concat, compact then save the JS files
gulp.task('DevMinifyJS', function () {
	return gulp.src(path.jsFiles)
	.pipe(_plumber())
	.pipe(_concat('app.js'))
	.pipe(_rename('app.js'))
	.pipe(gulp.dest(path.devFolder));
});

gulp.task('minifyCSS', function () {
	return gulp.src(path.cssFiles)
	.pipe(_plumber())
	.pipe(_autoprefixer('last 10 versions'))
	.pipe(_concat('app.css'))
	.pipe(_cssMinify())
	.pipe(_rename('app.min.css'))
	.pipe(gulp.dest(path.desFolder));
});

// Build files
gulp.task('build', ['inspect', 'DevMinifyJS', 'minifyJS', 'minifyCSS'], _reload);

//HTML reload
gulp.task('HtmlReload', _reload);

//Nodemon , to reload on server files change
gulp.task('nodemon', function (cb) {
	var started = false;
	return _nodemon({
		script: 'bin/www',
		watch: path.serverApp.concat(path.serverRoutes)
	}).on('start', function () {
		if(!started){
			cb();
			started = true;
		}
	}).on('restart', function () {
		setTimeout(function(){
			_reload();
		}, BROWSER_SYNC_RELOAD_DELAY);
	});
});

// Watch change
gulp.task('watch', function () {
	gulp.watch(path.htmlFiles, ['HtmlReload']);
	gulp.watch(path.jsFiles, ['build']);
	gulp.watch(path.cssFiles, ['build']);
});

//Start server
gulp.task('serve', ['nodemon'], function(){
	_browserSync.init({
		proxy: "localhost:3000",
		port: '4000'
	});
});

// Start the default task
gulp.task('default', ['watch', 'serve']);
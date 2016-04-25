//initilize feeds , this expects i18n2 to be installed and binded to expressJS

var routes = require('./routes');

module.exports = function (app, io) {
	require('./helpers/feed.builder.js')(app, io);
	return routes;
};
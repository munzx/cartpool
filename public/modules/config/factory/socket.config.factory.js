'use strict';

angular.module('cartpool').factory('socketConfigFactory', ['socketFactory', function (socketFactory) {
	return socketFactory();
}]);
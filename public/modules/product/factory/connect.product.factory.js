'use strict';


angular.module('productModule').factory('connectProductFactory', ['$resource', function($resource) {
	return $resource('api/v1/product/:action/:id');
}]);
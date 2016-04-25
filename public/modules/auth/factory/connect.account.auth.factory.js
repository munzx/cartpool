'use strict';

angular.module('authModule').factory('connectAccountAuthFactory', ['$resource', function ($resource) {
	return $resource('api/v1/account/:action/:id');
}]);
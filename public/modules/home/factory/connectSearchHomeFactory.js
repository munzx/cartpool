'use strict';

angular.module('homeModule').factory('connectSearchHomeFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/search/:target/:name' ,{target: "@target" ,name: "@name"});
}]);
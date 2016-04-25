'use strict';

angular.module('authModule').factory('connectAuthFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/user/:action/:byUserName/:id',
		{
			name: "@byUserName",
			action: "@action",
			id: "@id"
		},
		{
			"update": {
				method:"PUT"
			}
		});
}]);
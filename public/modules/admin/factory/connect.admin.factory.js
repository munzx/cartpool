'use strict';

angular.module('adminModule').factory('connectAdminFactory', ['$resource', function($resource) {
	return $resource('/api/v1/admin/:id/:action/:subid/:subaction',
		{
			id: "@id",
			action: "@action",
			subid: "@subid",
			subaction: "@subaction"
		},
		{
			"update": {
				method: "PUT"
			}
		});
}]);
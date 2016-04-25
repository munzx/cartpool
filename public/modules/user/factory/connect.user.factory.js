'use strict';

angular.module('userModule').factory('connectUserFactory', ['$resource', function ($resource) {
	return $resource('/api/v1/user/:id/:action/:byUserName/:subId',
		{
			name: "@byUserName",
			action: "@action",
			id: "@id",
			subId: "@subId"
		},
		{
			"update": {
				method:"PUT"
			}
		});
}]);
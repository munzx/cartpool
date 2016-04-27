'use strict';


angular.module('userModule').controller('orderUserController', ['$scope', 'connectUserFactory', function($scope, connectUserFactory) {
	$scope.orders = {};
	connectUserFactory.query({action: 'orders'}, function(result) {
		$scope.orders = result;
		console.log(result);
	});
}]);
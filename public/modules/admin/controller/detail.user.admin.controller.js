'use strict';


angular.module('adminModule').controller('detailUserAdminController', ['$scope', 'connectUserFactory', '$stateParams', function($scope, connectUserFactory, $stateParams) {
	$scope.orders = {};
	connectUserFactory.query({'action': 'id', 'subId': $stateParams.id}, function(result) {
		$scope.orders = result;
	});
}]);
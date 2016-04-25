'use strict';


angular.module('adminModule').controller('detailUserAdminController', ['$scope', 'connectUserFactory', '$stateParams', function($scope, connectUserFactory, $stateParams) {
	$scope.info = {};
	$scope.info = {user: {}, event: []};

	connectUserFactory.get({'action': 'id', 'subId': $stateParams.id}, function(result) {
		$scope.info = result;
	});


}]);
'use strict';

angular.module('userModule').controller('indexUserController', ['$scope', 'users', 'connectUserFactory', '$modalInstance', function ($scope, users, connectUserFactory, $modalInstance) {
	//init user role
	$scope.userInfo = {};
	$scope.error = false;

	$scope.createNewUser = function(){
		connectUserFactory.save({}, {'userInfo': $scope.userInfo}, function(response){
			$modalInstance.dismiss('cancel');
			$scope.error = false;
			$scope.userCreated = true;
		}, function(error){
			$scope.error = error.data.message;
		});
	}

	$scope.closeModal = function(){
		$modalInstance.dismiss('cancel');
	}
}]);
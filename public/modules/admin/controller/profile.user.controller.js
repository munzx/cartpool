'use strict';

angular.module('adminModule').controller('profileAdminController', ['$scope', 'connectUserFactory', 'registerUserConfigFactory', '$timeout', function ($scope, connectUserFactory, registerUserConfigFactory, $timeout) {
	$scope.user = registerUserConfigFactory.getUser();

	$scope.pageTitle = $scope.user.firstName + ' ' + $scope.user.lastName

	$scope.profile = {
		email: $scope.user.email,
		mobilePhone: $scope.user.mobilePhone
	}

	$scope.isPasswordValid = function () {
		if($scope.profile.currentPassowrd || $scope.profile.newPassowrd || $scope.profile.repeatedNewPassowrd){
			if(!$scope.profile.currentPassowrd || !$scope.profile.newPassowrd || !$scope.profile.repeatedNewPassowrd){
				return true;
			} else {
				if($scope.profile.newPassowrd !== $scope.profile.repeatedNewPassowrd){
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	}

	$scope.updateProfile = function () {
		connectUserFactory.update({'info': $scope.profile}, function (response) {
			$scope.profile.newPassowrd = '';
			$scope.profile.currentPassowrd = '';
			$scope.profile.repeatedNewPassowrd = '';
			$scope.success = true;
			$scope.error = false;
			$timeout(function () {
				$scope.success = false;
			}, 1500);
		}, function (error) {
			$scope.error = error.data.message;
			console.log(error);
			$timeout(function () {
				$scope.error = false;
			}, 1500);
		});
	}
}]);
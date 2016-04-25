'use strict';

angular.module('adminModule').controller('indexAdminController', ['$scope', 'registerUserConfigFactory', '$state', function($scope, registerUserConfigFactory, $state) {
	$scope.user = registerUserConfigFactory.getUser();
	if(!$scope.user) $state.go('home');
	if($scope.user.role != 'admin') $state.go('home');
}]);
'user strict';

angular.module('authModule').controller('signoutAuthController', ['registerUserConfigFactory', '$http', '$state', function (registerUserConfigFactory, $http, $state) {
	$http.get('/api/v1/logout')
	.success(function (data, success) {
		registerUserConfigFactory.clearUserInfo();
		$state.go('home', {}, {reload: true});
	});
}]);
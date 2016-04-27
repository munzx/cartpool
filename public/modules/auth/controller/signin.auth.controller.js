'user strict';

angular.module('authModule').controller('signinAuthController', ['registerUserConfigFactory', '$scope', '$http', '$location', '$rootScope', function (registerUserConfigFactory, $scope, $http, $location, $rootScope) {
	$scope.signIn = function () {
		$http.post('/api/v1/login', $scope.credentials)
		.success(function (data, success) {
			registerUserConfigFactory.setUser(data);
			if($rootScope.lastPage){
				$location.path($rootScope.lastPage);
			} else {
				if(data.user.role == 'admin'){
					$location.path('/admin/report');
				} else {
					$location.path('/');
				}
			}
		})
		.error(function (data, error) {
			$scope.error = data;
		});
	};
}]);
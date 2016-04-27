'use strict';


angular.module('adminModule').controller('userAdminController', ['$scope', 'connectUserFactory', '$modal', function($scope, connectUserFactory, $modal) {
	connectUserFactory.query(function(users) {
		$scope.users = users;
	}, function(error) {
		$scope.error = error.data.message;
	});

	$scope.addNewUser = function() {
		$modal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'public/modules/admin/view/save.user.admin.view.html',
			controller: ['$scope', 'connectAuthFactory', '$modalInstance', 'connectEventFactory', function($scope, connectAuthFactory, $modalInstance, connectEventFactory) {
				$scope.credentials = {};
				$scope.credentials.events = {};

				connectEventFactory.query(function(response) {
					$scope.events = response;
				});

				$scope.closeModal = function() {
					$modalInstance.dismiss('cancel');
				}

				$scope.save = function() {
					console.log($scope.credentials);
					connectAuthFactory.save({'action': 'admin', 'byUserName': 'create'}, {'userInfo' :$scope.credentials}, function (data, res) {
						$modalInstance.dismiss('cancel');
					},
					function (err) {
						$scope.error = err.data.message;
					});
				}
			}]
		});
	}

}]);
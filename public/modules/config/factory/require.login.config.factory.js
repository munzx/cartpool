'use strict';

angular.module('cartpool').factory('requreLoginConfigFactory', ['$modal', '$rootScope', '$location', function ($modal, $rootScope, $location) {
	return {
		open: function (service) {
			$rootScope.lastPage = $location.path();
			if(!service){
				service = '';
			}
			$modal.open({
				templateUrl: 'public/modules/config/view/require.login.config.view.html',
				size: 'md',
				controller: 'ModalInstanceConfigController'
			});
		}

	}

}]);
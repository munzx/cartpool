'use strict';

angular.module('authModule').directive('externalSourceAuthDirective', ['$modal', function ($modal) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: false,
		link: function (scope ,elem, attrs, ngModel) {
			console.log('Bism Allah, here is the message from external source');
			$modal.open({
				templateUrl: '/auth/facebook'
			});
		}
	}
}]);
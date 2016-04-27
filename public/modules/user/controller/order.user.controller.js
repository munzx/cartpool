'use strict';


angular.module('userModule').controller('orderUserController', ['$scope', 'connectUserFactory', 'socketConfigFactory', function($scope, connectUserFactory, socketConfigFactory) {
	$scope.orders = {};

	function getOrders() {
		connectUserFactory.query({action: 'orders'}, function(result) {
			$scope.orders = result;
			console.log(result);
		});
	}

	//init get orders
	getOrders();

	socketConfigFactory.on('product.update', function (productInfo) {
		getOrders();
	});

}]);
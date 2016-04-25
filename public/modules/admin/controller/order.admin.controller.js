'use strict';


angular.module('adminModule').controller('orderAdminController', ['$scope', 'connectProductFactory', 'socketConfigFactory', 'registerUserConfigFactory', function($scope, connectProductFactory, socketConfigFactory, registerUserConfigFactory) {
	var token = registerUserConfigFactory.getToken();
	function getOrders() {
		connectProductFactory.query({action: 'orders'}, function(response) {
			$scope.orders = response;
		}, function(error) {
			console.log(error);
		});
	}

	$scope.link = function() {
		return '/api/v1/product/csv?token=' + token;
	}

	//init get orders
	getOrders();

	//listen to product add
	socketConfigFactory.on('product.add', function (productInfo) {
		getOrders();
	});

	//listen to product update
	socketConfigFactory.on('product.update', function (productInfo) {
		getOrders();
	});


}]);
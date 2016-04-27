'use strict';


angular.module('adminModule').controller('detailProductAdminController', ['$scope', 'connectProductFactory', '$stateParams', 'connectAdminFactory', function($scope, connectProductFactory, $stateParams, connectAdminFactory) {
	$scope.orders = {};

	connectProductFactory.get({'action': 'order', 'id': $stateParams.id}, function(result) {
		$scope.product = result;
	});

	connectAdminFactory.get({action: 'report', subid: 'product', subaction: $stateParams.id}, function(response) {
		$scope.totalOrders = response.totalOrders;
		$scope.totalOrdersQty = response.totalOrdersQty;

		//females and males
		$scope.doughnutGender = {};
		$scope.doughnutGender.labels = _.keys(response.gender);
		$scope.doughnutGender.data = _.values(response.gender);

		//age range
		$scope.doughnutAge = {};
		$scope.doughnutAge.labels = _.keys(response.age);
		$scope.doughnutAge.data = _.values(response.age);

		//orders dates
		$scope.line = {};
		$scope.line.labels = _.keys(response.dates);
		$scope.line.series = [];
		$scope.line.data =[_.values(response.dates)];
	});

}]);
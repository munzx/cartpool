'use strict';

angular.module('adminModule').controller('reportAdminController', ['$scope', 'connectAdminFactory', function($scope, connectAdminFactory) {
	
	connectAdminFactory.get({action: 'report'}, function(response) {
		$scope.totalProducts = response.totalProducts;
		$scope.totalOrders = response.totalOrders;
		$scope.totalOrdersQty = response.totalOrdersQty;

		//Products:  unlocked , locked, failed
		$scope.bar = {};
		$scope.bar.labels = ['Locked', 'unlocked', 'Failed', 'On Going'];
		$scope.bar.data = [[response.bestPriceLocked, response.bestPriceUnlocked, response.failed, response.onGoing]];

		//Customers to users
		$scope.pie = {};
		$scope.pie.labels = ['Customers', 'Users'];
		$scope.pie.data = [response.totalCustomers, response.totalUsers];

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
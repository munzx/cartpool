'user strict';

angular.module('homeModule').controller('indexHomeController', ['registerUserConfigFactory', '$location', '$scope', 'connectProductFactory', 'socketConfigFactory', function (registerUserConfigFactory, $location, $scope, connectProductFactory, socketConfigFactory) {
	$scope.user = registerUserConfigFactory.getUser();

	connectProductFactory.query(function(response) {
		$scope.products = response;
	}, function(error) {
		console.log(error);
	});


	//listen to product add
	socketConfigFactory.on('product.add', function (productInfo) {
		$scope.products.unshift(productInfo);
	});

	//listen to product update
	socketConfigFactory.on('product.update', function (productInfo) {
		var getIndex = _.findIndex($scope.products, function(product) {
			return product._id == productInfo._id;
		});
		if(getIndex == 0 || getIndex > 0){
			$scope.products[getIndex] = productInfo;
		}
	});


}]);
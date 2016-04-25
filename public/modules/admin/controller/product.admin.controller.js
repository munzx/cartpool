'use strict';


angular.module('adminModule').controller('productAdminController', ['$scope', '$modal', 'connectProductFactory', 'socketConfigFactory', function($scope, $modal, connectProductFactory, socketConfigFactory) {
	
	function getProducts(){
		connectProductFactory.query(function(response) {
			$scope.products = response;
		}, function(error) {
			console.log(error);
		});
	}

	//init get products
	getProducts();

	//listen to product add
	socketConfigFactory.on('product.add', function (productInfo) {
		getProducts();
	});

	//listen to product update
	socketConfigFactory.on('product.update', function (productInfo) {
		getProducts();
	});


	$scope.reset = function(index) {
		connectProductFactory.get({action: 'reset', id: $scope.products[index]._id}, function(response) {
			$scope.products[index] = response;
		}, function(error) {
			console.log(error);
		});
	}


	$scope.addProduct = function() {
		$modal.open({
			size: 'md',
			backdrop: 'static',
			resolve: {
				products: function() {
					return $scope.products;
				}
			},
			templateUrl: 'public/modules/admin/view/save.product.admin.view.html',
			controller: ['$scope', '$modalInstance', 'products', 'connectProductFactory', function($scope, $modalInstance, products, connectProductFactory) {
				$scope.closeModal = function() {
					$modalInstance.dismiss('cancel');
				}

				$scope.save = function() {
					connectProductFactory.save({productInfo: $scope.productInfo}, function(response) {
						products.unshift(response);
						$modalInstance.dismiss('cancel');
					}, function(error) {
						$scope.error = error.data.message;
						console.log(error);
					});
				}

			}]
		});
	}


}]);
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
		$modal.open({
			size: 'sm',
			backdrop: 'static',
			resolve: {
				products: function() {
					return $scope.products;
				},
				index: function() {
					return index;
				}
			},
			templateUrl: 'public/modules/admin/view/message/confirm.reset.product.view.html',
			controller: ['$scope', 'products', 'index', '$modalInstance', 'connectProductFactory', function($scope, products, index, $modalInstance, connectProductFactory) {
				$scope.product = products[index];
				$scope.closeModal = function() {
					$modalInstance.dismiss('cancel');
				}
				$scope.yes = function() {
					connectProductFactory.get({action: 'reset', id: $scope.product._id}, function(response) {
						$modalInstance.dismiss('cancel');
					}, function(error) {
						console.log(error);
						$modalInstance.dismiss('cancel');
					});
				}
				$scope.no = function() {
					$modalInstance.dismiss('cancel');
				}
			}]
		});
	}

	$scope.remove = function(index) {
		$modal.open({
			size: 'sm',
			backdrop: 'static',
			resolve: {
				products: function() {
					return $scope.products;
				},
				index: function() {
					return index;
				}
			},
			templateUrl: 'public/modules/admin/view/message/confirm.remove.product.view.html',
			controller: ['$scope', 'products', 'index', '$modalInstance', 'connectProductFactory', function($scope, products, index, $modalInstance, connectProductFactory) {
				$scope.product = products[index];
				$scope.closeModal = function() {
					$modalInstance.dismiss('cancel');
				}
				$scope.yes = function() {
					connectProductFactory.remove({id: $scope.product._id}, function(response) {
						products.splice(index, 1);
						$modalInstance.dismiss('cancel');
					}, function(error) {
						$modalInstance.dismiss('cancel');
						console.log(error);
					});	
				}
				$scope.no = function() {
					$modalInstance.dismiss('cancel');
				}
			}]
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
				$scope.productInfo = {};

				$scope.closeModal = function() {
					$modalInstance.dismiss('cancel');
				}

				$scope.checkMin = function() {
					if($scope.productInfo.initialPrice){
						return $scope.productInfo.initialPrice;
					}
				}

				$scope.checkMax = function() {
					if($scope.productInfo.lowestPrice){
						return $scope.productInfo.lowestPrice;
					}
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
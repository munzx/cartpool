'use strict';


angular.module('productModule').directive('showProductDirective', ['$modal', function($modal) {
	return {
		templateUrl: 'public/modules/product/view/show.product.directive.view.html',
		restrict: 'A',
		replace: true,
		transclude: true,
		scope: {
			"product": "=showProductDirective"
		},
		link: function(scope, elem, attrs) {
			var product = scope.product;
			scope.product.name = product.name;
			scope.disableOrders = false;

			function isTtimePassed(time) {
				return moment(time).isBefore(moment());
			}

			function minutesToClose(minutes) {
				return moment(moment(product.startTime).add(minutes, 'minutes')).format();
			}

			scope.$watch('product', function (value) {
				product = value;
				scope.openLessThan5 = function() {
					return (product.availiable > 0 && isTtimePassed(product.openUntil) == false && product.totalOrdersQty < 5)? true: false;
				}

				scope.closedLessThan5 = function() {
					if(product.availiable > 0 && isTtimePassed(product.openUntil) == true && product.totalOrdersQty < 5){
						scope.disableOrders = true;
						return true;
					} else {
						return false;
					}
				}

				scope.openMoreThan5 = function() {
					return (product.availiable > 0 && product.currentPrice != product.lowestPrice && isTtimePassed(product.openUntil) == false && product.totalOrdersQty >= 5)? true: false;
				}

				scope.openRechedLowesePrice = function() {
					if(product.availiable > 0 && product.currentPrice == product.lowestPrice && isTtimePassed(minutesToClose(product.minutesToClose)) == false){
						scope.closeOrder = minutesToClose(product.minutesToClose);
						return true;
					} else {
						return false;
					}
				}

				scope.closeReachedLowesPrice = function() {
					if(product.availiable > 0 && product.currentPrice == product.lowestPrice && product.totalOrdersQty != 0 && isTtimePassed(minutesToClose(product.minutesToClose)) == true){
						scope.disableOrders = true;
						return true;
					} else {
						return false;
					}
				}

				scope.closedNotReachedLowestPrice = function() {
					if(product.availiable > 0 && product.currentPrice > product.lowestPrice && product.totalOrdersQty >= 5 && isTtimePassed(product.openUntil) == true){
						scope.disableOrders = true;
						return true;
					} else {
						return false;
					}
				}

				scope.order = function() {
					$modal.open({
						size: 'sm',
						backdrop: 'static',
						resolve: {
							product: function() {
								return scope.product;
							}
						},
						templateUrl: 'public/modules/product/view/order.product.directive.view.html',
						controller: ['$scope', '$modalInstance', '$timeout', 'product', '$modal', function($scope, $modalInstance, $timeout, product, $modal) {
							$scope.productInfo = product;

							$scope.closeModal = function() {
								$modalInstance.dismiss('cancel');
							}

							$scope.placeOrder = function() {
								$modal.open({
									size: 'sm',
									backdrop: 'static',
									resolve: {
										productInfo: function() {
											return $scope.productInfo;
										},
										orderInfo: function() {
											return $scope.orderInfo;
										},
										parentModal: function() {
											return $modalInstance;
										}
									},
									templateUrl: 'public/modules/product/view/confirm.order.product.directive.view.html',
									controller: ['$scope', 'orderInfo', '$modalInstance', 'parentModal', 'connectProductFactory', 'productInfo', '$modal', function($scope, orderInfo, $modalInstance, parentModal, connectProductFactory, productInfo, $modal) {
										$scope.orderInfo = orderInfo;
										$scope.productInfo = productInfo;
										$scope.closeModal = function() {
											$modalInstance.dismiss('cancel');
										}

										$scope.no = function() {
											$modalInstance.dismiss('cancel');
											parentModal.dismiss('cancel');
										}

										$scope.yes = function() {
											connectProductFactory.save({action: 'order', id: $scope.productInfo._id}, {orderInfo: $scope.orderInfo}, function(response) {
												$scope.productInfo = response;
												parentModal.dismiss('cancel');
												$modalInstance.dismiss('cancel');
												$modal.open({
													template: "<h4 class='alert alert-success'>Order has been placed successfully</h4>",
													controller: ['$timeout', '$modalInstance', function($timeout, $modalInstance) {
														$timeout(function() {
															$modalInstance.dismiss('class');
														}, 2000);
													}]
												});
											}, function(error) {
												parentModal.dismiss('cancel');
												$modalInstance.dismiss('cancel');
												$modal.open({
													template: "<h4 class='alert alert-danger'>Failed to place order</h4>",
													controller: ['$timeout', '$modalInstance', function($timeout, $modalInstance) {
														$timeout(function() {
															$modalInstance.dismiss('class');
														}, 2000);
													}]
												});
											});
										}
									}]
								});
							}

						}]
					});
				}
			});
		}
	}
}]);
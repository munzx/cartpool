'use strict';

// intitiate the app and Inject all of the app module dependencies
//configure the routes
angular.module('cartpool', ['btford.socket-io', 'monospaced.qrcode', 'ngAnimate', 'ui.bootstrap', 'ui.router','ngResource', 'authModule', 'homeModule', 'userModule','chart.js', 'AngularPrint', 'adminModule', 'angular-storage', 'angular-jwt', 'productModule', 'timer'])
//RouteScopes & Routes Configurations 
.config(['$urlRouterProvider', '$stateProvider', '$locationProvider', 'ChartJsProvider', function ($urlRouterProvider, $stateProvider, $locationProvider, ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
    	responsive: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
    	datasetFill: true,
    	skipLabels: true
    });

	$urlRouterProvider.otherwise('notfound');
	$stateProvider
		.state('notfound',{
			url: '/notfound',
			templateUrl: 'public/modules/config/view/notfound.config.view.html',
			controller: 'errorConfigController',
			cache: false
		})
		.state('home', {
			url: '/',
			templateUrl: 'public/modules/home/view/index.home.view.html',
			controller: 'indexHomeController',
			cache: false
		})
		.state('signin', {
			url: '/signin',
			templateUrl: 'public/modules/auth/view/signin.auth.view.html',
			controller: 'signinAuthController',
			cache: false
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'public/modules/auth/view/signup.auth.view.html',
			controller: 'signupAuthController',
			cache: false
		})
		.state('signout', {
			url: '/signout',
			controller: 'signoutAuthController',
			cache: false
		})
		.state('admin', {
			url: '/admin',
			cache: false,
			abstract: true,
			templateUrl: 'public/modules/admin/view/index.admin.view.html',
			controller: 'indexAdminController'
		})
		.state('admin.report', {
			url: '/report',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/report.admin.view.html',
					controller: 'reportAdminController'
				}
			}
		})
		.state('admin.product', {
			url: '/product',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/product.admin.view.html',
					controller: 'productAdminController'
				}
			}
		})
		.state('admin.order', {
			url: '/order',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/order.admin.view.html',
					controller: 'orderAdminController'
				}
			}
		})
		.state('admin.productDetail', {
			url: '/product/:id',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/detail.product.admin.html',
					controller: 'detailProductAdminController'
				}
			}
		})
		.state('admin.user', {
			url: '/user',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/user.admin.view.html',
					controller: 'userAdminController'
				}
			}
		})
		.state('admin.userDetail', {
			url: '/user/:id',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/detail.user.admin.view.html',
					controller: 'detailUserAdminController'
				}
			}
		})
		.state('admin.profile', {
			url: '/profile',
			cache: false,
			views: {
				'page': {
					templateUrl: 'public/modules/admin/view/profile.user.view.html',
					controller: 'profileAdminController'
				}
			}
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'public/modules/user/view/profile.user.view.html',
			controller: 'profileUserController',
			cache: false
		})
		.state('order', {
			url: '/order',
			templateUrl: 'public/modules/user/view/order.user.view.html',
			controller: 'orderUserController',
			cache: false
		});

		$locationProvider.html5Mode(true).hashPrefix('!');
}])
.service('authInterceptor', ['registerUserConfigFactory', function(registerUserConfigFactory) {
	return {
		request: function(config) {
			var token = registerUserConfigFactory.getToken();
			config.headers['x-access-token'] = token;
			return config;
		}
	}
}])
// Intercepte the http call to inject JWT if exists
.config(['$httpProvider', function($httpProvider) {
	 $httpProvider.interceptors.push('authInterceptor');
}])
.run(['$rootScope', '$location', '$state', 'registerUserConfigFactory', function ($rootScope, $location, $state, registerUserConfigFactory) {
	//add some space when changing from state ot another i.e page to another
	$rootScope.$on('$stateChangeSuccess', function() {
	   document.body.scrollTop = document.documentElement.scrollTop = 20;
	});

	//add a query to the page
	if(window.query){
		//redirect the user to the needed page
		if(window.query.page){
			$location.path(window.query.page);
		}
		//add query to the site url so it can be read by the concerned page
		$location.search(query.key, query.value);
	}

	$rootScope.logged = false;
	$rootScope.lastPage = '';
}]);
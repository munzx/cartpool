'use strict';

angular.module('cartpool').factory('registerUserConfigFactory', ['$window', '$rootScope', '$q', 'store', function ($window, $rootScope, $q, store) {
	var service = this;

	service.setUser = function(userInfo) {
		if(userInfo){
			if(store.get('user')){
				store.remove('user');
			}
			$rootScope.logged = true;
			store.set('user', userInfo.user);
			store.set('token', userInfo.token);
		} else {
			return false;
		}
	}

	service.getUser = function() {
		var user = store.get('user') || false;
		if(user){
			$rootScope.logged = true;
			return user;
		} else {
			return false;
		}
	}

	service.getToken = function() {
		var token = store.get('token') || false;
		if(token){
			$rootScope.logged = true;
			return token;
		} else {
			return false;
		}
		
	}

	service.clearUserInfo = function() {
		store.remove('user');
		store.remove('token');
		$rootScope.logged = false;
		$rootScope.lastPage = '';
	}

	return service;
}]);
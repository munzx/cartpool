'use strict';

angular.module('cartpool').factory('helperConfigFactory', [function () {
	return {
		'map': function (arr, fn) {
			for(var i=0; i <= arr.length; i++){
				if(fn(arr[i])){
					return i;
				}
			}
			return false;
		}
	}
}]);
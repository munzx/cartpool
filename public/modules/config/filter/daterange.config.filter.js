'use strict';

angular.module('cartpool').filter('dateRangeConfigFilter', [function () {
	return function(dataArray, dateFieldName, from, to){
		if(!dataArray || !dateFieldName) return;
		if(Object.prototype.toString.call(dataArray) !== '[object Array]') return;

		var dateFrom = (Object.prototype.toString.call(from) === "[object Date]")? new Date(from) : false;
		var dateTo = (Object.prototype.toString.call(to) === "[object Date]")? new Date(to): false;
		var newdataArray = [];

		var _map = function(array, cb){
			var newArray = [];
			for(var i=0;i<array.length;i++){
				var result = cb(array[i]);
				if(result){
					newArray.push(result);
				}
			}
			return newArray;
		}

		var _check = function(date){
			if(dateFrom && dateTo){
				return ((date >= dateFrom) && (date <= dateTo))? true: false;
			} else if(dateFrom && !dateTo){
				return (date >= dateFrom)? true: false;
			} else if(!dateFrom && dateTo){
				return (date <= dateTo)? true: false;
			} else {
				return true;
			}
		}

		newdataArray = _map(dataArray, function(val){
			if(val[dateFieldName]){
				var checkDate = new Date(val[dateFieldName]);
				if(_check(checkDate)){
					return val;
				}
			}
			return false;
		});

		return newdataArray;
	}
}]);
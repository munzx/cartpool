'user strict';

angular.module('cartpool').filter('unique', [function () {
    return function(input) {
    	if(typeof input == 'undefined'){return;}
        var uniqueList = [];
        for(var i = 0; i < input.length; i++){
        	//this is how we get the data from the api!!!
        	//user[0].country[0].name     ---- for the country name
        	if(uniqueList.indexOf(input[i].user[0].country[0].name) == -1){
        		uniqueList.push(input[i].user[0].country[0].name);
        	}
        }
        return uniqueList;
    }
}]);
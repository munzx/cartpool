'use strict';

//excerpt text
angular.module('cartpool').filter('excerpt', [function () {
	return function (text, max) {
		//the result to be returned
		var result='';

		//check if the user has passed a max value , otherwise set the max to 200
		if(!max){
			max = 200;
		} else {
			//if the max value is more than the text lenght then make the max equals to
			//the text length to avoid issues in the below loop
			if(max > text.length){
				max = text.length;
			}
		}

		//loop through the text and assign the value to result
		var length = (text.length <= 200 && max==200) ? text.length:max;
		for(var i=0; i < length;i++){
			result += text[i];
		}

		//if the text length was more than the max value
		//then add couple of dots at the end of the result
		if(text.length > max){
			result += '.....';
		}

		return result;
	}
}]);
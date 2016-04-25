'use strict';

angular.module('cartpool').filter('localize', ['arLang', function (arLang) {
	return function (text, lang) {
		text = (text === true)? 'true': text;
		text = (text === false)? 'false': text;
		if(!lang || !text) return text;
		text = text.toLowerCase();

		var localLang,
			result;
		//select language
		switch(lang){
			case "ar":
				localLang = arLang;
				break;
		}

		result = (localLang[text] == undefined)? text: localLang[text];
		return result;
	}
}]);
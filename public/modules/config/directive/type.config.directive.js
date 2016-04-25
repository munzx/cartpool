'use strict';

angular.module('cartpool').directive('typeConfigDirective', ['$interval', '$timeout', function ($interval, $timeout) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: true,
		transclude: false,
		scope: {
			"text": "@text",
			"delay": "@delay",
			"startDelay": "@startDelay",
			"stop": "@stop"
		},
		link: function (scope, elem, attrs, ngModel) {
			function init(){
				$timeout(function(){
					var startDelay = scope.startDelay,
						delay = scope.delay;

					if(!scope.text) return;
					if(!delay) delay = '100';
					if(!startDelay) startDelay = '500';

					function type(){
						$interval.cancel();
						var type = '';
						var i=0;

						var timer = $interval(function(){
						    if(i<scope.text.length){
						       type += scope.text[i];
						       elem.html(type);
						    } else {
						        $interval.cancel(timer);
						    }
						    i++;
						}, delay);
					}

					$timeout(function(){
						type();
					}, startDelay);

				}, 200);
			}
			var stop = false
			if(scope.stop) stop = true;

			if(!stop){
				init();
			}
		}
	}
}]);
'use strict';

angular.module('cartpool').directive('watchImageConfigDirective', ['$modal', '$rootScope', function ($modal, $rootScope) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: false,
		scope: {
			"id": "@id",
			"imagePlaceHolder": "@imagePlaceHolder"
		},
		link: function (scope, elem, attrs, ngModel) {
			//if the image is 'required' for validation (we know through the attribute 'required=true' that we add)
			//then set the validaity to false as if we did not it will always pass if we set a 'imagePlaceHolder'
			//to a defult value
			if(ngModel && attrs.required){
				ngModel.$setValidity("file loaded", false);
				ngModel.$render();
			}

			//create the canvas
			var x = document.getElementById(scope.id + 'Preview'),
				img = new Image();

			attrs.$observe('imagePlaceHolder', function () {
				//set placeholder image src
				img.src = scope.imagePlaceHolder;
			});

			//create the canvas
			var canvas = x.getContext("2d");
			//set/fill the background color
			canvas.fillStyle = "#fff";
			canvas.fillRect(0, 0, x.width, x.height);

			//draw an image "placeholder" once the created image is loaded
			img.onload = function () {
				draw();
			}

			function draw () {
				//give the newImage variable the uploaded image source
				//img.src = image.target.result;
				var maxWidth = x.width,
					maxHeight = x.height;

				//resize the image height
				if(img.height > maxHeight){
					img.width *= maxHeight / img.height
					img.height = maxHeight;
				}

				//resize the image width
				if(img.width > maxWidth){
					img.height *= maxWidth / img.width;
					img.width = maxWidth;
				}

				//clear the canvas
				canvas.clearRect(0, 0, x.width, x.height);
				canvas.fillRect(0, 0, x.width, x.height);

				//set canvas width and height
				canvas.width = img.width;
				canvas.height = img.height;
				//draw image into canvas and center it
				canvas.drawImage(img, (x.width - img.width) / 2, (x.height - img.height) / 2, img.width, img.height);
				var canvasBase64 = x.toDataURL("image/jpeg");
				ngModel.$setViewValue(canvasBase64);
			}

			//Full File API support.
			if ( window.FileReader && window.File && window.FileList && window.Blob ){
				//register a click even on an image the has the 'file input' field name plus 'Preview'
				//which when clicked it trigers the click even on the input field to upload a file
				document.getElementById(scope.id + 'Preview').onclick = function () {
					document.getElementById(scope.id).click();
				}

				elem.bind('change', function (e) {
					//get the file data
					var reader = new FileReader();

					//after loading validate the uploaded file other wise show the modal 'error message'
					reader.onload = function (image) {
							//clear the canvas
							canvas.clearRect(0, 0, canvas.width, canvas.height);
							canvas.fillRect(0, 0, canvas.width, canvas.height);

							//clear the area
							canvas.fillStyle = "#fff";


						//make sure the file size is less than 10MB
						if(image.loaded > 1024 * 1024 * 10){
							//upadte the 'input file' field to be false as the file size is more than 1MB
							scope.$apply(function () {
								if(ngModel){
									ngModel.$setValidity("file loaded", false);
									ngModel.$render();
								}
							});
							//show the madal 'error message'
							var modalInstance = $modal.open({
								controller: function () {
									$rootScope.cancel = function () {
										modalInstance.dismiss('cancel');
									}
								},
								template: '<button ng-click="cancel()" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="alert alert-danger text-center">Maximum image size is 10MB</h4>'
							});
						} else {
							//if the passed the validation then update the 'input file' field be true
							scope.$apply(function () {
								if(ngModel){
									ngModel.$setValidity("file loaded", true);
									ngModel.$render();
								}
							});

							img.src = image.target.result;
							draw();
						}
					}
					reader.readAsDataURL(elem[0].files[0]);	
				});

			} else {
				$modal.open({
					template: '<h4 class="alert alert-danger">Please use a modern browser to browse cartpool!!!</h4>'
				});
			}
		}
	}
}]);
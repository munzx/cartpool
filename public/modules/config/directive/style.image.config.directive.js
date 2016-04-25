'use strict';

angular.module('cartpool').directive('styleImageConfigDirective', ['$modal', '$rootScope', function ($modal, $rootScope) {
	return {
		require: '?ngModel',
		restrict: 'A',
		replace: false,
		transclude: true,
		link: function (scope, elem, attrs, ngModel) {
			//create canvas object
			var //the imageID
			imageId = 'lab',
			x = document.getElementById(imageId),
			//create the canvas
			canvas = x.getContext("2d"),
			//create a new file read object
			reader = new FileReader(),
			//create new image object
			newImage =  new Image();

			//set/fill the background color
			canvas.fillStyle = "#000";
			canvas.fillRect(0, 0, x.width, x.height);

			//on file upload
			elem.bind('change', function (e) {
				//On image load
				reader.onload = function(image){
					//give the newImage variable the uploaded image source
					newImage.src = image.target.result;
					var maxWidth = x.width,
						maxHeight = x.height;

					//resize the image height
					if(newImage.height > maxHeight){
						newImage.width *= maxHeight / newImage.height
						newImage.height = maxHeight;
					}

					//resize the image width
					if(newImage.width > maxWidth){
						newImage.height *= maxWidth / newImage.width;
						newImage.width = maxWidth;
					}

					//clear the canvas
					canvas.clearRect(0, 0, canvas.width, canvas.height);

					//set canvas width and height
					canvas.width = newImage.width;
					canvas.height = newImage.height;
					//draw image into canvas and center it
					canvas.drawImage(newImage, (x.width - newImage.width) / 2, (x.height - newImage.height) / 2, newImage.width, newImage.height);
				};

				//upload,initiate and read the selected file through the file input element
				reader.readAsDataURL(elem[0].files[0]);
			});

			//resize the image elemnt and draw it into the canvas
			function resizeAndDraw (id) {
				Caman('#' + id, function () {
					//get current height and width
					var width = this.width,
					height = this.height;
					//set the height to 500 max if exceeded 500
					if(width > x.width){
						width = x.width;
						this.resize({width: width});
					} else {
						width = this.width;
					}

					//render the image
					this.render();
				});
			}

			scope.save = function () {
				Caman('#' + imageId, function () {
					this.render(function () {
						 this.save();
					});
				});
			}

			scope.reset = function () {
				Caman('#' + imageId, function () {
					this.revert();
				});
			}

			scope.imageFilter = function (name) {
			    Caman('#' + imageId, function () {
			    	this.revert();
			    	switch(name){
			    		case "crossProcess":
			    			this.crossProcess();
			    			break;
			    		case "vintage":
			    			this.vintage();
			    			break;
			    		case "lomo":
			    			this.lomo()
			    			break;
			    		case "clarity":
			    			this.clarity();
			    			break;
			    		case "love":
			    			this.love();
			    			break;
			    		case "oldBoot":
			    			this.oldBoot();
			    			break;
			    		case "glowingSun":
			    			this.glowingSun();
			    			break;
			    		case "hazyDays":
			    			this.hazyDays();
			    			break;
			    		case "nostalgia":
			    			this.nostalgia();
			    			break;
			    		case "hemingway":
			    			this.hemingway();
			    			break;
			    		case "concentrate":
			    			this.concentrate();
			    			break;
			    		case "jarques":
			    			this.jarques();
			    			break;
			    		case "pinhole":
			    			this.pinhole();
			    			break;
			    		case "grungy":
			    			this.grungy();
			    			break;
			    	}
			    	this.render();
				});
			}

		}
	}
}]);
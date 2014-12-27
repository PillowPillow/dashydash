angular.module('Dashydash-utils')
	.controller('Dashydash-utils.controllers.ddResizeHandler', ['Dashydash-utils.providers.resizeHandler', 
	function(ResizeHandler) {

		this.initialize = function(configuration = {}) {
			return new ResizeHandler(configuration);
		};
	}]);
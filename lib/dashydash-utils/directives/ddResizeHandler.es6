angular.module('Dashydash-utils')
	.directive('ddResizeHandler', function() {
		return {
			scope: {},
			restrict: 'EA',
			require: 'ddResizeHandler',
			controller: ['Dashydash-utils.providers.resizeHandler', 
			function(ResizeHandler) {

				this.initialize = function(configuration = {}) {
					return new ResizeHandler(configuration);
				};
			}],
			controllerAs: '_ddResizeHandler',
			link: function($scope, $node, attributes, controller) {

				$scope.target = angular.element(document.querySelector('[dd-resizable]'));
				controller.initialize({type:$scope.type, target:$scope.target, element:$node}).enable();
			}
		};
	});
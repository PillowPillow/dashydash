angular.module('Dashydash-utils')
	.directive('ddResizeHandler', ['Dashydash-utils.providers.resizeHandler', function(ResizeHandlerProvider) {
		return {
			scope: {},
			restrict: 'EA',
			link: function($scope, $node) {
				$scope.target = angular.element(document.querySelector('[dd-resizable]'));
				initialize($scope.type, $scope.target, $node).enable();

				function initialize(type, target, $node, ...options) {
					return new ResizeHandlerProvider(type, target, $node, ...options);
				}
			}
		};
	}]);
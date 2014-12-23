angular.module('Dashydash-utils')
	.directive('ddDraggable', ['Dashydash-utils.providers.draggable', function(DraggableProvider) {
		return {
			scope: {
				container: '=ddDraggableContainer'
			},
			restrict: 'EA',
			link: function($scope, $node, attributes, controller) {

				initialize($node, $scope.container).enable();

				function initialize($node, ...options) {
					return new DraggableProvider($node, ...options);
				};
			}
		};
	}]);
angular.module('Dashydash-utils')
	.directive('ddDraggable', [
	function() {
		return {
			scope: {
				container: '=ddDraggableContainer',
				ondrag: '=?ddOnDrag',
				ondragStart: '=?ddOnDragStart',
				ondragStop: '=?ddOnDragStop'
			},
			restrict: 'EA',
			require: 'ddDraggable',
			controller: 'Dashydash-utils.controllers.ddDraggable',
			controllerAs: '_ddDraggable',
			link: function($scope, $node, attributes, controller) {

				var config = {element: $node, container: $scope.container, ondrag: $scope.ondrag, ondragStart: $scope.ondragStart, ondragStop: $scope.ondragStop};

				controller.initialize(config).enable();

			}
		};
	}]);
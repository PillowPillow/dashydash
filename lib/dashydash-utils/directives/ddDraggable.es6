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
			controller: ['Dashydash-utils.services.utils', 'Dashydash-utils.providers.draggable', 'DRAGGABLE_CONFIGURATION', 
			function(utils, Draggable, DRAGGABLE_CONFIGURATION) {

				this.initialize = function(configuration = {}) {

					utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
					return new Draggable(configuration);
				};

			}],
			controllerAs: '_ddDraggable',
			link: function($scope, $node, attributes, controller) {

				var config = {element: $node, container: $scope.container, ondrag: $scope.ondrag, ondragStart: $scope.ondragStart, ondragStop: $scope.ondragStop};

				controller.initialize(config).enable();

			}
		};
	}]);
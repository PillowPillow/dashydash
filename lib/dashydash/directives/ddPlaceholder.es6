angular.module('Dashydash')
	.directive('ddPlaceholder', [
	'Dashydash.services.nodeBuilder',
	'Dashydash.constants.DOM_GRID_ITEM',
	function(nodeBuilder, DOM_GRID_ITEM) {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^ddGrid', 'ddPlaceholder'],
			controller: 'Dashydash.controllers.placeholder',
			controllerAs: '_ddPlaceholder',
			compile: (node) => {
				
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_GRID_ITEM);
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);

						$scope.class = {};

						var gridController = controllers[0],
							placeholderController = controllers[1];

						var config = {element: $node, grid: gridController.grid};

						placeholderController.initialize(config);
					}
				};
			}
		};
	}]);
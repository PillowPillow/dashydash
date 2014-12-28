angular.module('Dashydash')
	.directive('ddPlaceholder', ['$timeout', 'Dashydash.services.nodeBuilder', 'Dashydash.constants.positionableElementDOMAttributes',
	function($timeout, nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^ddGrid', 'ddPlaceholder'],
			controller: 'Dashydash.controllers.placeholder',
			controllerAs: '_ddPlaceholder',
			compile: (node) => {
				
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);

				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);

						$scope.row = 0;
						$scope.col = 99;
						$scope.width = 99;
						$scope.height = 99;

						var gridController = controllers[0],
							placeholderController = controllers[1];
						var config = {element: $node, grid: gridController.grid};

						placeholderController.initialize(config);
					}
				};
			}
		};
	}]);
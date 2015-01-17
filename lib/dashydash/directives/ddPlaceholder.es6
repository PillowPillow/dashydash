angular.module('Dashydash')
	.directive('ddPlaceholder', function() {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^ddGrid', 'ddPlaceholder'],
			controller: 'Dashydash.controllers.placeholder',
			controllerAs: 'ddPlaceholder',
			bindToController: true,
			compile: () => {
				return {
					post: ($scope, $node, attributes, controllers) => {
						$scope.class = {};

						var gridController = controllers[0],
							placeholderController = controllers[1];

						var config = {element: $node, grid: gridController.grid, width:0, height:0};

						placeholderController.initialize(config);
					}
				};
			}
		};
	});
angular.module('Dashydash')
	.directive('ddItemScope', function($timeout) {
		return {
			scope: true,
			restrict: 'C',
			priority: 2,
			require: ['^ddGrid', 'ddItemScope'],
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: 'ddItem',
			compile: () => ($scope, $node, attributes, controllers) => {
				var gridController = controllers[0],
					itemController = controllers[1];


				(function method() {
									console.log(attributes.ddConfig);
									$timeout(method, 2000)
								})()

				var config = {element: $node, grid: gridController.grid, row: 0, column: 0, width: 1, height: 1};

				itemController.initialize(config);
			}
		};
	});
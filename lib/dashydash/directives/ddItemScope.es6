angular.module('Dashydash')
	.directive('ddItemScope', function() {
		return {
			restrict: 'C',
			priority: 2,
			require: ['^ddGrid', 'ddItemScope'],
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: 'ddItem',
			transclude: true,
			compile: () => ($scope, $node, attributes, controllers, transclude) => {
				var	gridController = controllers[0],
					itemController = controllers[1];

				var config = {
					element: $node, 
					grid: gridController.grid, 
					row: itemController.config.y, 
					column: itemController.config.x,
					width: itemController.config.w, 
					height: itemController.config.h
				};

				itemController.initialize(config);

				transclude($scope, (clone) => $node.append(clone));
			}
		};
	});
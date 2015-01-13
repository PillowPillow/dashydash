angular.module('Dashydash')
	.directive('ddItemScope', function() {
		return {
			scope: {
				config: '=ddConfig'
			},
			restrict: 'C',
			priority: 2,
			require: ['^ddGrid', 'ddItemScope'],
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: 'ddItem',
			transclude: true,
			bindToController: true,
			compile: () => ($scope, $node, attributes, controllers, transclude) => {

				var scope = $scope.$parent,
					gridController = controllers[0],
					itemController = controllers[1];


				var config = {element: $node, grid: gridController.grid, row: 2, column: 2, width: 2, height: 2};

				itemController.initialize(config);
				itemController.bindItemProperties(scope);

				transclude($scope, (clone) => $node.append(clone));
			}
		};
	});
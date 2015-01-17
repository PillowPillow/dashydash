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

				console.log(itemController.config)

				var config = {
					element: $node, 
					grid: gridController.grid, 
					row: itemController.config.y, 
					column: itemController.config.x,
					width: itemController.config.w, 
					height: itemController.config.h
				};

				itemController.initialize(config);
				itemController.bindItemPositionProperties(scope);
				itemController.bindItemSizeProperties(scope);
				itemController.bindItemClassProperty(scope);

				transclude($scope, (clone) => $node.append(clone));
			}
		};
	});
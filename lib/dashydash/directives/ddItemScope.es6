angular.module('Dashydash')
	.directive('ddItemScope', [
	'PropertyBinder.services.binder',
	function(bind) {
		return {
			scope: true,
			restrict: 'C',
			priority: 2,
			require: ['^ddGrid', 'ddItemScope'],
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: '_ddItem',
			compile: () => ($scope, $node, attributes, controllers) => {
				var row = parseInt(attributes.initRow, 10) || 0,
					col = parseInt(attributes.initCol, 10) || 0,
					width = parseInt(attributes.initWidth, 10) || 1,
					height = parseInt(attributes.initHeight, 10) || 1;

				$node.removeAttr('init-row');
				$node.removeAttr('init-col');
				$node.removeAttr('init-width');
				$node.removeAttr('init-height');

				$scope.class = {};

				var gridController = controllers[0],
					itemController = controllers[1];
				var config = {element: $node, grid: gridController.grid, row: row, column: col, width: width, height: height};
				itemController.initialize(config);
				
				bind(['y','x'])
					.as({'y':'row','x':'col'})
					.from(itemController.item.position.current)
					.to($scope).apply()
					.onchange(() => gridController.grid.update(itemController.item));
				bind(['w','h'])
					.as({'w':'width','h':'height'})
					.from(itemController.item.size.current)
					.to($scope).apply()
					.onchange(() => gridController.grid.update(itemController.item));
				bind('isDragged')
					.as('item-dragged')
					.from(itemController.item)
					.to($scope.class).apply();
			} 
		};
	}]);
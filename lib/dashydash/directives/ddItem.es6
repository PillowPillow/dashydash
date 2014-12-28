angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.positionableElementDOMAttributes',
	'PropertyBinder.services.binder',
	function(nodeBuilder, DOM_ATTRIBUTES, bind) {
		return {
			scope: true,
			require: ['^ddGrid', 'ddItem'],
			restrict: 'EA',
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: '_ddItem',
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES) || nodeBuilder.addAttributes(node, {'ng-class': 'class'});
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined) {
							$node.removeAttr('ng-repeat')
							return nodeBuilder.compile($node)($scope);
						}
						$scope.row = attributes.initRow || 0;
						$scope.col = attributes.initCol || 0;
						$scope.width = attributes.initWidth || 1;
						$scope.height = attributes.initHeight || 1;
						$scope.class = {};

						var gridController = controllers[0],
							itemController = controllers[1];
						var config = {element: $node, grid: gridController.grid, row: $scope.row, column: $scope.col};

						itemController.initialize(config);
						
						bind('y').as('row').from(itemController.item.position.current).to($scope).apply();
						bind('x').as('col').from(itemController.item.position.current).to($scope).apply();
						bind('isDragged').as('item-dragged').from(itemController.item).to($scope.class).apply();

					}
				};
			}
		};
	}]);
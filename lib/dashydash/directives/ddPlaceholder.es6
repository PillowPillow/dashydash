angular.module('Dashydash')
	.directive('ddPlaceholder', [
	'Dashydash.services.nodeBuilder',
	'Dashydash.constants.positionableElementDOMAttributes',
	'PropertyBinder.services.binder',
	function(nodeBuilder, DOM_ATTRIBUTES, bind) {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^ddGrid', 'ddPlaceholder'],
			controller: 'Dashydash.controllers.placeholder',
			controllerAs: '_ddPlaceholder',
			compile: (node) => {
				
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES) || nodeBuilder.addAttributes(node, {'ng-class': 'class'});
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);

						// $scope.row = 0;
						// $scope.col = 99;
						$scope.width = 1;
						$scope.height = 1;

						$scope.class = {};

						var gridController = controllers[0],
							placeholderController = controllers[1];

						var config = {element: $node, grid: gridController.grid};

						placeholderController.initialize(config);
						
						bind('y').as('row').from(placeholderController.placeholder.position.current).to($scope).apply();
						bind('x').as('col').from(placeholderController.placeholder.position.current).to($scope).apply();
						bind('itemDragged').as('item-dragged').from(placeholderController.placeholder).to($scope.class).apply();
					}
				};
			}
		};
	}]);
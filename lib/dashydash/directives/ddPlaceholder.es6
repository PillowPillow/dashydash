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

						var row = attributes.initRow || 0,
							col = attributes.initCol || 0,
							width = attributes.initWidth || 1,
							height = attributes.initHeight || 1;

						$scope.class = {};

						var gridController = controllers[0],
							placeholderController = controllers[1];

						var config = {element: $node, grid: gridController.grid, row: row, column: col, width: width, height: height};

						placeholderController.initialize(config);
						
						bind('y').as('row').from(placeholderController.placeholder.position.current).to($scope).apply();
						bind('x').as('col').from(placeholderController.placeholder.position.current).to($scope).apply();
						bind('w').as('width').from(placeholderController.placeholder.size.current).to($scope).apply();
						bind('h').as('height').from(placeholderController.placeholder.size.current).to($scope).apply();
						bind('itemDragged').as('item-dragged').from(placeholderController.placeholder).to($scope.class).apply();
					}
				};
			}
		};
	}]);
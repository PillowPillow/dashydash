angular.module('Dashydash')
	.directive('ddPlaceholder', [
	'Dashydash.services.nodeBuilder',
	'Dashydash.constants.positionableElementDOMAttributes',
	'PropertyBinder.services.binder',
	'$timeout',
	function(nodeBuilder, DOM_ATTRIBUTES, bind, $timeout) {
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

						// $scope.row = 0;
						// $scope.col = 99;
						$scope.width = 1;
						$scope.height = 1;

						var gridController = controllers[0],
							placeholderController = controllers[1];
						var config = {element: $node, grid: gridController.grid};

						placeholderController.initialize(config);
						
						bind('y').as('col').from(placeholderController.placeholder.position.current).to($scope).apply();
						bind('x').as('row').from(placeholderController.placeholder.position.current).to($scope).apply();
					}
				};
			}
		};
	}]);
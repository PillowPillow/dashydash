angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.positionableElementDOMAttributes',
	function(nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			require: ['^ddGrid', 'ddItem'],
			restrict: 'EA',
			controller: 'Dashydash.controllers.ddItem',
			controllerAs: '_ddItem',
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);

						$scope.row = 99;
						$scope.col = 99;
						$scope.width = 99;
						$scope.height = 99;

						var gridController = controllers[0],
							itemController = controllers[1];

						var config = {element: $node, grid: gridController.grid, rows: $scope.row, columns: $scope.col};

						itemController.initialize(config);

					}
				};
			}
		};
	}]);
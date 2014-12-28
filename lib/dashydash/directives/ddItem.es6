angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.positionableElementDOMAttributes',
	function(nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			require: ['^ddGrid', 'ddItem'],
			restrict: 'EA',
			controller: 'Dashydash.controllers.item',
			controllerAs: '_ddItem',
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);
						$scope.row = attributes.initRow || 0;
						$scope.col = attributes.initCol || 0;
						$scope.width = attributes.initWidth || 1;
						$scope.height = attributes.initHeight || 1;

						var gridController = controllers[0],
							itemController = controllers[1];
						var config = {element: $node, grid: gridController.grid, rows: $scope.row, columns: $scope.col};

						itemController.initialize(config);

					}
				};
			}
		};
	}]);
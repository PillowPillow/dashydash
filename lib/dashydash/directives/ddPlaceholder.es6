angular.module('Dashydash')
	.directive('ddPlaceholder', ['Dashydash.services.nodeBuilder', 'Dashydash.constants.positionableElementDOMAttributes',
	function(nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			restrict: 'EA',
			require: '^ddGrid',
			controller: 'Dashydash.controllers.ddPlaceholder',
			controllerAs: '_ddPlaceholder',
			compile: (node) => {
				
				var isAlreadyDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);

				return {
					post: ($scope, $node) => {
						if(!isAlreadyDefined)
							return nodeBuilder.compile($node)($scope);

						$scope.row = 99;
						$scope.col = 99;
						$scope.width = 99;
						$scope.height = 99;
					}
				};
			}
		};
	}]);
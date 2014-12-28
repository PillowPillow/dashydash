angular.module('Dashydash')
	.directive('ddPlaceholder', ['$timeout', 'Dashydash.services.nodeBuilder', 'Dashydash.constants.positionableElementDOMAttributes',
	function($timeout, nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			restrict: 'EA',
			require: '^ddGrid',
			controller: 'Dashydash.controllers.ddPlaceholder',
			controllerAs: '_ddPlaceholder',
			compile: (node) => {
				
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);

				return {
					post: ($scope, $node) => {
						if(attributeDefined)
							return nodeBuilder.compile($node)($scope);

						$scope.row = 0;
						$scope.col = 99;
						$scope.width = 99;
						$scope.height = 99;
					}
				};
			}
		};
	}]);
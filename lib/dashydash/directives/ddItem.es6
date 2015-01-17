angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.DOM_GRID_ITEM',
	function(nodeBuilder, DOM_GRID_ITEM) {
		return {
			scope: {
				config:'=ddConfig'
			},
			restrict: 'EA',
			priority: 1,
			compile: (node) => {
				var directiveAdded = nodeBuilder.addClass(node, 'dd-item-scope');
				if(directiveAdded) {
					nodeBuilder.removeAttributes(node, DOM_GRID_ITEM);
					nodeBuilder.removeAttributes(node, ['ng-repeat']);
					nodeBuilder.addAttributes(node, DOM_GRID_ITEM);
				}

				return {
					post: ($scope, $node) => {
						if(directiveAdded) {
							$scope.class = {};
							return nodeBuilder.compile($node)($scope);
						}
						else {
							$scope.$destroy();
						}
					}
				};
			}
		};
	}]);
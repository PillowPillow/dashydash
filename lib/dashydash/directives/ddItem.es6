angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.DOM_GRID_ITEM',
	function(nodeBuilder, DOM_GRID_ITEM) {
		return {
			scope: true,
			restrict: 'EA',
			priority: 1,
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_GRID_ITEM);
				if(attributeDefined)
					node[0].className += ' dd-item-scope';
				return {
					post: ($scope, $node) => {
						if(attributeDefined) {
							$node.removeAttr('ng-repeat');
							return nodeBuilder.compile($node)($scope);
						}
					}
				};
			}
		};
	}]);
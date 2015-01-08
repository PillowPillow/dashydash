angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.positionableElementDOMAttributes',
	function(nodeBuilder, DOM_ATTRIBUTES) {
		return {
			scope: true,
			restrict: 'EA',
			priority: 1,
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES);
				attributeDefined = nodeBuilder.addAttributes(node, {'ng-class':'class'}) || attributeDefined;
				if(attributeDefined)
					node[0].className += ' dd-item-scope';
				// console.log(node)
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
angular.module('Dashydash')
	.directive('ddItem', [
	'Dashydash.services.nodeBuilder', 
	'Dashydash.constants.positionableElementDOMAttributes',
	'PropertyBinder.services.binder',
	function(nodeBuilder, DOM_ATTRIBUTES, bind) {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^ddGrid', 'ddItem'],
			controller: 'Dashydash.controllers.gridItem',
			controllerAs: '_ddItem',
			compile: (node) => {
				var attributeDefined = nodeBuilder.addAttributes(node, DOM_ATTRIBUTES) || nodeBuilder.addAttributes(node, {'ng-class':'class'});
				return {
					post: ($scope, $node, attributes, controllers) => {
						if(attributeDefined) {
							$node.removeAttr('ng-repeat');
							return nodeBuilder.compile($node)($scope);
						}

						var row = attributes.initRow || 0,
							col = attributes.initCol || 0,
							width = attributes.initWidth || 1,
							height = attributes.initHeight || 1;

						$scope.class = {};

						var gridController = controllers[0],
							itemController = controllers[1];
						var config = {element: $node, grid: gridController.grid, row: row, column: col, width: width, height: height};

						itemController.initialize(config);
						
						bind(['y','x'])
							.as({'y':'row','x':'col'})
							.from(itemController.item.position.current)
							.to($scope).apply();
						bind(['w','h'])
							.as({'w':'width','h':'height'})
							.from(itemController.item.size.current)
							.to($scope).apply();
						bind('isDragged').as('item-dragged').from(itemController.item).to($scope.class).apply();
					}
				};
			}
		};
	}]);
angular.module('Dashydash-utils')
	.directive('ddDraggable', function() {
		return {
			scope: {},
			restrict: 'EAC',
			controller: ['Dashydash-utils.providers.draggable', 
			function(DraggableProvider) {

				this.initialize = function($node, ...options) {
					return new DraggableProvider($node, ...options);
				};
			}],
			link: function($scope, $node, attributes, controller) {

				controller.initialize($node).enable();

			}
		};
	});
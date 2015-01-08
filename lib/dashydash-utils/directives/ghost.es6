angular.module('Dashydash-utils')
	.directive('ghost', [
	function() {
		return {
			scope: {},
			restrict: 'EA',
			template: 'holla que tal',
			require: '^ddDraggable',
			link: function($scope, $node, attributes, controller) {
				controller.registerGhost($node);
			}
		};
	}]);
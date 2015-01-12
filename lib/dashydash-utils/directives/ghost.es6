angular.module('Dashydash-utils')
	.directive('ghost', [
	function() {
		return {
			scope: {},
			restrict: 'EA',
			template: 'holla que tal',
			require: '^ddDraggable',
			bindToController: true,
			link: function($scope, $node, attributes, controller) {
				controller.registerGhost($node);
			}
		};
	}]);
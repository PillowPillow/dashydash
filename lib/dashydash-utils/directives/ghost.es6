angular.module('Dashydash-utils')
	.directive('ghost', [
	function() {
		return {
			scope: true,
			restrict: 'EA',
			require: ['^?ddDraggable', '^?ddItemSource'],
			transclude: true,
			bindToController: true,
			link: function($scope, $node, attributes, controllers, transclude) {

				var parent = controllers[0] || controllers[1];

				parent.registerGhost($node);

				transclude($scope, (clone) => $node.append(clone));

				$scope.$on('$destroy', () => $scope.$broadcast('$destroy'));
			}
		};
	}]);
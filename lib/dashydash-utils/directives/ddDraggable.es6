angular.module('Dashydash-utils')
	.directive('ddDraggable', [
	function() {
		return {
			scope: {
				_container: '=ddContainer',
				_ondrag: '=?ddDrag',
				_ondragStart: '=?ddDragstart',
				_ondragStop: '=?ddDragstop'
			},
			restrict: 'EA',
			require: 'ddDraggable',
			controller: 'Dashydash-utils.controllers.draggable',
			controllerAs: '_ddDraggable',
			link: function($scope, $node, attributes, controller) {
				var config = {element: $node, container: $scope._container, ondrag: $scope._ondrag, 
					ondragStart: () =>  {$scope._ondragStart(); $scope.$apply();}, 
				ondragStop: $scope._ondragStop};

				controller.initialize(config).enable();

			}
		};
	}]);
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
				var config = {element: $node, 
					container: $scope._container, 
					ondrag: (...args) => $scope._ondrag(...args), 
					ondragStart: (...args) => $scope._ondragStart(...args), 
					ondragStop: (...args) => $scope._ondragStop(...args)
				};
				controller.initialize(config).enable();

			}
		};
	}]);
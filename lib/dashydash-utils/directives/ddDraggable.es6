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
			controllerAs: 'ddDraggable',
			bindToController: true,
			link: function($scope, $node, attributes, controller) {
				var config = {element: $node, 
					container: controller._container, 
					ondrag: (...args) => controller._ondrag(...args), 
					ondragStart: (...args) => controller._ondragStart(...args), 
					ondragStop: (...args) => controller._ondragStop(...args)
				};
				controller.initialize(config).enable();

			}
		};
	}]);
angular.module('Dashydash-utils')
	.directive('ddResizeHandler', function() {
		return {
			scope: {},
			restrict: 'EA',
			require: 'ddResizeHandler',
			controller: 'Dashydash-utils.controllers.resizeHandler',
			controllerAs: '_ddResizeHandler',
			bindToController: true,
			link: function($scope, $node, attributes, controller) {

				$scope.target = angular.element(document.querySelector('[dd-resizable]'));
				controller.initialize({type:$scope.type, target:$scope.target, element:$node}).enable();
			}
		};
	});
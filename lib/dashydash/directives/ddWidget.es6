angular.module('Dashydash')
	.directive('ddWidget', function(){
		return {
			scope: {},
			require: '^ddGrid',
			restrict: 'EA',
			templateUrl: 'ddWidget.jade',
			transclude: true,
			link: function($scope, $node, attributes, controller) {
				console.log(controller)
			}
		};
	});
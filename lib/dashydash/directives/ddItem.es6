angular.module('Dashydash')
	.directive('ddItem', function(){
		return {
			scope: {},
			require: '^ddGrid',
			restrict: 'EA',
			templateUrl: 'ddItem.jade',
			transclude: true,
			link: function($scope, $node, attributes, controller) {
				console.log(controller)
			}
		};
	});
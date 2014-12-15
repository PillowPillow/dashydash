angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {},
			restrict: 'AEC',
			transclude: true,
			templateUrl: 'ddGrid.jade',
			link: function($scope, $node) {
				console.log('linked');
			}
		};
	});
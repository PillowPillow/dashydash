angular.module('DashyDash')
	.directive('ddGrid', function(){
		return {
			scope: {},
			restrict: 'AE',
			templateUrl: '',
			link: function($scope, $node) {
				console.log('linked');
			}
		};
	});
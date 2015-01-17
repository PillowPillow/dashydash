angular.module('Dashydash')
	.directive('ddItemSource', function(){
		return {
			scope: {
				grid: '@',
				width: 'itemWidth',
				height: 'itemHeight',
				col: 'itemCol',
				row: 'itemRow'
			},
			restrict: 'A',
			link: function($scope, $node, attributes) {
				
			}
		};
	});
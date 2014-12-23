angular.module('Dashydash-utils')
	.directive('ddResizable', function() {
		return {
			restrict: 'EA',
			link: function($scope, $node) {
				var $local = $scope._ddResizable = {};
				$local.node = $node;
			}
		};
	});
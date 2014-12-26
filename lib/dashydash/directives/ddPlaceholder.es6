angular.module('Dashydash')
	.directive('ddPlaceholder', function(){
		return {
			scope: true,
			restrict: 'EA',
			require: '^ddGrid',
			controller: function() {

				

			},
			controllerAs: '_ddPlaceholder',
			link: function($scope, $node, attributes, controller) {
				console.log(controller)
			}
		};
	});
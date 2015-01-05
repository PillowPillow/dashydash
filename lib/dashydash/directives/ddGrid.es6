angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {
				'configuration': '=@configuration'
			},
			restrict: 'AE',
			transclude: true,
			templateUrl: 'ddGrid.jade',
			require: 'ddGrid',
			controller: 'Dashydash.controllers.grid',
			controllerAs: '_ddGrid',
			compile: () => {
				return {
					pre: ($scope, $node, attributes, controller) => {
						controller.initialize($scope.configuration);
					}
				};
			}
		};
	});
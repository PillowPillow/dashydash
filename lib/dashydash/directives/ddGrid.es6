angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {
				'gridId': '@gridId',
				'configuration': '=?configuration'
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
						var configuration = $scope.configuration || {};
						configuration.element = $node;
						configuration.id = $scope.gridId;
						controller.initialize(configuration);
					}
				};
			}
		};
	});
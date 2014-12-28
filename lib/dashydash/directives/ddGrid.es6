angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {
				container: '=?ddGridContainer',
				row: '=?ddGridRows',
				col: '=?ddGridColumns'
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

						var config = {element: $node, container: $scope.container, rows: $scope.row, columns: $scope.col};
						controller.initialize(config);
					}
				};
			}
		};
	});
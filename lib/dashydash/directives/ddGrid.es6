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
			controller: ['Dashydash-utils.services.utils', 'Dashydash.providers.grid', 
			function(utils, Grid) {

				this.initialize = function(configuration = {}) {
					this.grid = new Grid(configuration);
					return this.grid;
				};

			}],
			controllerAs: '_ddGrid',
			link: function($scope, $node, attributes, controller) {

				var config = {element: $node, container: $scope.container, rows: $scope.row, columns: $scope.col};

				controller.initialize(config);

			}
		};
	});
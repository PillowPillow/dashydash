angular.module('Dashydash')
	.directive('ddGrid', function(){
		return {
			scope: {
				container: '=?ddGridContainer'
			},
			restrict: 'AE',
			transclude: true,
			templateUrl: 'ddGrid.jade',
			require: 'ddGrid',
			controller: ['Dashydash-utils.services.utils', 'Dashydash.providers.grid', 
			function(utils, Grid) {

				this.initialize = function(configuration = {}) {
					return new Grid(configuration);
				};


			}],
			controllerAs: '_ddGrid',
			link: function($scope, $node, attributes, controller) {

				console.log(controller)
				var config = {element: $node, container: $scope.container};

				controller.initialize(config);

			}
		};
	});
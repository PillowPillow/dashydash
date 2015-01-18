angular.module('Dashydash')
	.controller('Dashydash.controllers.grid', ['Dashydash-utils.services.utils', 'Dashydash.providers.grid', '$scope',
	function(utils, Grid, $scope) {
		this.initialize = function(configuration = {}) {
			this.grid = new Grid(configuration);

			$scope.$watch(() => this.addItemMethod, (method) => this.grid.setAddItemMethod(method));
			return this.grid;
		};

		$scope.$on('$destroy', () => this.grid.destroy());
	}]);
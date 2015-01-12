angular.module('Dashydash')
	.controller('Dashydash.controllers.grid', ['Dashydash-utils.services.utils', 'Dashydash.providers.grid', 
	function(utils, Grid) {
		this.initialize = function(configuration = {}) {
			this.grid = new Grid(configuration);
			return this.grid;
		};
	}]);
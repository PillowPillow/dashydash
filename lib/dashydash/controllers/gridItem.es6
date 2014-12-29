angular.module('Dashydash')
	.controller('Dashydash.controllers.gridItem', [
	'Dashydash-utils.services.utils', 
	'Dashydash.providers.gridItem', 
	function(utils, GridItem) {

		this.initialize = function(configuration = {}) {

			this.item = new GridItem(configuration);

			this.item.grid.registerItem(this.item);
			return this.item;
		};


	}]);
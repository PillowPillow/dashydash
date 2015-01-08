angular.module('Dashydash')
	.controller('Dashydash.controllers.gridItem', [
	'Dashydash-utils.services.utils', 
	'Dashydash.providers.gridItem',
	function(utils, GridItem) {

		this.initialize = function(configuration = {}) {
			this.item = new GridItem(configuration);

			this.item.attach(configuration.grid);
			return this.item;
		};
	}]);
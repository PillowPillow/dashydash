angular.module('Dashydash')
	.controller('Dashydash.controllers.item', [
	'Dashydash-utils.services.utils', 
	'Dashydash.providers.item', 
	function(utils, Item) {

		this.initialize = function(configuration = {}) {

			this.item = new Item(configuration);
			return this.item;
		};


	}]);
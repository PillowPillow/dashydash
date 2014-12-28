angular.module('Dashydash')
	.controller('Dashydash.controllers.ddItem', [
	'Dashydash-utils.services.utils', 
	'Dashydash.providers.item', 
	function(utils, Item, Draggable, DRAGGABLE_CONFIGURATION) {

		this.initialize = function(configuration = {}) {

			this.item = new Item(configuration);
			return this.item;
		};


	}]);
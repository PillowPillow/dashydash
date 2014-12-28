angular.module('Dashydash')
	.controller('Dashydash.controllers.placeholder', [
	'Dashydash.providers.placeholder',
	function(Placeholder) {
		
		this.initialize = function(configuration = {}) {

			this.placeholder = new Placeholder(configuration);
			return this.placeholder;
		};

	}]);
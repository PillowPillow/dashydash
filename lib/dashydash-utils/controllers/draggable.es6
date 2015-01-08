angular.module('Dashydash-utils')
	.controller('Dashydash-utils.controllers.draggable', [
	'Dashydash-utils.services.utils', 
	'Dashydash-utils.providers.draggable', 
	'Dashydash-utils.constants.draggableConfiguration', 
	function(utils, Draggable, DRAGGABLE_CONFIGURATION) {

		var ghost;

		this.initialize = function(configuration = {}) {

			utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
			configuration.ghost = ghost || configuration.element;
			this.draggable = new Draggable(configuration);

			return this.draggable;
		};

		this.registerGhost = ($node) => ghost = $node;

	}]);
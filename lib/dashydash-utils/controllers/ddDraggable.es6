angular.module('Dashydash-utils')
	.controller('Dashydash-utils.controllers.ddDraggable', [
	'Dashydash-utils.services.utils', 
	'Dashydash-utils.providers.draggable', 
	'Dashydash-utils.constants.draggableConfiguration', 
	function(utils, Draggable, DRAGGABLE_CONFIGURATION) {

		this.initialize = function(configuration = {}) {

			utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
			return new Draggable(configuration);
		};

	}]);
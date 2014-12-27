angular.module('Dashydash-utils')
	.constant('Dashydash-utils.constants.draggableExcludedElements', ['select', 'input', 'textarea', 'button'])
	.constant('Dashydash-utils.constants.draggableConfiguration', {
		container: null, 
		handle: '', 
		ondragStart: () => {}, 
		ondragStop: () => {}, 
		ondrag: () => {}, 
		directions: ['n','s','e','w'], 
		diagonalRestrictions: [], 
		scrollSensitivity: 20, 
		scrollSpeed: 20
	});
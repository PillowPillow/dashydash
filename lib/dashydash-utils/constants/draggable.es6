angular.module('Dashydash-utils')
	.constant('DRAGGABLE_EXCLUDED_ELEMENTS', ['select', 'input', 'textarea', 'button'])
	.constant('DRAGGABLE_CONFIGURATION', {
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
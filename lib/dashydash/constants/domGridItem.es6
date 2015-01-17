angular.module('Dashydash')
	.constant('Dashydash.constants.DOM_GRID_ITEM', {
		'dd-row': '{{ddItem.$row}}', 
		'dd-col': '{{ddItem.$col}}', 
		'dd-width': '{{ddItem.$width}}', 
		'dd-height': '{{ddItem.$height}}',
		'ng-class':'ddItem.class'
	});
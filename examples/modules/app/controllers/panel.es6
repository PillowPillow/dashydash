angular.module('app')
	.controller('app.controllers.panel',  [
	'$rootScope',
	'Dashydash.services.grid',
	'Dashydash.providers.gridItem',
	'$mdSidenav', 
	function($rootScope, gridService, GridItem, $mdSidenav) {
		this.closePanel = () => $mdSidenav('left').close();

		this.items = [
			{x:0,y:0,w:2,h:2,name:'SMALL'},
			{x:0,y:0,w:3,h:3,name:'MEDIUM'},
			{x:0,y:0,w:4,h:4,name:'BIG'}
		];
	}]);
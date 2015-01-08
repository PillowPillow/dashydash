angular.module('app')
	.controller('app.controllers.panel',  [
	'$mdSidenav', 
	function($mdSidenav) {
		this.closePanel = () => $mdSidenav('left').close();
		this.items = [
			{name:'SMALL'},
			{name:'MEDIUM'},
			{name:'BIG'}
		];
	}]);
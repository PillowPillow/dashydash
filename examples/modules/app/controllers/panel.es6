angular.module('app')
	.controller('app.controllers.panel',  [
	'Dashydash.services.grid',
	'$mdSidenav', 
	function(gridService, $mdSidenav) {
		this.closePanel = () => {
			// gridService('yolo');
			$mdSidenav('left').close();
		};
		this.items = [
			{name:'SMALL'},
			{name:'MEDIUM'},
			{name:'BIG'}
		];
	}]);
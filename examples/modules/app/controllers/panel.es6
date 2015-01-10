angular.module('app')
	.controller('app.controllers.panel',  [
	'$rootScope',
	'Dashydash.services.grid',
	'Dashydash.providers.gridItem',
	'$mdSidenav', 
	function($rootScope, gridService, GridItem, $mdSidenav) {
		this.closePanel = () => $mdSidenav('left').close();

		var item, gridId = 'gridname';
		// $rootScope.$on('dashydash_grid.mouseenter', (scope, id) => {
		// 	// console.log(id, gridId)
		// 	// if(gridId === id)
		// 	// 	return;

		// 	gridId = id;
		// 	// if(item) {
		// 	// 	item.attach(gridService(gridId));
		// 	// 	item.$$ondragStart();
		// 	// 	$rootScope.$apply();
		// 	// }
		// });



		this.dragstart = (...args) => {
			if(item)
				return;
			item = new GridItem({row:2, column:2, width:2, height:2});
			if(gridId !== undefined && gridId !== null) {
				item.attach(gridService(gridId));
				item.$$ondragStart(...args);
			}

			this.closePanel();
			$rootScope.$apply();
		};
		this.drag = (...args) => {
			if(item && item.isAttached)
				item.$$ondrag(...args);
		};
		this.dragstop = (...args) => {
			if(!item && item.isAttached)
				return;
			item.destroy();
			gridService(gridId).addItem(item.serialize());
			gridService(gridId)._forceViewUpdate();
			item = undefined;
		};

		this.items = [
			{name:'SMALL'},
			{name:'MEDIUM'},
			{name:'BIG'}
		];
	}]);
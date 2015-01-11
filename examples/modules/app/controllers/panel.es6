angular.module('app')
	.controller('app.controllers.panel',  [
	'$rootScope',
	'Dashydash.services.grid',
	'Dashydash.providers.gridItem',
	'$mdSidenav', 
	function($rootScope, gridService, GridItem, $mdSidenav) {
		this.closePanel = () => $mdSidenav('left').close();

		var item, grid;// = 'gridname';

		this.dragstart = (...args) => {
			grid = undefined;
			item = new GridItem({row:2, column:2, width:2, height:2});
			this.closePanel();
			$rootScope.$apply();
		};
		this.drag = (...args) => {

			//todo get the good grids not the first
			var overlapped = gridService.getOverlapped(args[0]);


			if(overlapped.length > 0) {

				grid = overlapped[0];

				if(!item.isAttachedTo(grid)) {
					item.attach(grid);
					item.$$ondragStart(...args);
				} 
				else {
					item.$$ondrag(...args);
						grid._forceViewUpdate();
				}
			}
			else {
				if(item) {
					item.destroy();
					if(grid)
						grid._forceViewUpdate();
				}
				grid = undefined;
			}

			if(item && item.isAttached)
				item.$$ondrag(...args);
		};
		this.dragstop = (...args) => {
			item.destroy();
			if(grid) {
				grid.addItem(item.serialize());
				grid._forceViewUpdate();
			}
			item = undefined;
		};

		this.items = [
			{name:'SMALL'},
			{name:'MEDIUM'},
			{name:'BIG'}
		];
	}]);
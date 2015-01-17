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
			console.log('passage', item)
			item = new GridItem({row:0, column:0, width:2, height:2});
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
						grid._forceViewUpdate();
				} 
				else {
					item.$$ondrag(...args);
					// item.position.last.x = item.position.current.x;
					// item.position.last.y = item.position.current.y;
						grid._forceViewUpdate();
				}


			}
			else {
				if(item && item.isAttached) {
					console.log('destroy')
					item.destroy();
					if(grid)
						grid._forceViewUpdate();
				}
				grid = undefined;
			}
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
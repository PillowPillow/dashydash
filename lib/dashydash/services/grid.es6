angular.module('Dashydash')
	.service('Dashydash.services.grid', 
	function() {
		var grids = {};

		var gridService = getGridById;

		gridService.register = registerGrid;
		gridService.getOverlapped = getOverlappedGrids;

		return gridService;

		function getGridById(gridId) {
			return grids[gridId];
		}

		function registerGrid(grid) {
			if(grids[grid.id])
				throw Error('DUPLICATE GRID ID');
			grids[grid.id] = grid;
		}

		function getOverlappedGrids(event) {
			var overlapped = [];
			var keys = Object.keys(grids);
			for(var i = 0; i<keys.length; i++)
				if(grids[keys[i]].isOverlapped(event))
					overlapped.push(grids[keys[i]]);
			return overlapped;
		}
	});
angular.module('Dashydash')
	.service('Dashydash.services.grid', 
	function() {
		var grids = {};

		var gridService = getGridById;

		gridService.register = registerGrid;
		gridService.destroy = destroyGrid;
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

		function destroyGrid(grid) {
			if(grids[grid.id])
				delete grids[grid.id];
		}

		function getOverlappedGrids(event, gridId = undefined) {
			var overlapped = [];
			var keys = Object.keys(grids);
			for(var i = 0; i<keys.length; i++) {
				if(grids[keys[i]].isOverlapped(event) && (!gridId || keys[i] === gridId))
					overlapped.push(grids[keys[i]]);
			}
			return overlapped;
		}
	});
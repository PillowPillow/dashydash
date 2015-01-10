angular.module('Dashydash')
	.service('Dashydash.services.grid', 
	function() {
		var grids = {};

		function gridGetter(gridId) {
			return grids[gridId];
		}

		gridGetter.register = function registerGrid(grid) {
			if(grids[grid.id])
				throw Error('DUPLICATE GRID ID');
			grids[grid.id] = grid;
		};

		return gridGetter;
	});
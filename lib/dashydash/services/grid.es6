angular.module('Dashydash')
	.service('Dashydash.services.grid', 
	function() {
		var grids = {};

		class Grid {
			constructor(gridId) {
				this.id = gridId;
			}

			_verifyGridDefinition() {
				if(!!grids[this.id])
					throw Error('GRID ' + this.id + ' NOT DEFINED');
			}

			update(...args) {
				this._verifyGridDefinition();
				grids[this.id].update(...args);
			}

			moveDownArea(...args) {
				this._verifyGridDefinition();
				grids[this.id].moveDownArea(...args);
			}

			getItemsFromArea(...args) {
				this._verifyGridDefinition();
				grids[this.id].getItemsFromArea(...args);
			}

			getItem(...args) {
				this._verifyGridDefinition();
				grids[this.id].getItem(...args);
			}

			saveItemLocation(...args) {
				this._verifyGridDefinition();
				grids[this.id].saveItemLocation(...args);
			}

			saveItemsLocation(...args) {
				this._verifyGridDefinition();
				grids[this.id].saveItemsLocation(...args);
			}

			attachItem(...args) {
				this._verifyGridDefinition();
				grids[this.id].attachItem(...args);
			}

			detachItem(...args) {
				this._verifyGridDefinition();
				grids[this.id].detachItem(...args);
			}
		}

		function gridGetter(gridId) {
			return new Grid(gridId);
		}

		gridGetter.register = function registerGrid(grid) {
			if(grids[grid.id])
				throw Error('DUPLICATE GRID ID');
			grids[grid.id] = grid;
		};

		return gridGetter;
	});
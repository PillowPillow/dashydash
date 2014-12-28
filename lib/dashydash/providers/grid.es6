angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document',
			($document) => {

			class Grid {

				constructor({element:$node, container:container, columns:columns, rows:rows}) {

					this.grid = [];
					
					this.rows = rows;
					this.columns = columns;

					this.placeholder = null;

					this.createEmptyGrid();

				}

				createEmptyGrid() {

					this.grid = [];

					for(var row = 0; row<this.rows; row++) {
						this.grid[row] = [];
						for(var col = 0; col<this.columns; col++)
							this.grid[row][col] = null;
					}

				}

				itemDragged(...args) {
					console.log(...args);
				}

				setPlaceholder(element) {
					this.placeholder = element;
				}

			}

			return Grid;
		}];
	});
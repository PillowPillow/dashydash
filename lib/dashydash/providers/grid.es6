angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', 'Dashydash-utils.providers.DOMElement',
			($document, DOMElement) => {

			class Grid extends DOMElement {

				constructor({element:$node, container:container, columns:columns, rows:rows}) {

					super({element:$node, container:container});

					this.grid = [];
					
					this.rows = rows;
					this.columns = columns;

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

			}

			return Grid;
		}];
	});
angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', '$rootScope',
			($document, $rootScope) => {

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

				itemDragStart(...args) {
					var posX = ~~((args[1].position.x + 50)/100),
						posY = ~~((args[1].position.y + 25)/50);

					this.placeholder.moveTo({x:posX, y:posY});
					this._forceViewUpdate();
				}

				itemDragged(...args) {
					var posX = ~~((args[1].position.x + 50)/100),
						posY = ~~((args[1].position.y + 25)/50);

					var isMoved = this.placeholder.moveTo({x:posX, y:posY});
					isMoved && this._forceViewUpdate();
				}

				itemDragStop() {
					this.placeholder.itemDragged = false;
					this._forceViewUpdate();
				}

				_forceViewUpdate() {
					$rootScope.$apply();
				}

			}

			return Grid;
		}];
	});
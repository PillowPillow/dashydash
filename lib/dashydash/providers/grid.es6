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

					if(posX !== this.placeholder.position.current.x || posY !== this.placeholder.position.current.y) {

						this.placeholder.position.last.x = this.placeholder.position.current.x;
						this.placeholder.position.last.x = this.placeholder.position.current.y;
						this.placeholder.position.current.x = posX;
						this.placeholder.position.current.y = posY;

						$rootScope.$apply();
					}
				}

				itemDragged(...args) {
					var posX = ~~((args[1].position.x + 50)/100),
						posY = ~~((args[1].position.y + 25)/50);

					if(posX !== this.placeholder.position.current.x || posY !== this.placeholder.position.current.y) {

						this.placeholder.position.last.x = this.placeholder.position.current.x;
						this.placeholder.position.last.x = this.placeholder.position.current.y;
						this.placeholder.position.current.x = posX;
						this.placeholder.position.current.y = posY;

						this.placeholder.itemDragged = true;
						$rootScope.$apply();
					}
				}

				itemDragStop() {
					this.placeholder.itemDragged = false;
					$rootScope.$apply();
				}

				setPlaceholder(element) {
					this.placeholder = element;
				}

			}

			return Grid;
		}];
	});
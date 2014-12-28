angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', '$rootScope',
			($document, $rootScope) => {

			class Grid {

				constructor({element:$node, container:container, columns:columns, rows:rows}) {

					this.grid = [];
					
					this.rows = rows;
					this.columns = columns;

					this.itemWidth = 100;
					this.itemHeight = 50;

					this.placeholder = null;

					this.createEmptyGrid();

				}

				get itemHalfWidth() {
					return this.itemWidth / 2;
				}

				get itemHalfHeight() {
					return this.itemHeight / 2;
				}

				_forceViewUpdate() {
					$rootScope.$apply();
				}

				_getCenterPosition({x,y}) {
					return { x:this._getCenterPosX(x), y:this._getCenterPosY(y) };
				}

				_getCenterPosX(posX = 0) {
					return ~~( (posX + this.itemHalfWidth) / this.itemWidth );
				}

				_getCenterPosY(posY = 0) {
					return ~~( (posY + this.itemHalfHeight) / this.itemHeight );
				}

				createEmptyGrid() {

					this.grid = [];

					for(var row = 0; row<this.rows; row++) {
						this.grid[row] = [];
						for(var col = 0; col<this.columns; col++)
							this.grid[row][col] = null;
					}
				}

				itemDragStart(item, ...args) {

					var position = this._getCenterPosition(args[1].position);
					this.placeholder.enableAnimation();
					this.placeholder.moveTo(position);
					this.placeholder.updateSize(item.size.current);
					this._forceViewUpdate();
				}

				itemDragged(item, ...args) {

					var position = this._getCenterPosition(args[1].position);
					var isMoved = this.placeholder.moveTo(position);
					isMoved && item.moveTo(this.placeholder.position.current) && this._forceViewUpdate();
				}

				itemDragStop(item) {
					this.placeholder.disableAnimation();
					item.moveTo(this.placeholder.position.current);
					this._forceViewUpdate();
				}

			}

			return Grid;
		}];
	});
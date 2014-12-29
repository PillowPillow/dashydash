angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', '$rootScope',
			($document, $rootScope) => {

			class Grid {

				constructor({element:$node, container:container, columns:columns, rows:rows, itemWidth:itemWidth, itemHeight:itemHeight}) {

					this.grid = [];
					
					this.rows = rows;
					this.columns = columns;

					this.itemWidth = itemWidth || 100;
					this.itemHeight = itemHeight || 50;

					this.placeholder = null;

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

				_getPosition({x,y}) {
					return { x:this._pixelToColumn(x), y:this._pixelToRow(y) };
				}

				_pixelToColumn(posX = 0) {
					return ~~( (posX + this.itemHalfWidth) / this.itemWidth );
				}

				_pixelToRow(posY = 0) {
					return ~~( (posY + this.itemHalfHeight) / this.itemHeight );
				}

				_belongTo(item, list = []) {
					return !!item && ~list.indexOf(item);
				}

				_toArray(src) {
					return !(src instanceof Array) ? [src] : src;
				}

				_putItem(item) {

					if(!this.grid[item.position.current.y])
						this.grid[item.position.current.y] = [];

					this.grid[item.position.current.y][item.position.current.x] = item;
				}

				_putItems(items = []) {

					items = this._toArray(items);
					for(var i =0; i<items; i++)
						this._putItem(items[i]);
				}

				itemDragStart(item, ...args) {
					console.log(this.grid)
					var position = this._getPosition(args[1].position);
					this.placeholder.enableAnimation();
					this.placeholder.moveTo(position);
					this.placeholder.updateSize(item.size.current);
					this._forceViewUpdate();
				}

				itemDragged(item, ...args) {

					var position = this._getPosition(args[1].position);
					var isMoved = this.placeholder.moveTo(position);
					if(isMoved) {
						item.moveTo(this.placeholder.position.current, false);
						console.log(this.getItemsFromRegion(this.placeholder.position.current, this.placeholder.size.current));
						this._forceViewUpdate();
					} 
				}

				itemDragStop(item) {
					this.placeholder.disableAnimation();
					item.moveTo(this.placeholder.position.current);
					this._forceViewUpdate();
				}

				getItemsFromRegion({x:col,y:row},{w:width,h:height}, excludedItems = []) {
					
					if(!width || !height)
						width = height = 1;
					
					excludedItems = this._toArray(excludedItems);

					var colMax = col + width,
						rowMax = row + height;

					var items = [];

					for(var x = col; x<colMax; x++) {
						for(var y = row; y<rowMax; y++) {
							let item = this.getItem({x,y});
							if(!!item && !this._belongTo(excludedItems) && !this._belongTo(items))
								items.push(item);
						}
					}

					return items;
				}

				getItem({x:col, y:row}, excludedItems = []) {
					var size = {x:1,y:1},
						itemFound = null;

					excludedItems = this._toArray(excludedItems);

					loopOnRows:for(var y = row; y>=0; y--) {
						size.x = 1;
						for(let x = col; x>=0; x--) {
							if(!!this.grid[y]) {
								let item = this.grid[y][x];
								if(!!item && !this._belongTo(excludedItems) && item.size.current.h >= size.x && item.size.current.w >= size.y) {

									console.log(item.element, item.size.current.h, size.x, item.size.current.w, size.y);
									itemFound = item;
									break loopOnRows;
								}
							}
							size.x++;
						}
						size.y++;
					}
					return itemFound;	
				}

				registerItems(items = []) {
					this._putItems(items);
				}

				registerItem(item) {
					this._putItem(item);
				}

			}

			return Grid;
		}];
	});
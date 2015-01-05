var grid;
angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', '$rootScope',
			($document, $rootScope) => {

			class Grid {

				constructor({element:$node, container:container, columns:columns, rows:rows, itemWidth:itemWidth, itemHeight:itemHeight}) {

					this.grid = [];
					this.items = [];
					
					this.rows = rows;
					this.columns = columns;

					this.itemWidth = itemWidth || 100;
					this.itemHeight = itemHeight || 50;

					this.placeholder = null;
					this.floating = false;
				}

				get itemHalfWidth() {
					return this.itemWidth / 2;
				}

				get itemHalfHeight() {
					return this.itemHeight / 2;
				}

				_resetGrid() {
					this.grid.splice(0);
					grid = this.grid;
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

				_toArray(src) {
					return !(src instanceof Array) ? [src] : src;
				}

				_isItemRegistered(item) {
					return !!item && !item.belongTo(this.items);
				}

				_rollbackPositions(excludedItems = []) {
					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongTo(excludedItems))
							this.items[i].moveBack();
				}

				_saveLocations(excludedItems = []) {

					this._resetGrid();
					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongTo(excludedItems))
							this.items[i].saveLocation();
				}

				_saveGridState(excludedItems = []) {

					this._resetGrid();
					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongTo(excludedItems))
							this.saveItemLocation(this.items[i]);
				}

				_removeItemFromGridWithCurrentPosition(item) {
					var removed = false;
					if(item !== undefined) {
						if(!!this.grid[item.position.current.y]) {
							let itemFromCurrentPosition = this.grid[item.position.current.y][item.position.current.x];
							if(!!itemFromCurrentPosition && itemFromCurrentPosition === item) {
								delete this.grid[item.position.current.y][item.position.current.x];
								removed = true;
							}
						}
					}
					return removed;
				}

				_removeItemFromGridWithLastPosition(item) {
					var removed = false;
					if(item !== undefined) {
						if(!!this.grid[item.position.last.y]) {
							let itemFromLastPosition = this.grid[item.position.last.y][item.position.last.x];
							if(!!itemFromLastPosition && itemFromLastPosition === item) {
								delete this.grid[item.position.last.y][item.position.last.x];
								removed = true;
							}
						}
					}
					return removed;
				}

				_softRemoveItemFromGrid(item = undefined) {
					var removed = this._removeItemFromGridWithCurrentPosition(item) || this._removeItemFromGridWithLastPosition(item);
					return removed;
				}

				_hardRemoveItemFromGrid(item = undefined) {
					var removed = false;

					if(item !== undefined)
						for(var y = 0; y<this.grid.length; y++)
							for(var x = 0; x<this.grid[y].length; x++)
								if(!!this.grid[y][x] && this.grid[y][x] === item) {
									delete this.grid[y][x];
									removed = true;
									break;
								}

					return removed;
				}

				_removeItemFromGrid(item) {
					var removed = this._softRemoveItemFromGrid(item);
					if(!removed)
						removed = this._hardRemoveItemFromGrid(item);
					return removed;
				}

				_getItemIndex(item) {
					return this.items.indexOf(item);
				}

				pushUpItem(item, excludedItems = [], saveInGrid = true) {

					if(this.floating)
						return false;

					excludedItems = this._toArray(excludedItems);
					excludedItems.push(item);

					var {x,y} = item.position.current,
						highest = null,
						moved = false;

					for(var row = y -1; row>=0; row--) {

						let items = this.getItemsFromRegion({x,y:row}, item.size.current, excludedItems);
						if(items.length > 0)
							break;

						highest = row;
					}

					if(highest !== null) {
						if(saveInGrid)
							this._removeItemFromGrid(item);

						moved = item.moveTo({x,y:highest}, false);

						if(saveInGrid) 
							this.saveItemLocation(item);
					}

					return moved;
				}

				pushUpItems() {
					if(this.floating) return;

					for(var y = 0, colLength = this.grid.length; y < colLength; y++) {

						var row = this.grid[y];
						if(!row) continue;

						for(var x = 0, rowLength = row.length; x < rowLength; x++)
							if(row[x]) this.pushUpItem(row[x]);
					}
				}

				updateGridFromDraggedItemPosition(item, final = false) {

					this.moveDownRegion(item, undefined, final);
					this._saveGridState();

					if(!this.floating)
						this.pushUpItems();

					this.placeholder.moveTo(item.position.current);
				}

				itemDragStart(item, ...args) {
					var position = this._getPosition(args[1].position);

					this._saveGridState();
					this.placeholder.enableAnimation();
					this.placeholder.moveTo(position, false);
					this.placeholder.updateSize(item.size.current);
					this._forceViewUpdate();
				}

				itemDragged(item, ...args) {

					if(this.floating) 
						this._rollbackPositions();

					this._saveGridState();
					var position = this._getPosition(args[1].position);
					var isMoved = item.moveTo(position);

					if(isMoved) {
						this.updateGridFromDraggedItemPosition(item);
						this._forceViewUpdate();
					} 
				}

				itemDragStop(item) {
					this.placeholder.disableAnimation();
					this.placeholder.moveTo(item.position.current);
					this._saveLocations();
					this._forceViewUpdate();
				}

				moveDownRegion(item, excludedItems = [], final = false) {
					excludedItems = this._toArray(excludedItems);
					excludedItems.push(item);

					var regionItems = this.getItemsFromRegion(item.position.current, item.size.current, excludedItems), i;

					for(i = 0; i<regionItems.length; i++) {
						let nbToMove = item.position.current.y + item.size.current.h - regionItems[i].position.current.y;
						regionItems[i].moveDown(nbToMove, final);
					}
					for(i = 0; i<regionItems.length; i++)
						this.moveDownRegion(regionItems[i], excludedItems, final);
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
							if(!!item && !item.belongTo(excludedItems) && !item.belongTo(items))
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
								if(!!item && !item.belongTo(excludedItems) && item.size.current.h >= size.y && item.size.current.w >= size.x) {
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

				saveItemLocation(item) {

					if(!this.grid[item.position.current.y])
						this.grid[item.position.current.y] = [];

					this.grid[item.position.current.y][item.position.current.x] = item;
				}

				saveItemsLocation(items = []) {

					items = this._toArray(items);
					for(var i =0; i<items; i++)
						this.saveItemLocation(items[i]);
				}

				attachItem(item) {
					if(this._isItemRegistered(item))
						this.items.push(item);

					this.saveItemLocation(item);
				}

				detachItem(item) {
					var detached = false;
					if(this._isItemRegistered(item)) {
						detached = this._removeItemFromGrid(item);
						if(detached)
							this.items.splice(this._getItemIndex(), 1);
					}
					console.log(detached?'detaché':'erreur lors du detachement');
					return detached;
				}

			}

			return Grid;
		}];
	});
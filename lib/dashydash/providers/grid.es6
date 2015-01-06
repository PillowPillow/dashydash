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

					this.lastPosition = {x:0,y:0};

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
					return !!item && item.belongTo(this.items);
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
					var removed = false;
					if(this._removeItemFromGridWithCurrentPosition(item))
						removed = true;
					else if(this._removeItemFromGridWithLastPosition(item))
						removed = true;
					return removed;
				}

				_hardRemoveItemFromGrid(item = undefined) {
					var removed = false;
					if(item !== undefined)
						for(var y = 0; y<this.grid.length; y++)
							if(this.grid[y])
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

						let items = this.getItemsFromArea({x,y:row}, item.size.current, excludedItems);
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

					this.detachItem(item);

					if(!this.floating)
						this.pushUpItems();
					this.moveDownArea(item, undefined, final);

					this._saveGridState();

					this.attachItem(item);

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

					if(this.lastPosition.x !== position.x || this.lastPosition.y !== position.y) {
						this.lastPosition = position;
						item.moveTo(position);
						this.updateGridFromDraggedItemPosition(item);
						this._forceViewUpdate();
					}
				}

				itemDragStop(item, ...args) {
					this.placeholder.disableAnimation();
					var position = this._getPosition(args[1].position);
					item.moveTo(position);
					this.updateGridFromDraggedItemPosition(item, true);
					this._saveLocations();
					this._forceViewUpdate();
				}

				// moveDownArea(item, excludedItems = [], final = false) {

				// 	var areaItems = this.getItemsFromArea(item.position.current, item.size.current, item);
				// 	areaItems.sort(function(a, b) {
				// 		return a.position.current.y - b.position.current.y;
				// 	});

				// 	var topRows = {}, temp, i, l;

				// 	for (i = 0, l = areaItems.length; i < l; ++i) {
				// 		temp = areaItems[i];
				// 		var topRow = topRows[temp.col];
				// 		if (typeof topRow === 'undefined' || temp.row < topRow) {
				// 			topRows[temp.col] = temp.row;
				// 		}
				// 	}
				// 	// move each item down from the top row in its column to the row
				// 	for (i = 0, l = areaItems.length; i < l; ++i) {
				// 		temp = areaItems[i];
				// 		var nbToMove =  item.position.current.y + item.size.current.h - topRows[temp.col];
				// 		areaItems[i].moveDown(nbToMove , final);
				// 		excludedItems.push(temp);
				// 	}
				// }

				moveDownArea(item, excludedItems = [], final = false) {
					excludedItems = this._toArray(excludedItems);
					// excludedItems.push(item);
					var areaItems = this.getItemsFromArea(item.position.current, item.size.current, item);

					// var highestLastY = Infinity , i, maxNbToMove = 0, h = 0;

					// for(i = 0; i<areaItems.length; i++) {
					// 	let nbToMove = item.position.current.y + item.size.current.h - areaItems[i].position.current.y;
					// 	// if(maxNbToMove < nbToMove)
					// 		// maxNbToMove =  nbToMove;

					// 	highestLastY = highestLastY < areaItems[i].position.last.y ? highestLastY : areaItems[i].position.last.y;
						
					// }

					// console.log('collider ', item.element[0])
					// console.log(areaItems.length)
					// var amount = maxNbToMove, range = {xf: 0, xt: Infinity};


					areaItems.sort(function(a,b) {
						var evaluation = 0;
						if(a.position.last.y>b.position.last.y)
							evaluation = 1;
						if(a.position.last.y<b.position.last.y)
							evaluation = -1;

						return evaluation;
					});


					for(var i = 0; i<areaItems.length; i++) {
						// if(areaItems[i].position.last.y !== highestLastY) {

							// areaItems[i].moveDown(maxNbToMove, final);
							// continue;
						// }
						let nbToMove = item.position.current.y + item.size.current.h - areaItems[i].position.current.y;
						// console.log('move to', nbToMove, 'from ', areaItems[i].position.current.y, areaItems[i].element[0])
						for(var j = 0; j<nbToMove; j++) {
							areaItems[i].moveDown(1 , final);
							this.moveDownArea(areaItems[i], excludedItems, final);
							this._saveGridState();
						}
						// areaItems[i].moveTo({y: maxNbToMove}, final);
						// if(areaItems[i].position.current.x <= range.xf && areaItems[i].position.current.x + areaItems[i].size.current.w >= range.xt) {
							// console.log('++')
							// amount += areaItems[i].size.current.h;
						// 	if(areaItems[i].position.current.x < range.xf)
						// 		range.xf = areaItems[i].position.current.x;
						// 	if(areaItems[i].position.current.x + areaItems[i].size.current.w  > range.xt)
						// 		range.xt = areaItems[i].position.current.x + areaItems[i].size.current.w;
						// }
						// console.log('after ', areaItems[i].position.current.y)
					}

					// for(i = 0; i<areaItems.length; i++)
							// this.moveDownArea(areaItems[i], excludedItems, final);

					
					// var areaItems = this.getImpactedItemsByAreaMoving(item.position.current, item.size.current, excludedItems);

					// if(areaItems.length > 0) {
					// 	let nbToMoveMax = 0;

					// 	let moved = [];
					// 	for(var i = 0; i<areaItems.length; i++) {
					// 		let nbToMove = item.position.current.y + item.size.current.h - areaItems[i].position.current.y;
					// 		nbToMoveMax = nbToMove > nbToMoveMax ? nbToMove : nbToMoveMax;
					// 	}
					// 	for(var i = 0; i<areaItems.length; i++) {
					// 		if(!areaItems[i].belongTo(moved)) {

					// 		areaItems[i].moveDown(nbToMoveMax, final);
					// 		moved.push(areaItems[i]);
					// 		}
					// 	}
					// }
				}

				// getImpactedItemsByAreaMoving({x,y},{w,h}, excludedItems = []) {


				// 		var impactedItems = [],
				// 			areaItems = this.getItemsFromArea({x,y:++y},{w,h}, excludedItems);

				// 		for(var i = 0; i<areaItems.length; i++) {
				// 			impactedItems.push(areaItems[i]);
				// 			excludedItems.push(areaItems[i]);
				// 			impactedItems = impactedItems.concat(this.getImpactedItemsByAreaMoving(areaItems[i].position.current, areaItems[i].size.current, excludedItems));
				// 		}

				// 		return impactedItems;
				// }

				getItemsFromArea({x:col,y:row},{w:width,h:height}, excludedItems = []) {
					
					if(!width || !height)
						width = height = 1;
					
					excludedItems = this._toArray(excludedItems);

					var colMax = col + width,
						rowMax = row + height;

					var items = [];

					for(var x = col; x<colMax; x++) {
						for(var y = row; y<rowMax; y++) {
							let item = this.getItem({x,y}, excludedItems);
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
					if(!this._isItemRegistered(item))
						this.items.push(item);

					this.saveItemLocation(item);
				}

				detachItem(item) {
					var detached = false;
					if(this._isItemRegistered(item)) {
						detached = this._removeItemFromGrid(item);

						if(detached)
							this.items.splice(this._getItemIndex(item), 1);
					}
					return detached;
				}

			}

			return Grid;
		}];
	});
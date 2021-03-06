var grid;
angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = [
		'Dashydash.services.grid',
		'$document', '$rootScope', '$compile',
		'Dashydash.providers.stylesheet',
			(gridService, $document, $rootScope, $compile, Stylesheet) => {

			class Grid {

				constructor({id:id, element:$node, container:container, columns:columns, rows:rows, itemHeight:itemHeight}) {

					this.id = id;

					this.grid = [];
					this.items = [];
					
					this.rows = rows;
					this.columns = columns;

					this.itemHeight = itemHeight || 50;

					this.lastPosition = {x:0,y:0};

					this.placeholder = undefined;
					this.element = $node;

					this._customAddItemMethod = undefined;
					
					this.floating = true;

					gridService.register(this);
					this._initStyleSheets();

				}

				get element() {
					return this._element;
				}
				set element(value) {
					this._element = value;
				}

				get itemWidth() {
					return this.gridWidth * 8.33333333 / 100;
				}

				get itemContainer() {
					return angular.element(this.element[0].querySelector('.dd-container'));
				}

				get itemHalfWidth() {
					return this.itemWidth / 2;
				}

				get itemHalfHeight() {
					return this.itemHeight / 2;
				}

				get elementRect() {
					return this.element[0].getBoundingClientRect();
				}

				get gridPosX() {
					return ~~this.elementRect.left;
				}
				get gridPosY() {
					return ~~this.elementRect.top;
				}

				get gridWidth() {
					return ~~this.elementRect.width;
				}
				get gridHeight() {
					return ~~this.elementRect.height;
				}

				_destroyStyleSheets() {
					if(this.itemPositionCSSSheet)
						this.itemPositionCSSSheet.clearRules();
					if(this.placeholderPositionCSSSheet)
						this.placeholderPositionCSSSheet.clearRules();
					if(this.itemSizeCSSSheet)
						this.itemSizeCSSSheet.clearRules();
					if(this.placeholderSizeCSSSheet)
						this.placeholderSizeCSSSheet.clearRules();
					this.itemPositionCSSSheet = null;
					this.placeholderPositionCSSSheet = null;
					this.itemSizeCSSSheet = null;
					this.placeholderSizeCSSSheet = null;
				}

				_initStyleSheets() {
					this._destroyStyleSheets();

					var parent = {element: 'dd-grid', attributes: {}};
					if(this.id !== undefined && this.id !== null)
						parent.attributes = {'grid-id':this.id};
					this.itemPositionCSSSheet = new Stylesheet([parent]);
					this.placeholderPositionCSSSheet = new Stylesheet([parent]);
					this.itemSizeCSSSheet = new Stylesheet([parent]);
					this.placeholderSizeCSSSheet = new Stylesheet([parent]);
				}

				_collidesXaxis(x) {
					return x >= this.gridPosX && x < this.gridPosX + this.gridWidth;
				}

				_collidesYaxis(y) {
					return y >= this.gridPosY && y < this.gridPosX + this.gridHeight;
				}

				_resetGrid() {
					this.grid.splice(0);
				}

				_forceViewUpdate() {
					$rootScope.$apply();
				}

				_getPosXFromGridElement(x) {
					return x - this.gridPosX;
				}

				_getPosYFromGridElement(y) {
					return y - this.gridPosY;
				}

				_getPosition({x,y}) {
					return { x:this._pixelToColumn(x), y:this._pixelToRow(y) };
				}

				_pixelToColumn(posX = 0) {
					posX = this._getPosXFromGridElement(posX);
					return ~~( (posX + this.itemHalfWidth) / this.itemWidth );
				}

				_pixelToRow(posY = 0) {
					posY = this._getPosYFromGridElement(posY);
					return ~~( (posY + this.itemHalfHeight) / this.itemHeight );
				}

				_toArray(src) {
					return !(src instanceof Array) ? [src] : src;
				}

				_isItemRegistered(item) {
					return !!item && item.belongsTo(this.items);
				}

				_rollbackPositions(excludedItems = []) {
					excludedItems = this._toArray(excludedItems);

					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongsTo(excludedItems))
							this.items[i].moveBack();
				}

				_saveLocations(excludedItems = []) {

					this._resetGrid();
					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongsTo(excludedItems))
							this.items[i].saveLocation();
				}

				_updateGridItemPosition(item) {

					var removed = this._removeItemFromGrid(item);
					if(removed)
						this.saveItemLocation(item);
				}

				_saveGridState(excludedItems = []) {

					this._resetGrid();
					for(var i = 0; i<this.items.length; i++)
						if(!this.items[i].belongsTo(excludedItems))
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

				_addItem(config = {}) {
					var node = $document[0].createElement('dd-item');
					node.setAttribute('dd-config', JSON.stringify(config));
					
					this.itemContainer[0].appendChild(node);
					$compile(node)($rootScope);
				}

				_getMaxRowStyle() {
					return this.grid.length -1;
				}

				_getMaxHeightSyle() {
					var max = 0;
					for(var y = 0; y<this.grid.length; y++)
						if(this.grid[y])
							for(var x = 0; x<this.grid[y].length; x++)
								if(this.grid[y][x] && max<this.grid[y][x].size.current.h)
									max = this.grid[y][x].size.current.h;

					return max;
				}

				_updateStyleHeight(height) {
					if(this.itemSizeCSSSheet.length <= height)
						for(var h = this.itemSizeCSSSheet.length; h<= height+5; h++) {
							this.placeholderSizeCSSSheet.addRule({element: 'dd-placeholder', attributes: {'dd-height': h}}, 'height',`${(h) * this.itemHeight}px`);
							this.itemSizeCSSSheet.addRule({element: 'dd-item', attributes: {'dd-height': h}}, 'height',`${(h) * this.itemHeight}px`);
						}
				}

				_updateStyleTop(top) {
					if(this.itemPositionCSSSheet.length <= top)
						for(var h = this.itemPositionCSSSheet.length; h<= top+5; h++) {
							this.placeholderPositionCSSSheet.addRule({element: 'dd-placeholder', attributes: {'dd-row': h}}, 'top',`${(h) * this.itemHeight}px`);
							this.itemPositionCSSSheet.addRule({element: 'dd-item', attributes: {'dd-row': h}}, 'top',`${(h) * this.itemHeight}px`);
						}
				}

				_updateGridMinHeight(top, height) {
					this.element.css({
						'min-height': `${(top + height)*this.itemHeight}px`
					});
				}

				_updateSylesheet() {
					var height = this._getMaxHeightSyle(),
						top = this._getMaxRowStyle();
					this._updateStyleHeight(height);
					this._updateStyleTop(top);
					this._updateGridMinHeight(top, height)
				}

				isOverlapped(event) {
					return this._collidesXaxis(event.pageX) && this._collidesYaxis(event.pageY);
				}

				setAddItemMethod(method = undefined) {
					this._customAddItemMethod = method;
				}

				addItem(...args) {
					return this._customAddItemMethod ? this._customAddItemMethod(...args) : this._addItem(...args);
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

				update(item, final = false) {
					var detached = this.detachItem(item);

					this.moveDownArea(item, undefined, final);

					this._saveGridState();

					if(detached)
						this.attachItem(item);

					if(!this.floating)
						this.pushUpItems();

					this.placeholder.moveTo(item.position.current);

					if(final) this._saveLocations();
					this._updateSylesheet();

				}

				itemDragStart(item, ...args) {
					

					let position = args.length > 2 ? this._getPosition(args[1].position) : item.position.current;
					this.placeholder.moveTo(position, false);
					this.enablePlaceholderAnimation();
					this._saveGridState();

					this.placeholder.updateSize(item.size.current);
					this._forceViewUpdate();
					grid = this.grid;
				}

				itemDragged(item, ...args) {
					var position = this._getPosition(args[1].position);

					if(this.lastPosition.x !== position.x || this.lastPosition.y !== position.y) {

						if(this.floating) this._rollbackPositions(item);

						this._saveGridState();

						this.lastPosition = position;
						item.moveTo(position);
						this.update(item);
						this._forceViewUpdate();
					}
					grid = this.grid;
				}

				itemDragStop(item, ...args) {
					this.disablePlaceholderAnimation();
					var position = this._getPosition(args[1].position);
					item.moveTo(position);
					this.update(item, true);
					this._forceViewUpdate();
					grid = this.grid;
				}

				enablePlaceholderAnimation() {
					this.placeholder.enableAnimation();
				}

				disablePlaceholderAnimation() {
					this.placeholder.disableAnimation();
				}

				moveDownArea(item, excludedItems = [], final = false) {
					excludedItems = this._toArray(excludedItems);
					var areaItems = this.getItemsFromArea(item.position.current, item.size.current, item);

					for(var i = 0; i<areaItems.length; i++) {
						let nbToMove = item.position.current.y + item.size.current.h - areaItems[i].position.current.y;
						for(var j = 0; j<nbToMove; j++) {
							areaItems[i].moveDown(1 , final);
							this.moveDownArea(areaItems[i], excludedItems, final);
							this._updateGridItemPosition(areaItems[i]);
						}
					}
				}

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
							if(!!item && !item.belongsTo(excludedItems) && !item.belongsTo(items))
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
								if(!!item && !item.belongsTo(excludedItems) && item.size.current.h >= size.y && item.size.current.w >= size.x) {
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

					if(!this.grid[item.position.current.y][item.position.current.x])
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

						if(detached) {
							this.items.splice(this._getItemIndex(item), 1);

							if(!this.floating)
								this.pushUpItems();
						}
					}
					return detached;
				}

				destroy() {
					gridService.destroy(this);
				}

			}

			return Grid;
		}];
	});
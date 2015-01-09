angular.module('Dashydash')
	.provider('Dashydash.providers.gridItem', function() {
		
		this.$get = ['$document', 
			'Dashydash-utils.services.utils', 
			'Dashydash.providers.item', 
			'Dashydash-utils.providers.draggable', 
			'Dashydash-utils.constants.draggableConfiguration',
			($document, utils, Item, Draggable, DRAGGABLE_CONFIGURATION) => {

			class GridItem extends Item {

				constructor({element:$node, row:row, column:col, width:width, height:height}) {

					super({row:row, column: col, width:width, height:height});

					this.element = $node;
					this.grid = undefined;

					this.isDragged = false;
					this.movedByOverlapping = false;

					if(this.element)
						this.initDraggableBehaviour({
							element: $node,  
							ondragStart: (...args) => this._ondragStart(...args),
							ondrag: (...args) => this._ondrag(...args),
							ondragStop: (...args) => this._ondragStop(...args)
						});
				}

				get isAttached() {
					return this.grid !== undefined && this.grid !== null;
				}

				_ondragStart(...args) {
					this.disableAnimation();
					if(this.isAttached)
						this.grid.itemDragStart(this, ...args);
				}

				_ondrag(...args) {
					if(this.isAttached)
						this.grid.itemDragged(this, ...args);
				}

				_ondragStop(...args) {
					this.enableAnimation();
					this._clearDragStyle();
					if(this.isAttached)
						this.grid.itemDragStop(this, ...args);
				}

				_clearDragStyle() {
					if(this.element)
						this.element.removeAttr('style');
				}

				initDraggableBehaviour(configuration = {}) {
					if(this.draggable !== undefined)
						throw 'draggable behaviour already initialized';
					utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
					this.draggable = new Draggable(configuration);
					this.draggable.enable();
				}
				
				attach(grid = undefined) {
					this.detach();
					this.grid = grid;
					this.grid.attachItem(this);
					this.grid.update(this, true);
				}

				detach() {
					if(this.isAttached)
						this.grid.detachItem(this);
					this.grid = undefined;
				}

				enableAnimation() {
					this.isDragged = false;
				}

				saveLocation() {
					this._updateLastPosition();
					this.grid.saveItemLocation(this);
				}
				
				disableAnimation() {
					this.isDragged = true;
				}

			}

			return GridItem;
		}];
	});
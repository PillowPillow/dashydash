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
							ondragStart: (...args) => this.$$ondragStart(...args),
							ondrag: (...args) => this.$$ondrag(...args),
							ondragStop: (...args) => this.$$ondragStop(...args)
						});
				}

				get isAttached() {
					return this.grid !== undefined && this.grid !== null;
				}

				$$ondragStart(...args) {
					this.disableAnimation();
					if(this.isAttached)
						this.grid.itemDragStart(this, ...args);
				}

				$$ondrag(...args) {
					if(this.isAttached)
						this.grid.itemDragged(this, ...args);
				}

				$$ondragStop(...args) {
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
					if(this.isAttached) {
						this.grid.detachItem(this);
						this.grid.update(this, true);
					}
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

				destroy() {
					if(this.isAttached)
						this.grid.disablePlaceholderAnimation();
					this.detach();
					if(this.draggable)
						this.draggable.destroy();
				}

				serialize() {
					var {w,h} = this.size.current,
						{x,y} = this.position.current;

					return {w, h, x, y};
				}

				isAttachedTo(grid) {
					return this.isAttached ? grid.id === this.grid.id : false;
				}

			}

			return GridItem;
		}];
	});
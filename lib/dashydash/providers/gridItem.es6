angular.module('Dashydash')
	.provider('Dashydash.providers.gridItem', function() {
		
		this.$get = ['$document', 
			'Dashydash-utils.services.utils', 
			'Dashydash.providers.item', 
			'Dashydash-utils.providers.draggable', 
			'Dashydash-utils.constants.draggableConfiguration',
			($document, utils, Item, Draggable, DRAGGABLE_CONFIGURATION) => {

			class GridItem extends Item {

				constructor({element:$node, grid:grid, row:row, column:col}) {

					this.element = $node;
					this.grid = grid;

					this.position = { current:{x:row,y:col}, last:{x:row,y:col} };

					this.isDragged = false;

					this._initDraggableBehaviour({
						element: $node,  
						ondragStart: (...args) => this._ondragStart(...args),
						ondrag: (...args) => this._ondrag(...args),
						ondragStop: (...args) => this._ondragStop(...args)
					});

				}

				_ondragStart(...args) {
					this.disableAnimation();
					this.grid.itemDragStart(this, ...args);
				}

				_ondrag(...args) {
					this.grid.itemDragged(this, ...args);
				}

				_ondragStop(...args) {
					this.enableAnimation();
					this._clearDragStyle();
					this.grid.itemDragStop(this, ...args);
				}

				_initDraggableBehaviour(configuration = {}) {
					if(this.draggable !== undefined)
						throw 'draggable behaviour already initialized';
					utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
					this.draggable = new Draggable(configuration);
					this.draggable.enable();
				}

				_clearDragStyle() {
					this.element.removeAttr('style');
				}
				
				enableAnimation() {
					this.isDragged = false;
				}
				
				disableAnimation() {
					this.isDragged = true;
				}

			}

			return GridItem;
		}];
	});
			
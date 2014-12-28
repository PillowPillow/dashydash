angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = ['$document', 
			'Dashydash-utils.services.utils', 
			'Dashydash-utils.providers.draggable', 
			'Dashydash-utils.constants.draggableConfiguration',
			($document, utils, Draggable, DRAGGABLE_CONFIGURATION) => {

			class Item {

				constructor({element:$node, grid:grid}) {

					this.element = $node;
					this.grid = grid;

					this._initDraggableBehaviour({
						element: $node,  
						ondrag: (...args) => this.grid.itemDragged(...args)
					});

				}

				_initDraggableBehaviour(configuration = {}) {
					if(this.draggable !== undefined)
						throw 'draggable behaviour already initialized';
					utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);
					this.draggable = new Draggable(configuration);
					this.draggable.enable();
				}

			}

			return Item;
		}];
	});
			
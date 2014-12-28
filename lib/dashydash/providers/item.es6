angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = ['$document', 
			'Dashydash-utils.services.utils', 
			'Dashydash-utils.providers.draggable', 
			'Dashydash-utils.constants.draggableConfiguration',
			'$rootScope',
			($document, utils, Draggable, DRAGGABLE_CONFIGURATION, $rootScope) => {

			class Item {

				constructor({element:$node, grid:grid, row:row, column:col}) {

					this.element = $node;
					this.grid = grid;

					this.position = { current:{x:row,y:col}, last:{x:row,y:col} };

					this.isDragged = false;

					this._initDraggableBehaviour({
						element: $node,  
						ondragStart: (...args) => {
							this.isDragged = true;
							this.grid.itemDragStart(...args);
						},
						ondrag: (...args) => this.grid.itemDragged(...args),
						ondragStop: (...args) => {
							var posX = ~~((args[1].position.x + 50)/100),
								posY = ~~((args[1].position.y + 25)/50);

							if(posX !== this.position.current.x || posY !== this.position.current.y) {
								this.position.last.x = this.position.current.x;
								this.position.last.y = this.position.current.y;
								this.position.current.x = posX;
								this.position.current.y = posY;
							}
							this.element.removeAttr('style');
							this.isDragged = false;
							this.grid.itemDragStop(...args);
						}
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
			
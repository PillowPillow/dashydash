angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder',  function() {
	
		this.$get = ['Dashydash-utils.providers.DOMElement',
		(DOMElement) => {

			class Placeholder extends DOMElement {

				constructor({element:$node, grid: grid}) {
					
					super({element:$node});

					this.element = $node;
					this.grid = grid;

					this.itemDragged = false;

					this.position = { current:{x:0,y:0}, last:{x:0,y:0} };
				}


				moveTo({x,y}) {

					this._enableAnimation();
					var moved = this._isMoved({x,y});
					
					if(moved) {
						this._updateLastPosition();
						this._updatePosition({x,y});
					}
					
					return moved;
				}

				_updatePosition({x,y}) {
					this.position.current.x = x;
					this.position.current.y = y;
				}

				_updateLastPosition() {
					this.position.last.x = this.position.current.x;
					this.position.last.x = this.position.current.y;
				}

				_isMoved({x,y}) {
					return x !== this.position.current.x || y !== this.position.current.y;
				}

				_enableAnimation() {
					this.itemDragged = true;
				}
			}

			return Placeholder;
		}];
	});
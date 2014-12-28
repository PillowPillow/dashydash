angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = () => {

			class Item {

				constructor() {
					this.position = { current:{x:0,y:0}, last:{x:0,y:0} };
					this.size = { current:{width:0, height:0}, last:{width:0, height:0} };
				}


				moveTo({x,y}) {

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
			}

			return Item;
		};
	});
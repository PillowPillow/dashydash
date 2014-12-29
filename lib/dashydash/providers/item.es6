angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = () => {

			class Item {

				constructor({row:row, column: col, width:width, height:height}) {
					this.position = { current:{x:row,y:col}, last:{x:row,y:col} };
					this.size = { current:{w:width,h:height}, last:{w:width,h:height} };
				}

				_updatePosition({x,y}) {
					this.position.current.x = x;
					this.position.current.y = y;
				}

				_updateLastPosition() {
					this.position.last.x = this.position.current.x;
					this.position.last.y = this.position.current.y;
				}

				_updateSize({w,h}) {
					this.size.current.w = w;
					this.size.current.h = h;
				}

				_updateLastSize() {
					this.size.last.w = this.size.current.w;
					this.size.last.h = this.size.current.h;
				}

				_isMoved({x,y}) {
					return x !== this.position.current.x || y !== this.position.current.y;
				}

				_isSizeUpdated({w, h}) {
					return w !== this.size.current.w || h !== this.size.current.h;
				}

				moveBack() {
					this.position.current.x = this.position.last.x;
					this.position.current.y = this.position.last.y;
				}

				moveTo({x,y}, final = true) {

					var moved = this._isMoved({x,y});

					if(moved) {
						final && this._updateLastPosition();
						this._updatePosition({x,y});
					}

					return moved;
				}

				updateSize({w, h}) {

					var updated = this._isSizeUpdated({w,h});

					if(updated) {
						this._updateLastSize();
						this._updateSize({w,h});
					}

					return updated;
				}
			}

			return Item;
		};
	});
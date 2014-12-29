angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = () => {

			class Item {

				constructor({row:row, column: col, width:width, height:height}) {
					this.position = { current:{x:row,y:col}, last:{x:row,y:col} };
					this.size = { current:{w:width,h:height}, last:{w:width,h:height} };
				}

				_updatePosition({x,y}) {
					this.position.current.x = parseInt(x, 10);
					this.position.current.y = parseInt(y, 10);
				}

				_updateLastPosition() {
					this.position.last.x = parseInt(this.position.current.x, 10);
					this.position.last.y = parseInt(this.position.current.y, 10);
				}

				_updateSize({w,h}) {
					this.size.current.w = parseInt(w, 10);
					this.size.current.h = parseInt(h, 10);
				}

				_updateLastSize() {
					this.size.last.w = parseInt(this.size.current.w, 10);
					this.size.last.h = parseInt(this.size.current.h, 10);
				}

				_isMoved({x,y}) {
					return x !== this.position.current.x || y !== this.position.current.y;
				}

				_isSizeUpdated({w, h}) {
					return w !== this.size.current.w || h !== this.size.current.h;
				}

				moveBack() {
					this.position.current.x = parseInt(this.position.last.x, 10);
					this.position.current.y = parseInt(this.position.last.y, 10);
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

				belongTo(list = []) {
					return ~list.indexOf(this);
				}
			}

			return Item;
		};
	});
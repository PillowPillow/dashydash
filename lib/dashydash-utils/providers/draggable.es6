angular.module('Dashydash-utils')
	.provider('Dashydash-utils.providers.draggable', function() {

		this.$get = ['$document', '$timeout', 'DRAGGABLE_EXCLUDED_ELEMENTS', 
			($document, $timeout, DRAGGABLE_EXCLUDED_ELEMENTS) => {

			class Draggable {

				constructor($node, container = 'body', handle = '', ondragStart = () => {}, ondragStop = () => {}, ondrag = () => {}) {

					this.element = $node;

					this.size = { width:0,height:0 };
					this.position = { x:0,y:0 };
					this.mouse = { current : { x:0,y:0 }, last : { x:0,y:0 } };
					this.offset = { x:0,y:0 };

					this.min = { left:0,top:0 };
					this.max = { left:9999,top:9999 };

					this.document = $document[0];

					this.ondragStart = ondragStart;
					this.ondragStop = ondragStop;
					this.ondrag = ondrag;

					this._container = container;
					this._handle = handle;

					this.enabled = false;

					this.$$mouseUp = (event) => {
						$document.off('mouseup', this.$$mouseUp);
						$document.off('mousemove', this.$$mouseMove);

						this.offset.x = this.offset.y = 0;

						this.ondragStop(event);
					};
					this.$$mouseDown = (event) => {
						if(~DRAGGABLE_EXCLUDED_ELEMENTS.indexOf(event.target.nodeName.toLowerCase()) || event.which !== 1)
							return false;

						this._updateMousePosition(event);
						this._updateLastMousePosition();
						this._updatePosition();
						this._updateSize();

						this.ondragStart(event);

						$document.on('mousemove', this.$$mouseMove);
						$document.on('mouseup', this.$$mouseUp);

						event.preventDefault();
						event.stopPropagation();
					};
					this.$$mouseMove = (event) => {

						if(!this._isMoved(event))
							return false;

						this.max.left = this._getContainerWidth() - 1;

						this._updateMousePosition(event);

						var pxMoved = this._getPixelMoved();

						this.offset.x = this.offset.y = 0;

						this._updateLastMousePosition();

						this._fixLeftBoundary(pxMoved);
						this._fixTopBoundary(pxMoved);

						this._movePosition(pxMoved);

						this._updatePositionStyle();

						this.ondrag(event);

						event.stopPropagation();
						event.preventDefault();
					};
				}

				get container() {
					return angular.element(this.document.querySelector(this._container));
				}
				set container(value) {
					this._container = value;
				}

				get handle() {
					return this._handle !== '' ? angular.element(this.element[0].querySelector(this._handle)) : this.element;
				}
				set handle(value) {
					//disable the handler modification if the draggable is currently enabled
					this._handle = this.enabled ? this._handle : value;
				}

				get sizeW() {
					return this.element[0].offsetWidth;
				}
				get sizeH() {
					return this.element[0].offsetHeight;
				}

				get posX() {
					var val = parseInt(this.element.css('left'), 10);
					return isNaN(val) ? 0 : val;
				}
				get posY() {
					var val =  parseInt(this.element.css('top'), 10);
					return isNaN(val) ? 0 : val;
				}

				_updateSize() {
					this.size.width = this.sizeW;
					this.size.height = this.sizeH;
				}

				_updatePosition() {
					this.position.x = this.posX;
					this.position.y = this.posY;
				}

				_movePosition(position = {x:0,y:0}) {
					this.position.x += position.x;
					this.position.y += position.y;
				}

				_updateMousePosition(event) {
					this.mouse.current.x = event.pageX;
					this.mouse.current.y = event.pageY;
				}

				_updateLastMousePosition() {
					this.mouse.last.x = this.mouse.current.x;
					this.mouse.last.y = this.mouse.current.y;
				}

				_updatePositionStyle() {
					this.element.css({ 'top': this.position.y + 'px','left': this.position.x + 'px' });
				}

				_getContainerWidth() {
					return this.container[0].offsetWidth;
				}

				_isMoved(event) {
					return event.pageX !== this.mouse.last.x || event.pageY !== this.mouse.last.y;
				}

				_getPixelMoved() {
					var x = this.mouse.current.x - this.mouse.last.x + this.offset.x,
						y = this.mouse.current.y - this.mouse.last.y + this.offset.y;

					return {x,y};
				}

				_fixLeftBoundary(pxMoved) {

					var dX = pxMoved.x;

					if (this.position.x + dX < this.min.left) {
						pxMoved.x = this.min.left - this.position.x;
						this.offset.x = dX - pxMoved.x;
					}
					else
						if (this.position.x + this.size.width + dX > this.max.left) {
							pxMoved.x = this.max.left - this.position.x - this.size.width;
							this.offset.x = dX - pxMoved.x;
						}
				}

				_fixTopBoundary(pxMoved) {

					var dY = pxMoved.y;

					if (this.position.y + dY < this.min.top) {
						pxMoved.y = this.min.top - this.position.y;
						this.offset.y = dY - pxMoved.y;
					}
					else
						if (this.position.y + this.size.height + dY > this.max.top) {
							pxMoved.y = this.max.top - this.position.y - this.size.height;
							this.offset.y = dY - pxMoved.y;
						}
				}

				enable() {
					$timeout(() => {
						this.disable();
						this.handle.on('mousedown', this.$$mouseDown);
						this.enabled = true;
					});
				}

				disable() {
					if(!this.enabled)
						return false;

					$document.off('mouseup', this.$$mouseUp);
					$document.off('mousemove', this.$$mouseMove);

					if(this._handle !== '')
						this.handle.off('mousedown', this.$$mouseDown);

					this.enabled = false;
				}

				destroy() {
					this.disable();
				}

			}

			return Draggable;

		}];

	});
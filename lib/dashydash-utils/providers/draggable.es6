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

						this._updateLastMousePosition();
						this._updatePosition();
						this._updateSize();

						this.ondragStart(event);

						$document.on('mousemove', this.$$mouseMove);
						$document.on('mouseup', this.$$mouseUp);

						this.ondragStart(event);

						event.preventDefault();
						event.stopPropagation();
					};
					this.$$mouseMove = (event) => {

						if(this._isMoved(event))
							return false;

						this.max.left = this._getContainerWidth() - 1;

						this._updateMousePosition(event);

						var diff = {};
						diff.x = this.mouse.current.x - this.mouse.last.x + this.offset.x;
						diff.y = this.mouse.current.y - this.mouse.last.y + this.offset.y;

						this.offset.x = this.offset.y = 0;

						this._updateLastMousePosition();

						var dX = diff.x,
							dY = diff.y;
						if (this.position.x + dX < this.min.left) {
							diff.x = this.min.left - this.position.x;
							this.offset.x = dX - diff.x;
						}
						else
						if (this.position.x + this.size.width + dX > this.max.left) {
							diff.x = this.max.left - this.position.x - this.size.width;
							this.offset.x = dX - diff.x;
						}

						if (this.position.y + dY < this.min.top) {
							diff.y = this.min.top - this.position.y;
							this.offset.y = dY - diff.y;
						}
						else
						if (this.position.y + this.size.height + dY > this.max.top) {
							diff.y = this.max.top - this.position.y - this.size.height;
							this.offset.y = dY - diff.y;
						}

						this.position.x += diff.x;
						this.position.y += diff.y;

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
					return parseInt(this.container.css('width'), 10);
				}

				_isMoved(event) {
					return event.pageX === this.mouse.last.x || event.pageY === this.mouse.last.y;
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
angular.module('Dashydash-utils')
	.provider('Dashydash-utils.providers.draggable', function() {

		this.$get = ['$document', '$window', '$timeout', 'Dashydash-utils.providers.DOMElement', 'Dashydash-utils.constants.draggableExcludedElements',
			($document, $window, $timeout, DOMElement, DRAGGABLE_EXCLUDED_ELEMENTS) => {

			class Draggable extends DOMElement{

				constructor({element:$node, container:container, ghost:ghost, fixed:fixed, handle:handle, ondragStart:ondragStart, ondragStop:ondragStop, ondrag:ondrag, directions: directions,diagonalRestrictions: diagonalRestrictions,scrollSensitivity:scrollSensitivity,scrollSpeed:scrollSpeed}) {
					super({element:$node, container:container});

					this.ghost = ghost;

					this.size = { width:0,height:0 };
					this.position = { current : { x:0,y:0 }, last : { x:0,y:0 } };
					this.mouse = { current : { x:0,y:0 }, last : { x:0,y:0 } };
					this.offset = { x:0,y:0 };

					this.min = { left:0,top:0 };
					this.max = { left:9999,top:9999 };

					this.fixed = fixed;

					this.ondragStart = ondragStart;
					this.ondragStop = ondragStop;
					this.ondrag = ondrag;
					this._handle = handle;

					this.scrollSensitivity = scrollSensitivity;
					this.scrollSpeed = scrollSpeed;

					this.allowedDirections = directions;
					this.diagonalRestrictions = diagonalRestrictions;

					this.enabled = false;

					this.parentNode = undefined;

					this.$$mouseUp = (event) => {

						this._attachElementToNativeParent();
						$document.off('mouseup', this.$$mouseUp);
						$document.off('mousemove', this.$$mouseMove);

						this.offset.x = this.offset.y = 0;

						if(this.fixed) {
							this._rollbackPosition();
							this._updateElementStyle();
						}

						this.$$ondragStop(event, this._serialize());

						event.preventDefault();
						event.stopPropagation();
					};
					this.$$mouseDown = (event) => {
						if(this._shouldBeHandled(event) || !this._isLeftClicked(event))
							return false;

						this._updateMousePosition(event);
						this._updateLastMousePosition();
						this._updatePosition();
						this._updateSize();
						this._attachElementToContainer();
						this._updateElementStyle();

						if(this.fixed)
							this._saveRootPosition();

						this.$$ondragStart(event, this._serialize());

						$document.on('mousemove', this.$$mouseMove);
						$document.on('mouseup', this.$$mouseUp);

						event.preventDefault();
						event.stopPropagation();
					};
					this.$$mouseMove = (event) => {

						if(!this._isMoved(event))
							return false;

						this.min.left = this.containerPosX;
						this.min.top = this.containerPosY;
						this.max.left = this.containerPosX + this.containerSizeW - 2;
						this.max.top = this.containerPosY + this.containerSizeH - 2;

						this._updateMousePosition(event);

						var pxMoved = this._getPixelMoved(),
							delta = this._getDelta();

						if(!this._shouldBeDragged(pxMoved))
							return false;

						this.offset.x = this.offset.y = 0;

						this._updateLastMousePosition();

						this._fixLeftRightBoundaries(pxMoved);
						this._fixTopBottomBoundaries(pxMoved);

						if(this._isRestrictedToMoveDiagonaly(pxMoved))
							this._applyDiagonalRestrictions(pxMoved);

						this._movePosition(pxMoved);

						this.$$ondrag(event, this._serialize(), delta, pxMoved);
						this._updateElementStyle();

						this._scroll(event);

						event.stopPropagation();
						event.preventDefault();
					};
				}

				get ghostRect() {
					return this.ghost[0].getBoundingClientRect();
				}

				get ghostSizeW() {
					return ~~this.ghostRect.width;
				}
				get ghostSizeH() {
					return ~~this.ghostRect.height;
				}

				get handle() {
					return this._handle !== '' ? angular.element(this.element[0].querySelector(this._handle)) : this.element;
				}
				set handle(value) {
					//disables the handler modification if the draggable is currently enabled
					this._handle = this.enabled ? this._handle : value;
				}

				get target() {
					return this.ghost || this.element;
				}

				get targetSizeW() {
					return this.ghost? this.ghostSizeW : this.sizeW;
				}
				get targetSizeH() {
					return this.ghost? this.ghostSizeH : this.sizeH;
				}

				_serialize() {
					return {
						position: this.position.current,
						size: this.size
					};
				}

				_attachElementToContainer() {
					this.parentNode = this.target[0].parentNode;
					this.container[0].appendChild(this.target[0]);
				}

				_attachElementToNativeParent() {
					this.parentNode.appendChild(this.target[0]);
					this.parentNode = undefined;
				}
				_updateSize() {

					this.size.width = this.targetSizeW;
					this.size.height = this.targetSizeH;
				}

				_rollbackPosition() {
					this.position.current.x = this.position.last.x;
					this.position.current.y = this.position.last.y;
				}

				_saveRootPosition() {
					this.position.last.x = this.position.current.x;
					this.position.last.y = this.position.current.y;
				}

				_updatePosition() {
					this.position.current.x = this.posX;
					this.position.current.y = this.posY;
				}

				_movePosition(position = {x:0,y:0}) {

					if(this._isAllowedToMoveTowardTop(position) && this._isMovedTowardTop(position))
						this.position.current.y += position.y;
					else
					if(this._isAllowedToMoveTowardBottom(position) && this._isMovedTowardBottom(position))
						this.position.current.y += position.y;

					if(this._isAllowedToMoveTowardLeft(position) && this._isMovedTowardLeft(position))
						this.position.current.x += position.x;
					else
					if(this._isAllowedToMoveTowardRight(position) && this._isMovedTowardRight(position))
						this.position.current.x += position.x;
				}

				_applyDiagonalRestrictions(position = {x:0,y:0}) {

					var currentPosition = {x:position.x, y:position.y};

					var valAbs = Math.abs(position.y);
					if(this._isAllowedToMoveTowardTopRight(currentPosition) && this._isMovedTowardTopRight(currentPosition)) {
						position.x = position.y = valAbs;
						position.y *= -1;
					}
					else
					if(this._isAllowedToMoveTowardTopLeft(currentPosition) && this._isMovedTowardTopLeft(currentPosition))
						position.x = position.y = valAbs *= -1;
					else
					if(this._isAllowedToMoveTowardBottomLeft(currentPosition) && this._isMovedTowardBottomLeft(currentPosition)) {
						position.x = position.y = valAbs;
						position.x *= -1;
					}
					else
					if(this._isAllowedToMoveTowardBottomRight(currentPosition) && this._isMovedTowardBottomRight(currentPosition))
						position.x = position.y = valAbs;
					else
						position.x = position.y = 0;
				}

				_shouldBeDragged() {
					return true;
				}

				_isRestrictedToMoveDiagonaly() {
					return this.diagonalRestrictions.length > 0;
				}

				_isMovedTowardTopLeft(position) {
					return this._isMovedTowardTop(position) && this._isMovedTowardLeft(position);
				}

				_isMovedTowardTopRight(position) {
					return this._isMovedTowardTop(position) && this._isMovedTowardRight(position);
				}

				_isMovedTowardBottomLeft(position) {
					return this._isMovedTowardBottom(position) && this._isMovedTowardLeft(position);
				}

				_isMovedTowardBottomRight(position) {
					return this._isMovedTowardBottom(position) && this._isMovedTowardRight(position);
				}

				_isAllowedToMoveTowardTop() {
					return !!~this.allowedDirections.indexOf('n');
				}

				_isAllowedToMoveTowardBottom() {
					return !!~this.allowedDirections.indexOf('s');
				}

				_isAllowedToMoveTowardRight() {
					return !!~this.allowedDirections.indexOf('e');
				}

				_isAllowedToMoveTowardLeft() {
					return !!~this.allowedDirections.indexOf('w');
				}

				_isAllowedToMoveTowardTopLeft() {
					return !!~this.diagonalRestrictions.indexOf('ne');
				}

				_isAllowedToMoveTowardBottomLeft() {
					return !!~this.diagonalRestrictions.indexOf('se');
				}

				_isAllowedToMoveTowardTopRight() {
					return !!~this.diagonalRestrictions.indexOf('nw');
				}

				_isAllowedToMoveTowardBottomRight() {
					return !!~this.diagonalRestrictions.indexOf('sw');
				}

				_isMovedTowardTop(pxMoved) {
					return pxMoved.y < 0;
				}

				_isMovedTowardBottom(pxMoved) {
					return pxMoved.y > 0;
				}

				_isMovedTowardLeft(pxMoved) {
					return pxMoved.x < 0;
				}

				_isMovedTowardRight(pxMoved) {
					return pxMoved.x > 0;
				}

				_updateMousePosition(event) {
					this.mouse.current.x = event.pageX;
					this.mouse.current.y = event.pageY;
				}

				_updateLastMousePosition() {
					this.mouse.last.x = this.mouse.current.x;
					this.mouse.last.y = this.mouse.current.y;
				}

				_updateElementStyle() {
					var css = {
						'top': `${this._getPosYByContainer()+this.container[0].scrollTop}px`/*fix position on scroll*/,
						'left': `${this._getPosXByContainer()+this.container[0].scrollLeft}px`/*fix position on scroll*/ 
					}
					if(this.size.width)
						css.width = `${this.size.width}px`;
					if(this.size.height)
						css.height = `${this.size.height}px`;
					this.target.css(css);
				}

				_isMoved(event) {
					return event.pageX !== this.mouse.last.x || event.pageY !== this.mouse.last.y;
				}

				_getPosXByContainer() {
					return this.position.current.x- this.containerPosX;
				}

				_getPosYByContainer() {
					return this.position.current.y - this.containerPosY;
				}

				_getPixelMoved() {

					var delta = this._getDelta(),
						x = delta.x + this.offset.x,
						y = delta.y + this.offset.y;

					return {x,y};
				}

				_getDelta() {
					var x = this.mouse.current.x - this.mouse.last.x,
						y = this.mouse.current.y - this.mouse.last.y;

					return {x,y};
				}

				_fixLeftRightBoundaries(pxMoved) {

					var dX = pxMoved.x;
					if (this.position.current.x + dX < this.min.left) {
						pxMoved.x = this.min.left - this.position.current.x;
						this.offset.x = dX - pxMoved.x;
					}
					else
					if (this.position.current.x + this.size.width + dX > this.max.left) {
						pxMoved.x = this.max.left - this.position.current.x - this.size.width;
						this.offset.x = dX - pxMoved.x;
					}
				}

				_fixTopBottomBoundaries(pxMoved) {

					var dY = pxMoved.y;

					if (this.position.current.y + dY < this.min.top) {
						pxMoved.y = this.min.top - this.position.current.y;
						this.offset.y = dY - pxMoved.y;
					}
					else
					if (this.position.current.y + this.size.height + dY > this.max.top) {
						pxMoved.y = this.max.top - this.position.current.y - this.size.height;
						this.offset.y = dY - pxMoved.y;
					}
				}

				_isLeftClicked(event) {
					return event.which === 1;
				}

				_shouldBeHandled(event) {
					return !!~DRAGGABLE_EXCLUDED_ELEMENTS.indexOf(event.target.nodeName.toLowerCase());
				}

				/*currently chrome only*/
				_scroll(event) {
					if (event.pageY - this.document.body.scrollTop < this.scrollSensitivity)
						this.document.body.scrollTop = this.document.body.scrollTop - this.scrollSpeed;
					else
						if ($window.innerHeight - (event.pageY - this.document.body.scrollTop) < this.scrollSensitivity)
							this.document.body.scrollTop = this.document.body.scrollTop + this.scrollSpeed;

					if (event.pageX - this.document.body.scrollLeft < this.scrollSensitivity)
						this.document.body.scrollLeft = this.document.body.scrollLeft - this.scrollSpeed;
					else
						if ($window.innerWidth - (event.pageX - this.document.body.scrollLeft) < this.scrollSensitivity)
							this.document.body.scrollLeft = this.document.body.scrollLeft + this.scrollSpeed;
				}

				$$ondrag(...parameters) {
					this.ondrag(...parameters);
				}

				$$ondragStart(...parameters) {
					this.ondragStart(...parameters);
				}

				$$ondragStop(...parameters) {
					this.ondragStop(...parameters);
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
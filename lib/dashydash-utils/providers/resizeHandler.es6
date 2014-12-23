angular.module('Dashydash-utils')
	.provider('Dashydash-utils.providers.resizeHandler', function() {

		this.$get = ['Dashydash-utils.providers.draggable', 
		(DraggableProvider) => {

			class ResizeHandler extends DraggableProvider {

				constructor(type, target, ...options) {

					super(...options);

					this.target = target;
					this.targetPosition = { x:0, y:0 };
					this.targetSize = { width:0, height:0 };

				}

				get targetRect() {
					return this.target[0].getBoundingClientRect();
				}

				get targetSizeW() {
					return ~~this.targetRect.width;
				}
				get targetSizeH() {
					return ~~this.targetRect.height;
				}

				get targetPosX() {
					return this.targetRect.x;
				}
				get targetPosY() {
					return this.targetRect.y;
				}

				_updateSizeStyle() {
					this.target.css({
						top: this.targetPosition.x + 'px',
						left: this.targetPosition.y + 'px',
						width: this.targetSize.width + 'px',
						height: this.targetSize.height + 'px'
					});
				}

				$$ondrag(...parameters) {
					
					// top left
					// this.targetPosition.x += parameters[2].y;
					// this.targetPosition.y += parameters[2].x;
					// this.targetSize.width += parameters[2].x * -1;
					// this.targetSize.height += parameters[2].y * -1;
					

					// bottom right
					this.targetSize.width += parameters[2].x;
					this.targetSize.height += parameters[2].y;

					this._updateSizeStyle();
				}

				$$ondragStart(...parameters) {

					this.targetSize.width = this.targetSizeW;
					this.targetSize.height = this.targetSizeH;
					this.targetPosition.x = this.targetPosX;
					this.targetPosition.y = this.targetPosY;
					this.ondragStart(...parameters);
				}

				$$ondragStop(...parameters) {
					this.ondragStop(...parameters);
				}
			}

			return ResizeHandler;
		}];
	});
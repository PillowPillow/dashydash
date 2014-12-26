angular.module('Dashydash-utils')
	.provider('Dashydash-utils.providers.resizeHandler', function() {

		this.$get = ['Dashydash-utils.services.utils', 'Dashydash-utils.providers.draggable', 'DRAGGABLE_CONFIGURATION', 
		(utils, Draggable, DRAGGABLE_CONFIGURATION) => {

			class ResizeHandler extends Draggable {

				constructor({type: type, target:target, element:$node, container:container, onresizeStart:onresizeStart, onresizeStop:onresizeStop, onresize:onresize}) {

					var configuration = {element:$node, container:container, onresizeStart:onresizeStart, onresizeStop:onresizeStop, onresize:onresize};
					utils.extend(configuration, DRAGGABLE_CONFIGURATION, configuration);

					super(configuration);

					this.target = target;
					this.targetPosition = { x:0, y:0 };
					this.targetSize = { width:0, height:0 };

					this.targetSize.width = this.targetSizeW;
					this.targetSize.height = this.targetSizeH;
					this.targetPosition.x = this.targetPosY;
					this.targetPosition.y = this.targetPosX;
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
					return ~~this.targetRect.left;
				}
				get targetPosY() {
					return ~~this.targetRect.top;
				}

				_updateElementStyle() {
					this.target.css({
						top: this.targetPosition.x + 'px',
						left: this.targetPosition.y + 'px',
						width: this.targetSize.width + 'px',
						height: this.targetSize.height + 'px'
					});
				}

				_shouldBeDragged(pxMoved) {
					var status = super(pxMoved);

					return true;
				}

				$$ondrag(...parameters) {
					
					// top left
					// if(parameters[3].x !== 0 && parameters[3].y !== 0) 
						// this.targetPosition.x += parameters[2].y;
						// this.targetPosition.y += parameters[2].x;

					// this.targetSize.width += parameters[2].x * -1;
					// this.targetSize.height += parameters[2].y * -1;
					


					// bottom right
					this.targetSize.width += parameters[2].x;
					this.targetSize.height += parameters[2].y;
					super(...parameters);
				}

				$$ondragStart(...parameters) {

					// this.targetSize.width = this.targetSizeW;
					// this.targetSize.height = this.targetSizeH;
					// this.targetPosition.x = this.targetPosY;
					// this.targetPosition.y = this.targetPosX;
					super(...parameters);
				}

				$$ondragStop(...parameters) {
					super(...parameters);
				}
			}

			return ResizeHandler;
		}];
	});
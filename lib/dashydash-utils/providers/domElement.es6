angular.module('Dashydash-utils')	
	.provider('Dashydash-utils.providers.DOMElement', function() {

		this.$get =  ['$document', ($document) => {

			class DOMElement {

				constructor({element:$node, container:container}) {

					this.document = $document[0];

					this.element = $node;
					this.container = container;

				}

				get elementRect() {
					return this.element[0].getBoundingClientRect();
				}

				get sizeW() {
					return ~~this.elementRect.width;
				}
				get sizeH() {
					return ~~this.elementRect.height;
				}

				get posX() {
					return ~~this.elementRect.left + this.container[0].scrollLeft;
				}
				get posY() {
					return ~~this.elementRect.top + this.container[0].scrollTop;
				}

				get containerRect() {
					return !!this._container ? this.container[0].getBoundingClientRect() : this._getDocumentRect();
				}

				get container() {
					return angular.element( !!this._container ? this._container  : this.document.querySelector('body'));
				}
				set container(value) {
					this._container = typeof value !== 'string' ? value : this.document.querySelector(value);
				}

				get containerSizeW() {
					return ~~this.containerRect.width;
				}
				get containerSizeH() {
					return ~~this.containerRect.height;
				}

				get containerPosX() {
					return ~~this.containerRect.left + this.document.body.scrollLeft;
				}
				get containerPosY() {
					return ~~this.containerRect.top + this.document.body.scrollTop;
				}

				_getDocumentRect() {
					return { width: ~~this.document.body.clientWidth, height: 99999, x: 0, y: 0 };
				}
			}

			return DOMElement;
		}];

	});
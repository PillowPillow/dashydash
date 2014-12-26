angular.module('Dashydash-utils')	
	.provider('Dashydash-utils.providers.DOMElement', function() {

		this.$get =  ['$document', ($document) => {

			class DOMElement {

				constructor({element:$node, container:container}) {

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
					return ~~this.elementRect.left;
				}
				get posY() {
					return ~~this.elementRect.top;
				}

				get containerRect() {
					return !!this._container ? this.container[0].getBoundingClientRect() : this._getDocumentRect();
				}

				get container() {
					return !!this._container ? angular.element(this._container) : $document;
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
					return ~~this.containerRect.left;
				}
				get containerPosY() {
					return ~~this.containerRect.top;
				}
			}

			return DOMElement;
		}];

	});
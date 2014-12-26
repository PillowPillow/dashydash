angular.module('Dashydash')
	.provider('Dashydash.providers.grid', function() {
		
		this.$get = ['$document', 'Dashydash-utils.providers.DOMElement',
			($document, DOMElement) => {

			class Grid extends DOMElement {

				constructor({element:$node, container:container}) {

					super({element:$node, container:container});

					this.grid = [];

				}


			}

			return Grid;
		}];
	});
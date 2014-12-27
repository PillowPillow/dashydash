angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = ['$document', 'Dashydash-utils.providers.DOMElement',
			($document, DOMElement) => {

			class Item extends DOMElement {

				constructor({element:$node, container:container}) {

					super({element:$node, container:container});

				}
			}

			return Item;
		}];
	});
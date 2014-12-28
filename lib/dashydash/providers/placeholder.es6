angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder',  function() {
	
		this.$get = ['Dashydash-utils.providers.DOMElement',
		(DOMElement) => {

			class Placeholder extends DOMElement {

				constructor({element:$node, grid: grid}) {
					
					super({element:$node});

					this.element = $node;
					this.grid = grid;

					this.itemDragged = false;

					this.position = { current:{x:0,y:0}, last:{x:0,y:0} };
				}
			}

			return Placeholder;
		}];
	});
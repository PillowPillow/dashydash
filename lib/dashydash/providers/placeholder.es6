angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder',  function() {
	
		this.$get = [
		'Dashydash.providers.item', 
		(Item) => {

			class Placeholder extends Item {

				constructor({element:$node, grid: grid}) {
					
					super({element:$node});

					this.element = $node;
					this.grid = grid;

					this.itemDragged = false;
				}

				enableAnimation() {
					this.itemDragged = true;
				}

				disableAnimation() {
					this.itemDragged = true;
				}
			}

			return Placeholder;
		}];
	});
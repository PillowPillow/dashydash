angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder',  function() {
	
		this.$get = [
		'Dashydash.providers.item', 
		(Item) => {

			class Placeholder extends Item {

				constructor({element:$node, grid: grid, row:row, column: col, width:width, height:height}) {
					
					super({row:row, column: col, width:width, height:height});

					this.element = $node;
					this.grid = grid;

					this.itemDragged = false;
				}

				enableAnimation() {
					this.itemDragged = true;
				}

				disableAnimation() {
					this.itemDragged = false;
				}
			}

			return Placeholder;
		}];
	});
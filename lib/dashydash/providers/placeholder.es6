angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder', function() {
	
		this.$get = () => {

			class Placeholder {

				constructor({element:$node, grid: grid}) {
					
					this.element = $node;
					this.grid = grid;
				}
			}

			return Placeholder;
		};
	});
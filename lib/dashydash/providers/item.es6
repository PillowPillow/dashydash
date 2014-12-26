angular.module('Dashydash')
	.provider('Dashydash.providers.item', function() {
		
		this.$get = () => {

			class Item {

				constructor() {

				}
			}

			return Item;
		};
	});
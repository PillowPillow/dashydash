angular.module('Dashydash')
	.provider('Dashydash.providers.widget', function() {
		
		this.$get = () => {

			class Widget {

				constructor() {

				}
			}

			return Widget;
		};
	});
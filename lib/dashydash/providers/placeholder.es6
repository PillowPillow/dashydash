angular.module('Dashydash')
	.provider('Dashydash.providers.placeholder', function() {
	
		this.$get = () => {

			class Placeholder {

				constructor() {
					
				}
			}

			return Placeholder;
		};
	});
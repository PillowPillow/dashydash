angular.module('Dashydash-utils')
	.service('Dashydash-utils.services.utils', function(){
		
		var prototype = {};

		prototype.extend = extend;

		return prototype;

		function extend(toExtend = {}, src = {}, strict = true) {

			var extended = {};
			angular.extend(extended, src, toExtend);
			if(strict) {

				let keys = Object.keys(extended);
				for(let i = 0; i<keys.length; i++) {
					if(!src[keys[i]])
						delete extended[keys[i]];
				}
			}

			return extended;
		}

	});
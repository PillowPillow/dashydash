angular.module('Dashydash-utils')
	.service('Dashydash-utils.services.utils', function(){
		
		var prototype = {};

		prototype.extend = extend;

		return prototype;

		function extend(target, ...sources) {

			for(var i = sources.length-1; i>=0; i--)  {
				let source = sources[i];
				for(let key in source)
					if(target[key] === null || target[key] === undefined)
						target[key] = source[key];
			}

			return target;
		}

	});